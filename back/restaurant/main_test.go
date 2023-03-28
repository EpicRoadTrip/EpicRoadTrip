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
	router.GET("/restaurants/:location", controllers.GetBarHandler)

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

	photoTest, photoOk := firstResult["photo_url"].(string)

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")
}
