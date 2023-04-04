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

func GetBars(location string) ([]models.Bar, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	location = strings.ReplaceAll(location, " ", "-")

	r := &maps.TextSearchRequest{
		Query: location + " bars",
		//Query: location,
	}

	resp, err := client.TextSearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	bars := make([]models.Bar, len(resp.Results))
	for i, result := range resp.Results {
		bars[i] = mapPlacesSearchResultToBar(result)
	}

	return bars, nil
}

func mapPlacesSearchResultToBar(result maps.PlacesSearchResult) models.Bar {
	bar := models.Bar{
		PlaceID:  result.PlaceID,
		Name:     result.Name,
		Address:  result.FormattedAddress,
		Location: fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
	}

	if len(result.Photos) > 0 {
		bar.Photo = getPhotoURL(result.Photos[0].PhotoReference)
	}

	return bar
}

func getPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s", photoReference, googleKey)

	return photoURL
}
