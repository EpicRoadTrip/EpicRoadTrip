package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"fmt"
	"log"

	"googlemaps.github.io/maps"
)

func GetAccomodations(location string) ([]models.Accommodation, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	r := &maps.TextSearchRequest{
		Query: location + " logement hotel",
		//Query: location,
	}

	resp, err := client.TextSearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	accommodations := make([]models.Accommodation, len(resp.Results))
	for i, result := range resp.Results {
		accommodations[i] = mapPlacesSearchResultToAccommodation(result)
	}

	return accommodations, nil
}

func mapPlacesSearchResultToAccommodation(result maps.PlacesSearchResult) models.Accommodation {
	accommodation := models.Accommodation{
		PlaceID:  result.PlaceID,
		Name:     result.Name,
		Address:  result.FormattedAddress,
		Location: fmt.Sprintf("%f,%f", result.Geometry.Location.Lat, result.Geometry.Location.Lng),
	}

	if len(result.Photos) > 0 {
		accommodation.Photo = getPhotoURL(result.Photos[0].PhotoReference)
	}

	return accommodation
}

func getPhotoURL(photoReference string) string {
	googleKey := config.GetVarEnv()["googleKey"]

	photoURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s", photoReference, googleKey)

	return photoURL
}
