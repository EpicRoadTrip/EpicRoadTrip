package main

import (
	"EpicRoadTrip/controllers"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetRestaurants(t *testing.T) {
	// Configuration de Gin et de la route
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/restaurants/:location", controllers.GetRestaurantsHandler)

	// Test de la requête
	location := "Nantes lacigale"
	req, err := http.NewRequest("GET", "/restaurants/"+location, nil)
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

	assert.Equal(t, http.StatusOK, resp.Code, "Response status should be OK")
	assert.Equal(t, "4 Pl. Graslin, 44000 Nantes, France", firstResult["formatted_address"], "Adress OK")
	assert.Equal(t, "47.212780,-1.562082", firstResult["location"], "Location OK")
	assert.Equal(t, "La Cigale", firstResult["name"], "Location OK")

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")

	assert.True(t, idOk, "Id should be of type string")
	assert.True(t, len(idTest) > 0, "The id should have a length greater than 0")
}
