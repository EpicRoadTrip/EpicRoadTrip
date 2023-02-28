package services

import "C"
import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetSearchByCity(city string) ([]byte, error) {
	tripAdvisorKey := ""

	url := fmt.Sprintf("https://api.content.tripadvisor.com/api/v1/location/search?key=%s&searchQuery=%s&category=hotels&radiusUnit=km&language=fr", tripAdvisorKey, city)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(req)
	fmt.Println(url)
	fmt.Println(res)
	fmt.Println(string(body))

	return body, nil
}
