package main

import (
	"EpicRoadTrip/controllers"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetAccomodation(t *testing.T) {
	// Configuration de Gin et de la route
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/accommodations/:location", controllers.GetAccomodationsHandler)

	// Test de la requête
	location := "Nantes Radisson"
	req, err := http.NewRequest("GET", "/accommodations/"+location, nil)
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

	fmt.Println(firstResult)
	fmt.Println(firstResult["formatted_address"])

	idTest, idOk := firstResult["place_id"].(string)
	photoTest, photoOk := firstResult["photo"].(string)

	assert.Equal(t, http.StatusOK, resp.Code, "Response status should be OK")
	assert.Equal(t, "6 Pl. Aristide Briand, 44000 Nantes, France", firstResult["formatted_address"], "Adress OK")
	assert.Equal(t, "47.217597,-1.563158", firstResult["location"], "Location OK")
	assert.Equal(t, "Radisson Blu Hotel, Nantes", firstResult["name"], "Location OK")

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")

	assert.True(t, idOk, "Id should be of type string")
	assert.True(t, len(idTest) > 0, "The id should have a length greater than 0")
}
