package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"fmt"
	"log"
	"strings"

	"googlemaps.github.io/maps"
)

func GetDetails(placeId string) (models.Detail, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	placeId = strings.ReplaceAll(placeId, " ", "-")

	r := &maps.PlaceDetailsRequest{
		PlaceID:  placeId,
		Language: "fr",
	}

	resp, err := client.PlaceDetails(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	detail := MapPlaceDetailsResultToDetail(resp)

	return detail, nil
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
