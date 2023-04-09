package models_test

import (
	"EpicRoadTrip/models"
	"encoding/json"
	"testing"
)

func TestTransportJSONSerialization(t *testing.T) {
	expected := `{"walk":"12h40m42s","drive":"57m36s","bicycl":"3h20m27s","transit":"1h6m56s"}`
	transport := models.Transport{
		Walk:    "12h40m42s",
		Drive:   "57m36s",
		Bicycl:  "3h20m27s",
		Transit: "1h6m56s",
	}

	result, err := json.Marshal(transport)
	if err != nil {
		t.Errorf("Error marshalling transport to JSON: %v", err)
	}

	if string(result) != expected {
		t.Errorf("Unexpected result. Expected: %s, Actual: %s", expected, string(result))
	}
}

func TestLocationsJSONSerialization(t *testing.T) {
	expected := `{"locationDest":"47.218096,-1.555852","locationStart":"47.27377001541292,-2.213751615944555"}`
	locations := models.Locations{
		LocationDest:  "47.218096,-1.555852",
		LocationStart: "47.27377001541292,-2.213751615944555",
	}

	result, err := json.Marshal(locations)
	if err != nil {
		t.Errorf("Error marshalling locations to JSON: %v", err)
	}

	if string(result) != expected {
		t.Errorf("Unexpected result. Expected: %s, Actual: %s", expected, string(result))
	}
}
