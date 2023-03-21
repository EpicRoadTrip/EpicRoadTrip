package services

import (
	"EpicRoadTrip/config"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func GetLocationById(locationId string) (map[string]interface{}, error) {
	tripAdvisorKey := config.GetVarEnv()["tripAdvisorKey"]

	locationId = strings.ReplaceAll(locationId, " ", "-")

	url := fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/%s/details?key=%s&language=fr&currency=EUD", locationId, tripAdvisorKey)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	res, _ := http.DefaultClient.Do(req)

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
		}
	}(res.Body)

	body, _ := ioutil.ReadAll(res.Body)

	var data map[string]interface{}
	err := json.Unmarshal(body, &data)
	if err != nil {
		log.Fatal(err)
	}

	return data, nil
}
