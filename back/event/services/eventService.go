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

func GetEvents(location string) ([]models.Event, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	location = strings.ReplaceAll(location, " ", "-")

	r := &maps.TextSearchRequest{
		Query: "event in " + location,
		//Query: location,
	}

	resp, err := client.TextSearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	events := make([]models.Event, len(resp.Results))
	for i, result := range resp.Results {
		events[i] = mapPlacesSearchResultToBar(result)
	}

	return events, nil
}

func mapPlacesSearchResultToBar(result maps.PlacesSearchResult) models.Event {
	event := models.Event{
		PlaceID:  result.PlaceID,
		Name:     result.Name,
		Address:  result.FormattedAddress,
		Location: fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
	}

	if len(result.Photos) > 0 {
		event.Photo = getPhotoURL(result.Photos[0].PhotoReference)
	}

	return event
}

func getPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s", photoReference, googleKey)

	return photoURL
}
