package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetEvents(t *testing.T) {
	// Configuration de Gin et de la route
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/events/:location", controllers.GetEventsHandler)

	// Test de la requête
	location := "Nantes"
	req, err := http.NewRequest("GET", "/events/"+location, nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Décoder la réponse JSON
	var jsonResponse map[string][]map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &jsonResponse)
	if err != nil {
		t.Fatalf("Failed to decode JSON response: %v", err)
	}

	// Récupérer uniquement le premier résultat
	firstResult := jsonResponse["results"][0]

	idTest, idOk := firstResult["place_id"].(string)
	photoTest, photoOk := firstResult["photo"].(string)
	addressTest, addressOk := firstResult["formatted_address"].(string)
	locationTest, locationOk := firstResult["location"].(string)
	nameTest, nameOk := firstResult["name"].(string)

	assert.Equal(t, http.StatusOK, resp.Code, "Response status should be OK")

	assert.True(t, addressOk, "Address should be of type string")
	assert.True(t, len(addressTest) > 0, "The address should have a length greater than 0")

	assert.True(t, locationOk, "Location should be of type string")
	assert.True(t, len(locationTest) > 0, "The location should have a length greater than 0")

	assert.True(t, nameOk, "Name should be of type string")
	assert.True(t, len(nameTest) > 0, "The name should have a length greater than 0")

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")

	assert.True(t, idOk, "Id should be of type string")
	assert.True(t, len(idTest) > 0, "The id should have a length greater than 0")
}
