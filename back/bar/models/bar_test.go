package models_test

import (
	"EpicRoadTrip/models"
	"testing"
)

func TestNewBar(t *testing.T) {
	placeID := "123"
	name := "Peter Mc Cool"
	address := "123 Main St"
	photo := "http://example.com/photo.jpg"
	location := "40.123,-74.123"
	priceLevel := "bcp trop cher"
	description := "On va passer une bonne soirée"

	bar := models.Bar{
		PlaceID:     placeID,
		Name:        name,
		Address:     address,
		Photo:       photo,
		Location:    location,
		PriceLevel:  priceLevel,
		Description: description,
	}

	if bar.PlaceID != placeID {
		t.Errorf("Expected PlaceID to be %q, but got %q", placeID, bar.PlaceID)
	}

	if bar.Name != name {
		t.Errorf("Expected Name to be %q, but got %q", name, bar.Name)
	}

	if bar.Address != address {
		t.Errorf("Expected Address to be %q, but got %q", address, bar.Address)
	}

	if bar.Photo != photo {
		t.Errorf("Expected Photo to be %q, but got %q", photo, bar.Photo)
	}

	if bar.Location != location {
		t.Errorf("Expected Location to be %q, but got %q", location, bar.Location)
	}

	if bar.PriceLevel != priceLevel {
		t.Errorf("Expected PriceLevel to be %q, but got %q", priceLevel, bar.PriceLevel)
	}

	if bar.Description != description {
		t.Errorf("Expected Description to be %q, but got %q", description, bar.Description)
	}
}
