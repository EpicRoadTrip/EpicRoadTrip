package controllers_test

import (
	_ "EpicRoadTrip/config"
	"EpicRoadTrip/controllers"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetDetailHandler_Success(t *testing.T) {
	// Create a new Gin router
	router := gin.Default()

	// Create a mock service that returns a list of details
	mockService := func(placeId string) (map[string]interface{}, error) {
		return map[string]interface{}{
			"name":              "ChIJLU7jZClu5kcR4PcOOO6p3I0",
			"formatted_address": "Test address",
			"description":       "Test description",
			"phone":             "Test phone",
			"location":          "Test location",
			"opening_hours":     []string{"Test opening hours"},
			"website":           "Test website",
			"photo":             "Test photo",
		}, nil
	}

	// Set up the router with the GetAccomodationHandler using the mock service
	router.GET("/details/:placeId", func(c *gin.Context) {
		c.Set("services.GetDetails", mockService)
		controllers.GetDetailHandler(c)
	})

	// Create a test HTTP request to GET the accomodations for "Paris"
	req, _ := http.NewRequest("GET", "/details/ChIJLU7jZClu5kcR4PcOOO6p3I0", nil)

	// Create a test HTTP response recorder
	w := httptest.NewRecorder()

	// Serve the test HTTP request with the router
	router.ServeHTTP(w, req)

	// Assert that the response code is HTTP 200 OK
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert that the response body contains the expected results
	var result struct {
		Results struct {
			Name         string   `json:"name"`
			Address      string   `json:"formatted_address"`
			Description  string   `json:"description"`
			Phone        string   `json:"phone"`
			Location     string   `json:"location"`
			OpeningHours []string `json:"opening_hours"`
			Website      string   `json:"website"`
			Photo        string   `json:"photo"`
		} `json:"results"`
	}

	err := json.Unmarshal(w.Body.Bytes(), &result)
	assert.NoError(t, err)

	// Assert that the result is not empty
	assert.NotEmpty(t, result.Results)
}
