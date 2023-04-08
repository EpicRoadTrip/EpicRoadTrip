package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"

	"googlemaps.github.io/maps"
)

const BASE_URL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400"

var mapsClient *maps.Client

func init() {
	var err error
	mapsClient, err = NewMapsClient()
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
}

func NewMapsClient() (*maps.Client, error) {
	googleKey := config.GetVarEnv()["googleKey"]
	return maps.NewClient(maps.WithAPIKey(googleKey))
}

func GetAccomodations(location string) ([]models.Accommodation, error) {
	location = strings.ReplaceAll(strings.TrimSpace(location), " ", "-")

	r := &maps.TextSearchRequest{
		Query: location + " logement hotel",
	}

	resp, err := mapsClient.TextSearch(context.Background(), r)
	if err != nil {
		return nil, fmt.Errorf("text search error: %w", err)
	}

	accommodations := make([]models.Accommodation, len(resp.Results))

	for i, result := range resp.Results {
		accommodation := MapPlacesSearchResultToAccommodation(result)

		descriptionAccommodation, err := GetAccomodationSummary(result.PlaceID)
		if err != nil {
			log.Printf("Failed to get description for placeID %s, error: %v", result.PlaceID, err)
		} else {
			accommodation.Description = descriptionAccommodation.Description
		}

		accommodations[i] = accommodation
	}

	return accommodations, nil
}

func GetAccomodationSummary(placeID string) (models.Accommodation, error) {
	r := &maps.PlaceDetailsRequest{
		PlaceID: placeID,
	}

	resp, err := mapsClient.PlaceDetails(context.Background(), r)
	if err != nil {
		return models.Accommodation{}, fmt.Errorf("place details error: %w", err)
	}

	if resp.EditorialSummary != nil && resp.EditorialSummary.Overview != "" {
		return models.Accommodation{
			Description: resp.EditorialSummary.Overview,
		}, nil
	}

	return models.Accommodation{
		Description: "",
	}, nil
}

func PriceLevelToString(priceLevel int) string {
	switch priceLevel {
	case -1:
		return "Not available"
	case 0:
		return "Free"
	case 1:
		return "Inexpensive"
	case 2:
		return "Moderate"
	case 3:
		return "Expensive"
	case 4:
		return "Very expensive"
	default:
		return "Unknown"
	}
}

func MapPlacesSearchResultToAccommodation(result maps.PlacesSearchResult) models.Accommodation {

	priceLevel := int(result.PriceLevel)
	if priceLevel == 0 {
		priceLevel = -1
	}

	accommodation := models.Accommodation{
		PlaceID:     result.PlaceID,
		Name:        result.Name,
		Address:     result.FormattedAddress,
		Location:    fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
		PriceLevel:  PriceLevelToString(priceLevel),
		Description: "",
	}

	if len(result.Photos) > 0 {
		accommodation.Photo = GetPhotoURL(result.Photos[0].PhotoReference)
	}

	return accommodation
}

func GetPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("%s&photo_reference=%s&key=%s", BASE_URL, url.QueryEscape(photoReference), url.QueryEscape(googleKey))

	return photoURL
}
