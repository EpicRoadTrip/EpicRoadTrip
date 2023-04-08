package models_test

import (
    "testing"
	"EpicRoadTrip/models"
)

func TestNewAccommodation(t *testing.T) {
    placeID := "123"
    name := "My Accommodation"
    address := "123 Main St"
    photo := "http://example.com/photo.jpg"
    location := "40.123,-74.123"
    priceLevel := "$$"
    description := "A lovely place to stay"

	acc := models.Accommodation{
		PlaceID:     placeID,
		Name:        name,
		Address:     address,
		Photo:       photo,
		Location:    location,
		PriceLevel:  priceLevel,
		Description: description,
	}

    if acc.PlaceID != placeID {
        t.Errorf("Expected PlaceID to be %q, but got %q", placeID, acc.PlaceID)
    }

    if acc.Name != name {
        t.Errorf("Expected Name to be %q, but got %q", name, acc.Name)
    }

    if acc.Address != address {
        t.Errorf("Expected Address to be %q, but got %q", address, acc.Address)
    }

    if acc.Photo != photo {
        t.Errorf("Expected Photo to be %q, but got %q", photo, acc.Photo)
    }

    if acc.Location != location {
        t.Errorf("Expected Location to be %q, but got %q", location, acc.Location)
    }

    if acc.PriceLevel != priceLevel {
        t.Errorf("Expected PriceLevel to be %q, but got %q", priceLevel, acc.PriceLevel)
    }

    if acc.Description != description {
        t.Errorf("Expected Description to be %q, but got %q", description, acc.Description)
    }
}
