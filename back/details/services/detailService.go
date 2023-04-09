package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"googlemaps.github.io/maps"
)

func GetDetails(placeId string) (models.Detail, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		return models.Detail{}, fmt.Errorf("erreur lors de la création du client maps : %s", err)
	}

	placeId = strings.ReplaceAll(placeId, " ", "-")

	r := &maps.PlaceDetailsRequest{
		PlaceID:  placeId,
		Language: "fr",
	}

	resp, err := client.PlaceDetails(context.Background(), r)
	if err != nil {
		return models.Detail{}, fmt.Errorf("erreur lors de la récupération des détails du lieu : %s", err)
	}

	detail := MapPlaceDetailsResultToDetail(resp)

	tripadvisorDescription, err := GetDetailsTripAdvisor(detail.Name, detail.Location)
	if err != nil {
		fmt.Printf("erreur lors de la récupération des détails TripAdvisor : %s", err)
	}

	if tripadvisorDescription != "" {
		detail.Description = tripadvisorDescription
	}

	return detail, nil
}

func GetDetailsTripAdvisor(name string, location string) (string, error) {
	tripAdvisorKey := config.GetVarEnv()["tripAdvisorKey"]

	fmt.Println(name)
	fmt.Println(location)

	name = strings.ReplaceAll(name, " ", "-")

	url := fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/search?language=fr&key=%s&searchQuery=%s&latLong=%s", tripAdvisorKey, name, location)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("accept", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("erreur lors de la récupération des données de TripAdvisor : statut %d", res.StatusCode)
	}

	defer res.Body.Close()

	var result map[string]interface{}
	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&result)
	if err != nil {
		return "", err
	}

	data, ok := result["data"].([]interface{})
	if !ok {
		return "", errors.New("data not found")
	}

	if len(data) == 0 {
		return "", errors.New("no result found")
	}

	firstResult := data[0].(map[string]interface{})
	locationId, ok := firstResult["location_id"].(string)
	if !ok {
		return "", errors.New("location_id not found")
	}

	url = fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/%s/details?key=%s&language=fr&currency=EUD", locationId, tripAdvisorKey)
	req, err = http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("accept", "application/json")
	res, err = http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("erreur lors de la récupération des détails de TripAdvisor : statut %d", res.StatusCode)
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	var dataDetails map[string]interface{}
	err = json.Unmarshal(body, &dataDetails)
	if err != nil {
		return "", err
	}

	description, ok := dataDetails["description"].(string)
	if !ok {
		return "", errors.New("description not found")
	}

	return description, nil
}

func MapPlaceDetailsResultToDetail(result maps.PlaceDetailsResult) models.Detail {
	detail := models.Detail{
		Name:         result.Name,
		Address:      result.FormattedAddress,
		Location:     fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
		Phone:        result.InternationalPhoneNumber,
		OpeningHours: result.OpeningHours.WeekdayText,
		Website:      result.Website,
	}

	if result.EditorialSummary != nil {
		detail.Description = result.EditorialSummary.Overview
	}

	if len(result.Photos) > 0 {
		detail.Photo = GetPhotoURL(result.Photos[0].PhotoReference)
	}

	return detail
}

func GetPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s", photoReference, googleKey)

	return photoURL
}
