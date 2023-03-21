package controllers

import (
	"EpicRoadTrip/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetLocationHandler(c *gin.Context) {
	var location string = c.Param("locationId")

	var search, err = services.GetLocationById(location)

	fmt.Println(search)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": search})
}
