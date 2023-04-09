package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetEventsHandler(t *testing.T) {
	// Create a mock request
	req, err := http.NewRequest("GET", "/events?location=Nantes", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Create a mock API response
	apiResponse := map[string]interface{}{
		"events_results": []interface{}{
			map[string]interface{}{
				"title": "Variations Festival at Le Lieu Unique",
				"date": map[string]interface{}{
					"start_date": "Apr 9",
					"when":       "Sun, Apr 9, 6 – 8 PM GMT+2",
				},
				"address": []interface{}{
					"Le Lieu unique, 2 Rue de la Biscuiterie",
					"Nantes, France",
				},
				"description": "Third Coast Percussion will present a program celebrating the richness of keyboard music, featuring works by Philip Glass, Jlin, Steve Reich, Devonte Hynes and David Skidmore, as well as TCP’s...",
				"link":        "https://sitemaps.thirdcoastpercussion.com/event/variations-festival-at-le-lieu-unique/",
			},
			map[string]interface{}{
				"title": "VERONIQUE SANSON",
				"date": map[string]interface{}{
					"start_date": "Apr 16",
					"when":       "Sun, Apr 16, 7 – 9 PM GMT+2",
				},
				"address": []interface{}{
					"Cité des congrès de Nantes, 5 Rue de Valmy",
					"Nantes, France",
				},
				"description": "Mylène Farmer (born Mylène Jeanne Gautier / 12 September 1961 in Montreal, Canada) is a French singer, songwriter, occasional actress and author. She is the most successful and provocative female...",
				"link":        "https://www.spectacles.carrefour.fr/en/manifestation/veronique-sanson-ticket/idmanif/522062",
			},
		},
	}
	apiResponseJSON, err := json.Marshal(apiResponse)
	if err != nil {
		t.Fatal(err)
	}

	// Create a mock SerpAPI server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(apiResponseJSON)
	})

	// Create a new test HTTP server and assign the mock SerpAPI server handler to it
	testServer := httptest.NewServer(handler)
	defer testServer.Close()

	// Set the test server URL as the SerpAPI endpoint
	serpAPIEndpoint = testServer.URL

	// Call the GetEventsHandler function with the mock request and response recorder
	handlerFunc := http.HandlerFunc(GetEventsHandler)
	handlerFunc.ServeHTTP(rr, req)

	// Check the response status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body
	expected := `[{"name":"Variations Festival at Le Lieu Unique","formatted_address":"Le Lieu unique, 2 Rue de la Biscuiterie, Nantes, France","photo":"","description":"Third
