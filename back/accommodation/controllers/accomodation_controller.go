package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAccomodationHandler(c *gin.Context) {
	location := c.Param("location")

	res, err := services.GetAccomodations(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
