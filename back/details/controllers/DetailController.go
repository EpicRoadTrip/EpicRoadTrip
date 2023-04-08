package controllers

import (
	"EpicRoadTrip/services"
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
