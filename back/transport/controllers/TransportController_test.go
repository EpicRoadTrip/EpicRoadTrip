package controllers_test

import (
	"EpicRoadTrip/controllers"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetTransportsHandler(t *testing.T) {
	// Create a request with a JSON body
	requestBody, err := json.Marshal(map[string]string{
		"locationStart": "47.27377001541292, -2.213751615944555",
		"locationDest":  "47.218096,-1.555852",
	})
	if err != nil {
		t.Fatal(err)
	}
	req, err := http.NewRequest("POST", "/transports", bytes.NewBuffer(requestBody))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a gin context with the request and response recorder
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	// Call the handler function
	controllers.GetTransportsHandler(c)

	// Check the status code is 200 OK
	assert.Equal(t, http.StatusOK, w.Code)

	// Check that the response body contains results
	var responseBody map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &responseBody)
	if err != nil {
		t.Fatal(err)
	}
	results, exists := responseBody["results"].(map[string]interface{})
	if !exists {
		t.Fatal("Results not found in response body")
	}

	// Check each mode of transport separately
	walkDuration, exists := results["walk"].(string)
	assert.True(t, exists)
	assert.NotEmpty(t, walkDuration)

	driveDuration, exists := results["drive"].(string)
	assert.True(t, exists)
	assert.NotEmpty(t, driveDuration)

	bicyclDuration, exists := results["bicycl"].(string)
	assert.True(t, exists)
	assert.NotEmpty(t, bicyclDuration)

	transitDuration, exists := results["transit"].(string)
	assert.True(t, exists)
	assert.NotEmpty(t, transitDuration)
}
