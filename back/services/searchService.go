package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type SearchResult struct {
	Data []models.Search `json:"data"`
}

func GetSearchByCity(city string) ([]models.Search, error) {
	tripAdvisorKey := config.GoDotEnvVariable("TRIPADVISOR_KEY")

	url := fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/search?key=%s&searchQuery=%s&category=hotels&radiusUnit=km&language=fr", tripAdvisorKey, city)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	res, _ := http.DefaultClient.Do(req)

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(res.Body)

	var result SearchResult
	decoder := json.NewDecoder(res.Body)
	err := decoder.Decode(&result)
	if err != nil {
		return nil, err
	}

	return result.Data, nil
}
