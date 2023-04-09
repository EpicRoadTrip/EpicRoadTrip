package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSetupRouter(t *testing.T) {
	// Create a new Gin router using setupRouter function
	router := setupRouter()

	// Test the /ping endpoint
	req, _ := http.NewRequest("GET", "/ping", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "pong", w.Body.String())

	// Test de la route /details
	placeId := "ChIJLU7jZClu5kcR4PcOOO6p3I0"
	req, err := http.NewRequest("GET", "/details/"+placeId, nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Décoder la réponse JSON
	var jsonResponse map[string]map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &jsonResponse)
	if err != nil {
		t.Fatalf("Failed to decode JSON response: %v", err)
	}

	// Récupérer uniquement le premier résultat
	result := jsonResponse["results"]

	nameTest, nameOk := result["name"].(string)
	addressTest, addressOk := result["formatted_address"].(string)
	descriptionTest, descriptionOk := result["description"].(string)
	locationTest, locationOk := result["location"].(string)
	openingHoursTest, openingHoursOk := result["opening_hours"].([]string)
	websiteTest, websiteOk := result["website"].(string)
	photoTest, photoOk := result["photo"].(string)

	assert.Equal(t, http.StatusOK, resp.Code, "Response status should be OK")

	assert.True(t, nameOk, "Name should be of type string")
	assert.True(t, len(nameTest) > 0, "The name should have a length greater than 0")

	assert.True(t, addressOk, "Address should be of type string")
	assert.True(t, len(addressTest) > 0, "The address should have a length greater than 0")

	assert.True(t, descriptionOk, "Location should be of type string")
	assert.True(t, len(descriptionTest) > 0, "The location should have a length greater than 0")

	assert.True(t, locationOk, "Location should be of type string")
	assert.True(t, len(locationTest) > 0, "The location should have a length greater than 0")

	assert.True(t, openingHoursOk, "OpeningHours should be of type []string")
	assert.True(t, len(openingHoursTest) > 0, "The openingHours should have a length greater than 0")

	assert.True(t, websiteOk, "Website should be of type string")
	assert.True(t, len(websiteTest) > 0, "The website should have a length greater than 0")

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")
}
