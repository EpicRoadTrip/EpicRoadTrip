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

func TestGetTransports(t *testing.T) {
	// Configuration de Gin et de la route
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/transports/:location", controllers.GetBarHandler)

	// Test de la requête
	location := "Nantes lacigale"
	req, err := http.NewRequest("GET", "/transports/"+location, nil)
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

	busTime, busOk := firstResult["bus"].(string)
	tramTime, tramOk := firstResult["tram"].(string)
	walkingTime, walkingOk := firstResult["walk"].(string)
	subwayTime, subwayOk := firstResult["subway"].(string)
	drivingTime, drivingOk := firstResult["drive"].(string)
	bicyclingTime, bicyclingOk := firstResult["bicycl"].(string)

	assert.True(t, busOk, "Bus should be of type string")
	assert.True(t, len(busTime) > 0, "The bus should have a length greater than 0")

	assert.True(t, tramOk, "Tram should be of type string")
	assert.True(t, len(tramTime) > 0, "The tram should have a length greater than 0")

	assert.True(t, walkingOk, "Walk should be of type string")
	assert.True(t, len(walkingTime) > 0, "The walk should have a length greater than 0")

	assert.True(t, subwayOk, "Subway should be of type string")
	assert.True(t, len(subwayTime) > 0, "The subway should have a length greater than 0")

	assert.True(t, drivingOk, "Drive should be of type string")
	assert.True(t, len(drivingTime) > 0, "The drive should have a length greater than 0")

	assert.True(t, bicyclingTime, "Bicycl should be of type string")
	assert.True(t, len(bicyclingOk) > 0, "The bicycl should have a length greater than 0")
}
