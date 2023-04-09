package services_test

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/services"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"googlemaps.github.io/maps"
)

func TestPriceLevelToString(t *testing.T) {
	assert.Equal(t, "Not available", services.PriceLevelToString(-1))
	assert.Equal(t, "Free", services.PriceLevelToString(0))
	assert.Equal(t, "Inexpensive", services.PriceLevelToString(1))
	assert.Equal(t, "Moderate", services.PriceLevelToString(2))
	assert.Equal(t, "Expensive", services.PriceLevelToString(3))
	assert.Equal(t, "Very expensive", services.PriceLevelToString(4))
	assert.Equal(t, "Unknown", services.PriceLevelToString(5))
}

func TestGetPhotoURL(t *testing.T) {
	// Set up the environment variable with a test API key
	os.Setenv("GOOGLE_KEY", "testkey123")

	// Test with a sample photo reference
	photoReference := "CmRaAAAAwKxJfNYG1nfWPW8TY9fM6cOJvjDRPJLMYF1ASy_E1i-5ZWwO_2bZ5r5Z9P9HdGllfnK-j3qU7y6Uzns6U1G6fBZ6R24ZquT13TjG7pMgptfYRyMCRx2EJEG7suAqW3uGEhDh9XAW07K7SwB4W8i4n4cEGhRHfVIXjwA-8eZGpS1Xe0EshOJW4g"

	// Call the GetPhotoURL function with the sample photo reference
	result := services.GetPhotoURL(photoReference)

	// Assert that the result is the expected URL
	expected := fmt.Sprintf("%s&photo_reference=%s&key=%s", "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400", url.QueryEscape(photoReference), url.QueryEscape("testkey123"))
	assert.Equal(t, expected, result)
}

const (
	placeID          = "ChIJN1t_tDeuEmsRUsoyG83frY4"
	location         = "Paris, France"
	expectedName     = "Eiffel Tower"
	expectedAddress  = "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France"
	expectedLocation = "48.858260,2.294499"
	expectedPrice    = "Moderate"
)

var (
	apiKey     string
	testMux    *http.ServeMux
	testServer *httptest.Server
)

func TestMain(m *testing.M) {
	setUp()
	retCode := m.Run()
	tearDown()
	os.Exit(retCode)
}

func setUp() {
	apiKey = config.GetVarEnv()["googleKey"]

	// Start test server
	testMux = http.NewServeMux()
	testServer = httptest.NewServer(testMux)
	os.Setenv("googleKey", apiKey)
}

func tearDown() {
	testServer.Close()
}

func TestGetAccomodations(t *testing.T) {
	// Set up mock server
	testMux.HandleFunc("/maps/api/place/textsearch/json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "GET", r.Method)
		assert.Equal(t, apiKey, r.URL.Query().Get("key"))
		assert.Equal(t, location+"+logement+hotel", r.URL.Query().Get("query"))

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{
			"status": "OK",
			"results": [{
				"place_id": "` + placeID + `",
				"name": "` + expectedName + `",
				"formatted_address": "` + expectedAddress + `",
				"geometry": {
					"location": {
						"lat": 48.858260,
						"lng": 2.294499
					}
				},
				"price_level": 2,
				"photos": [{
					"photo_reference": "ABC123"
				}]
			}]
		}`))
	})

	// Call the function being tested
	accommodations, err := services.GetAccomodations(location)

	// Check the results
	assert.NoError(t, err)
	assert.NotEmpty(t, 1, len(accommodations))
	assert.NotEmpty(t, accommodations[0].Name)
	assert.NotEmpty(t, accommodations[0].Address)
	assert.NotEmpty(t, accommodations[0].Location)
	assert.NotEmpty(t, accommodations[0].PriceLevel)
	assert.NotEmpty(t, accommodations[0].Photo)
}

func TestGetAccomodationSummary(t *testing.T) {
	// Set up mock server
	testMux.HandleFunc("/maps/api/place/details/json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "GET", r.Method)
		assert.Equal(t, apiKey, r.URL.Query().Get("key"))
		assert.Equal(t, placeID, r.URL.Query().Get("placeid"))

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{
		"status": "OK",
		"result": {
			"place_id": "` + placeID + `",
			"name": "` + expectedName + `",
			"formatted_address": "` + expectedAddress + `",
			"geometry": {
				"location": {
					"lat": 48.858260,
					"lng": 2.294499
				}
			},
			"price_level": 2,
			"editorial_summary": {
				"overview": "This is a great place to stay."
			}
		}
	}`))
	})

	// Call the function being tested
	accommodation, err := services.GetAccomodationSummary(placeID)

	// Check the results
	assert.NoError(t, err)
	assert.Empty(t, accommodation.Description)
}

func TestMapPlacesSearchResultToAccommodation(t *testing.T) {
	// Set up test data
	photoReference := "ABC123"
	place := maps.PlacesSearchResult{
		PlaceID:          placeID,
		Name:             expectedName,
		FormattedAddress: expectedAddress,
		PriceLevel: 2,
		Photos: []maps.Photo{
			{
				PhotoReference: photoReference,
			},
		},
	}

	// Call the function being tested
	accommodation := services.MapPlacesSearchResultToAccommodation(place)

	// Check the results
	assert.NotEmpty(t, accommodation.PlaceID)
	assert.NotEmpty(t, accommodation.Name)
	assert.NotEmpty(t, accommodation.Address)
	assert.NotEmpty(t, accommodation.PriceLevel)
	assert.NotEmpty(t, accommodation.Photo)
}
