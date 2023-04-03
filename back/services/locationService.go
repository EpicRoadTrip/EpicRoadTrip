package services

import (
	"EpicRoadTrip/config"
	"EpicRoadTrip/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

type LocationResult struct {
	Data []models.Location `json:"data"`
}

func GetLocationById(locationId string) (map[string]interface{}, error) {
	tripAdvisorKey := config.GoDotEnvVariable("TRIPADVISOR_KEY")

	locationId = strings.ReplaceAll(locationId, " ", "-")

	url := fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/%s/details?key=%s&language=fr&currency=EUD", locationId, tripAdvisorKey)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	res, _ := http.DefaultClient.Do(req)

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(res.Body)

	body, _ := io.ReadAll(res.Body)

	var data map[string]interface{}
	err := json.Unmarshal(body, &data)
	if err != nil {
		log.Fatal(err)
	}

	return data, nil
}
