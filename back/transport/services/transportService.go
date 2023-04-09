package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"context"
	"log"

	"googlemaps.github.io/maps"
)

func GetTransports(params models.Locations) (models.Transport, error) {
	googleKey := config.GetVarEnv()["googleKey"]

	client, err := maps.NewClient(maps.WithAPIKey(googleKey))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	modes := map[string]maps.Mode{
		"walk":    maps.TravelModeWalking,
		"drive":   maps.TravelModeDriving,
		"bicycl":  maps.TravelModeBicycling,
		"transit": maps.TravelModeTransit,
	}

	transport := models.Transport{}
	for key, mode := range modes {
		duration := ""

		directionsRequest := &maps.DirectionsRequest{
			Origin:      params.LocationStart,
			Destination: params.LocationDest,
			Mode:        mode,
		}

		resp, _, err := client.Directions(context.Background(), directionsRequest)
		if err != nil {
			return transport, err
		}

		//fmt.Println(resp.Results)

		if len(resp) > 0 && len(resp[0].Legs) > 0 {
			duration = resp[0].Legs[0].Duration.String()
		}

		if err != nil {
			log.Printf("Error getting directions for mode %s: %s", key, err)
			continue
		}

		switch key {
		case "walk":
			transport.Walk = duration
		case "drive":
			transport.Drive = duration
		case "bicycl":
			transport.Bicycl = duration
		case "transit":
			transport.Transit = duration
		}
	}

	return transport, nil
}
