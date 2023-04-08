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

func TestGetDetails(t *testing.T) {
	// Configuration de Gin et de la route
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/photos/:ref", controllers.GetPhotosHandler)

	// Test de la requête
	ref := "AUjq9jlBVUX8lK0gK6jn1nW2xkr0OiBFIHfDKVMhbpHC64v_tmuq9gJ8J_75izQbKM5aLsYP8DCK9PrK704Wk8hjaffjwcaCu3nYEN6GWfpa_IKfaZu1xDwv8BIRhXCX4DCo-Gf6ZaI8MK_2bkgWc81LD6Hij-fSFVbA4KrHX-9uFRAKcfJg"
	req, err := http.NewRequest("GET", "/photos/"+ref, nil)
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

	photoTest, photoOk := firstResult["photo"].(string)

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")
}
