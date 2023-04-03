package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAccomodationHandler(c *gin.Context) {
	var location string = c.Param("location")

	var res, err = services.GetAccomodations(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
