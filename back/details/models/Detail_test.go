package models_test

import (
	"EpicRoadTrip/models"
	"reflect"
	"testing"
)

func TestNewAccommodation(t *testing.T) {
	name := "My Accommodation"
	address := "123 Main St"
	photo := "http://example.com/photo.jpg"
	location := "40.123,-74.123"
	phone := "+33 1 45 68 65 00"
	description := "A lovely place to stay"
	openingHours := []string{
		"lundi: 09:30 - 22:45",
		"mardi: 09:30 - 22:45",
		"mercredi: 09:30 – 22:45",
		"jeudi: 09:30 – 22:45",
		"vendredi: 09:30 – 22:45",
		"samedi: 09:30 – 22:45",
		"dimanche: 09:30 – 22:45",
	}
	website := "http://example.com"

	det := models.Detail{
		Name:         name,
		Address:      address,
		Description:  description,
		Photo:        photo,
		Location:     location,
		Phone:        phone,
		OpeningHours: openingHours,
		Website:      website,
	}

	if det.Name != name {
		t.Errorf("Expected Name to be %q, but got %q", name, det.Name)
	}

	if det.Address != address {
		t.Errorf("Expected Address to be %q, but got %q", address, det.Address)
	}

	if det.Photo != photo {
		t.Errorf("Expected Photo to be %q, but got %q", photo, det.Photo)
	}

	if det.Location != location {
		t.Errorf("Expected Location to be %q, but got %q", location, det.Location)
	}

	if det.Description != description {
		t.Errorf("Expected Description to be %q, but got %q", description, det.Description)
	}

	if det.Phone != phone {
		t.Errorf("Expected Description to be %q, but got %q", phone, det.Phone)
	}

	if !reflect.DeepEqual(det.OpeningHours, openingHours) {
		t.Errorf("Expected OpeningHours to be %v, but got %v", openingHours, det.OpeningHours)
	}

	if det.Website != website {
		t.Errorf("Expected Description to be %q, but got %q", website, det.Website)
	}
}
