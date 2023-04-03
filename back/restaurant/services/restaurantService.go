package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"fmt"
	"log"

	"googlemaps.github.io/maps"
)

func GetRestaurants(location string) ([]models.Restaurant, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	r := &maps.TextSearchRequest{
		Query: location + " restaurants",
		//Query: location,
	}

	resp, err := client.TextSearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	restaurants := make([]models.Restaurant, len(resp.Results))
	for i, result := range resp.Results {
		restaurants[i] = mapPlacesSearchResultToRestaurant(result)
	}

	return restaurants, nil
}

func mapPlacesSearchResultToRestaurant(result maps.PlacesSearchResult) models.Restaurant {
	restaurant := models.Restaurant{
		PlaceID:  result.PlaceID,
		Name:     result.Name,
		Address:  result.FormattedAddress,
		Location: fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
	}

	if len(result.Photos) > 0 {
		restaurant.Photo = getPhotoURL(result.Photos[0].PhotoReference)
	}

	return restaurant
}

func getPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s", photoReference, googleKey)

	return photoURL
}
