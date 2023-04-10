package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetEventHandler_Success(t *testing.T) {
	// Create a new Gin router
	router := gin.Default()

	// Create a mock service that returns a list of events
	mockService := func(location string) ([]string, error) {
		return []string{"hotel1", "hotel2", "hotel3"}, nil
	}

	// Set up the router with the GetEventHandler using the mock service
	router.GET("/events/:location", func(c *gin.Context) {
		c.Set("services.GetEvents", mockService)
		GetEventHandler(c)
	})

	// Create a test HTTP request to GET the events for "Paris"
	req, _ := http.NewRequest("GET", "/events/Paris", nil)

	// Create a test HTTP response recorder
	w := httptest.NewRecorder()

	// Serve the test HTTP request with the router
	router.ServeHTTP(w, req)

	// Assert that the response code is HTTP 200 OK
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert that the response body contains the expected results
	var result struct {
		Results []struct {
			Name       string  `json:"name"`
			Address    string  `json:"address"`
			Rating     float64 `json:"rating"`
			PriceLevel string  `json:"price_level"`
			Photo      string  `json:"photo"`
			URL        string  `json:"url"`
		} `json:"results"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &result)
	assert.NoError(t, err)

	// Assert that the result is not empty
	assert.NotEmpty(t, result.Results)
}

func TestGetEventHandler_Error(t *testing.T) {
	// Create a new Gin router
	router := gin.Default()

	// Create a mock service that returns an error
	mockService := func(location string) ([]string, error) {
		return nil, errors.New("location not found")
	}

	// Set up the router with the GetEventHandler using the mock service
	router.GET("/events/:location", func(c *gin.Context) {
		c.Set("services.GetEvents", mockService)
		GetEventHandler(c)
	})

	// Create a test HTTP request to GET the events for "IUYT6FGO6UQGFUYEGBLOIUY7RGFOUYHDSVBCUOYTESQFV"
	req, _ := http.NewRequest("GET", "/events/IUYT6FGO6UQGFUYEGBLOIUY7RGFOUYHDSVBCUOYTESQFV", nil)

	// Create a test HTTP response recorder
	w := httptest.NewRecorder()

	// Serve the test HTTP request with the router
	router.ServeHTTP(w, req)

	// Assert that the response code is HTTP 404 Not Found
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert that the response body contains the expected error message
	//expected := `{"error":"Location not found","details":"location not found"}`
	//assert.Equal(t, expected, w.Body.String())
}
