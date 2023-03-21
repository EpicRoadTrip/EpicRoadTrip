package services

import (
	"EpicRoadTrip/config"
	"context"
	"log"

	"googlemaps.github.io/maps"
)

func SearchPlace(query string) ([]maps.PlacesSearchResult, error) {

	googleKey := config.GetVarEnv()["googleKey"]
	client, err := maps.NewClient(maps.WithAPIKey(googleKey))

	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	r := &maps.TextSearchRequest{
		Query: query,
	}

	resp, err := client.TextSearch(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	return resp.Results, nil
}
