package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"encoding/json"
	"fmt"
	"strings"

	g "github.com/serpapi/google-search-results-golang"
)

func GetEvents(location string) ([]models.Event, error) {
	SerpAPIKey := config.GetVarEnv()["serpAPIKey"]
	location = strings.ReplaceAll(strings.TrimSpace(location), " ", "-")

	parameters := map[string]string{
		"engine":  "google_events",
		"q":       "Events in " + location,
		"api_key": SerpAPIKey,
	}

	search := g.NewGoogleSearch(parameters, SerpAPIKey)
	searchResult, err := search.GetJSON()
	if err != nil {
		return nil, fmt.Errorf("serpapi search error: %w", err)
	}

	results, err := json.Marshal(searchResult)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal searchResult: %w", err)
	}

	events, err := processSerpAPIResponse(results)
	if err != nil {
		return nil, fmt.Errorf("processing serpapi response error: %w", err)
	}

	return events, nil
}

func processSerpAPIResponse(response []byte) ([]models.Event, error) {
	var data map[string]interface{}

	if err := json.Unmarshal(response, &data); err != nil {
		return nil, fmt.Errorf("failed to unmarshal serpapi response: %w", err)
	}

	eventResults := data["events_results"].([]interface{})
	events := make([]models.Event, len(eventResults))

	for i, result := range eventResults {
		resultMap := result.(map[string]interface{})

		// Get address and join it into a single string
		addressArray := resultMap["address"].([]interface{})
		address := strings.Join(stringsFromInterfaceArray(addressArray), ", ")

		// Get the full when from the nested date map
		dateMap := resultMap["date"].(map[string]interface{})
		when := getString(dateMap, "when")

		event := models.Event{
			Name:        getString(resultMap, "title"),
			Address:     address,
			Description: getString(resultMap, "description"),
			Photo:       getString(resultMap, "image"),
			Date:        when,
		}

		events[i] = event
	}

	return events, nil
}

func stringsFromInterfaceArray(array []interface{}) []string {
	stringsArray := make([]string, len(array))
	for i, v := range array {
		stringsArray[i] = v.(string)
	}
	return stringsArray
}

func getString(data map[string]interface{}, key string) string {
	value, ok := data[key]
	if !ok || value == nil {
		return ""
	}
	return value.(string)
}
