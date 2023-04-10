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

const (
	placeId          = "ChIJLU7jZClu5kcR4PcOOO6p3I0"
	expectedName     = "Tour Eiffel"
	expectedAddress  = "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France"
	expectedLocation = "48.858370,2.294481"
	expectedPhone    = "+33 1 45 68 65 00"
	expectedWebsite  = "http://www.toureiffel.paris/"
)

var expectedOpeningHours = []string{
	"lundi: 09:30 - 22:45",
	"mardi: 09:30 - 22:45",
	"mercredi: 09:30 – 22:45",
	"jeudi: 09:30 – 22:45",
	"vendredi: 09:30 – 22:45",
	"samedi: 09:30 – 22:45",
	"dimanche: 09:30 – 22:45",
}

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

func TestGetDetails(t *testing.T) {
	// Set up mock server
	testMux.HandleFunc("/maps/api/place/textsearch/json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "GET", r.Method)
		assert.Equal(t, apiKey, r.URL.Query().Get("key"))
		assert.Equal(t, "+logement+hotel", r.URL.Query().Get("query"))

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{
			"status": "OK",
			"results": [{
				"place_id": "` + placeId + `",
				"name": "` + expectedName + `",
				"formatted_address": "` + expectedAddress + `",
				"geometry": {
					"location": {
						"lat": 48.858260,
						"lng": 2.294499
					}
				},
				"international_phone_number": "` + expectedPhone + `",
				"opening_hours": {
					"weekday_text": "` + expectedOpeningHours[0] + `"
				},
				"photos": [{
					"photo_reference": "ABC123"
				}]
			}]
		}`))
	})

	// Call the function being tested
	details, err := services.GetDetails(placeId)

	// Check the results
	assert.NoError(t, err)
	assert.NotEmpty(t, 1, details)
	assert.NotEmpty(t, details.Name)
	assert.NotEmpty(t, details.Address)
	assert.NotEmpty(t, details.Location)
	assert.NotEmpty(t, details.Website)
	assert.NotEmpty(t, details.Photo)
}

func TestMapPlaceDetailsResultToDetail(t *testing.T) {
	result := maps.PlaceDetailsResult{
		Name:                     "Test Place",
		FormattedAddress:         "123 Test Street",
		Geometry:                 maps.AddressGeometry{Location: maps.LatLng{Lat: 12.34, Lng: 56.78}},
		InternationalPhoneNumber: "+1 123-456-7890",
		OpeningHours:             &maps.OpeningHours{WeekdayText: []string{"Monday: 9:00 AM – 5:00 PM"}},
		Website:                  "https://www.example.com",
		Photos:                   []maps.Photo{{PhotoReference: "test_photo_reference"}},
	}

	detail := services.MapPlaceDetailsResultToDetail(result)
	assert.Equal(t, "Test Place", detail.Name)
	assert.Equal(t, "123 Test Street", detail.Address)
	assert.Equal(t, "12.340000,56.780000", detail.Location)
	assert.Equal(t, "+1 123-456-7890", detail.Phone)
	assert.Equal(t, []string{"Monday: 9:00 AM – 5:00 PM"}, detail.OpeningHours)
	assert.Equal(t, "https://www.example.com", detail.Website)
	assert.Contains(t, detail.Photo, "test_photo_reference")
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
