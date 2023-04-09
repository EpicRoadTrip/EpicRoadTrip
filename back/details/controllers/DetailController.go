package controllers

import (
	"EpicRoadTrip/services"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDetailHandler(c *gin.Context) {
	var placeId string = c.Param("placeId")

	var res, err = services.GetDetails(placeId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Details not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}

func GetDetailTripHandler(c *gin.Context) {
	//location := c.Param("location")

	url := "https://api.content.tripadvisor.com/api/v1/location/search?key=D6984AA2410B4ABEA6AFD8897D321E5F&searchQuery=tour-eiffel&latLong=48.858370,2.294481&language=fr"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	req.Header.Add("accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get response"})
		return
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
		return
	}

	var response struct {
		Data []struct {
			LocationID string `json:"location_id"`
			Name       string `json:"name"`
			Distance   string `json:"distance"`
			Bearing    string `json:"bearing"`
			AddressObj struct {
				Street1       string `json:"street1"`
				Street2       string `json:"street2"`
				City          string `json:"city"`
				Country       string `json:"country"`
				PostalCode    string `json:"postalcode"`
				AddressString string `json:"address_string"`
			} `json:"address_obj"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal response body"})
		return
	}

	if len(response.Data) == 0 {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Details not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": response.Data[0]})
}
