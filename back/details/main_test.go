package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPingRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "pong", w.Body.String())
}

func TestDetailsRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := setupRouter()

	// Test de la route /details
	placeId := "ChIJLU7jZClu5kcR4PcOOO6p3I0"
	req, err := http.NewRequest("GET", "/details/"+placeId, nil)
	require.NoError(t, err, "Failed to create request")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Décoder la réponse JSON
	var jsonResponse map[string]map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &jsonResponse)
	require.NoError(t, err, "Failed to decode JSON response")

	result := jsonResponse["results"]

	nameTest, nameOk := result["name"].(string)
	addressTest, addressOk := result["formatted_address"].(string)
	descriptionTest, descriptionOk := result["description"].(string)
	locationTest, locationOk := result["location"].(string)
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

	assert.True(t, websiteOk, "Website should be of type string")
	assert.True(t, len(websiteTest) > 0, "The website should have a length greater than 0")

	assert.True(t, photoOk, "Photo should be of type string")
	assert.True(t, len(photoTest) > 0, "The photo should have a length greater than 0")
}

func TestRunApp(t *testing.T) {
	gin.SetMode(gin.TestMode)
	originalPort := os.Getenv("PORT")
	defer os.Setenv("PORT", originalPort)
	os.Setenv("PORT", "8083")

	go func() {
		err := runApp()
		require.NoError(t, err, "Failed to run app")
	}()

	time.Sleep(500 * time.Millisecond) // Attente de 500 ms pour que le serveur démarre

	resp, err := http.Get("http://localhost:8083/ping")
	require.NoError(t, err, "Failed to send request to server")
	defer resp.Body.Close()

	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestRunWithInvalidPort(t *testing.T) {
	gin.SetMode(gin.TestMode)
	originalPort := os.Getenv("PORT")
	defer os.Setenv("PORT", originalPort)
	os.Setenv("PORT", "-1")

	err := runApp()
	require.Error(t, err, "An error should occur when running the app with an invalid port")
}
