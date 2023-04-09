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

func GetRestaurants(location string) ([]models.Restaurant, error) {
	location = strings.ReplaceAll(strings.TrimSpace(location), " ", "-")

	r := &maps.TextSearchRequest{
		Query: location + " restaurant",
	}

	resp, err := mapsClient.TextSearch(context.Background(), r)
	if err != nil {
		return nil, fmt.Errorf("text search error: %w", err)
	}

	restaurants := make([]models.Restaurant, len(resp.Results))

	for i, result := range resp.Results {
		restaurant := MapPlacesSearchResultTorestaurant(result)

		descriptionrestaurant, err := Getrestaurantsummary(result.PlaceID)
		if err != nil {
			log.Printf("Failed to get description for placeID %s, error: %v", result.PlaceID, err)
		} else {
			restaurant.Description = descriptionrestaurant.Description
		}

		restaurants[i] = restaurant
	}

	return restaurants, nil
}

func Getrestaurantsummary(placeID string) (models.Restaurant, error) {
	r := &maps.PlaceDetailsRequest{
		PlaceID: placeID,
	}

	resp, err := mapsClient.PlaceDetails(context.Background(), r)
	if err != nil {
		return models.Restaurant{}, fmt.Errorf("place details error: %w", err)
	}

	if resp.EditorialSummary != nil && resp.EditorialSummary.Overview != "" {
		return models.Restaurant{
			Description: resp.EditorialSummary.Overview,
		}, nil
	}

	return models.Restaurant{
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

func MapPlacesSearchResultTorestaurant(result maps.PlacesSearchResult) models.Restaurant {

	priceLevel := int(result.PriceLevel)
	if priceLevel == 0 {
		priceLevel = -1
	}

	restaurant := models.Restaurant{
		PlaceID:     result.PlaceID,
		Name:        result.Name,
		Address:     result.FormattedAddress,
		Location:    fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
		PriceLevel:  PriceLevelToString(priceLevel),
		Description: "",
	}

	if len(result.Photos) > 0 {
		restaurant.Photo = GetPhotoURL(result.Photos[0].PhotoReference)
	}

	return restaurant
}

func GetPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("%s&photo_reference=%s&key=%s", BASE_URL, url.QueryEscape(photoReference), url.QueryEscape(googleKey))

	return photoURL
}
