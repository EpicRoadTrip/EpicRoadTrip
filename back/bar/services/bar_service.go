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

func GetBars(location string) ([]models.Bar, error) {
	location = strings.ReplaceAll(strings.TrimSpace(location), " ", "-")

	r := &maps.TextSearchRequest{
		Query: location + " bar",
	}

	resp, err := mapsClient.TextSearch(context.Background(), r)
	if err != nil {
		return nil, fmt.Errorf("text search error: %w", err)
	}

	bars := make([]models.Bar, len(resp.Results))

	for i, result := range resp.Results {
		bar := MapPlacesSearchResultToBar(result)

		descriptionBar, err := GetBarSummary(result.PlaceID)
		if err != nil {
			log.Printf("Failed to get description for placeID %s, error: %v", result.PlaceID, err)
		} else {
			bar.Description = descriptionBar.Description
		}

		bars[i] = bar
	}

	return bars, nil
}

func GetBarSummary(placeID string) (models.Bar, error) {
	r := &maps.PlaceDetailsRequest{
		PlaceID: placeID,
	}

	resp, err := mapsClient.PlaceDetails(context.Background(), r)
	if err != nil {
		return models.Bar{}, fmt.Errorf("place details error: %w", err)
	}

	if resp.EditorialSummary != nil && resp.EditorialSummary.Overview != "" {
		return models.Bar{
			Description: resp.EditorialSummary.Overview,
		}, nil
	}

	return models.Bar{
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

func MapPlacesSearchResultToBar(result maps.PlacesSearchResult) models.Bar {

	priceLevel := int(result.PriceLevel)
	if priceLevel == 0 {
		priceLevel = -1
	}

	bar := models.Bar{
		PlaceID:     result.PlaceID,
		Name:        result.Name,
		Address:     result.FormattedAddress,
		Location:    fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
		PriceLevel:  PriceLevelToString(priceLevel),
		Description: "",
	}

	if len(result.Photos) > 0 {
		bar.Photo = GetPhotoURL(result.Photos[0].PhotoReference)
	}

	return bar
}

func GetPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("%s&photo_reference=%s&key=%s", BASE_URL, url.QueryEscape(photoReference), url.QueryEscape(googleKey))

	return photoURL
}
