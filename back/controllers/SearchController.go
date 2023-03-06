package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSearchHandler(c *gin.Context) {
	var city string = c.Param("city")

	var search, err = services.GetSearchByCity(city)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "City not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": search})
}
