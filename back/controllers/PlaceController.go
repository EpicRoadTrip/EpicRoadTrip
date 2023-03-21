package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPlaceHandler(c *gin.Context) {
	var search string = c.Param("search")

	var result, err = services.SearchPlace(search)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Not result"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": result})
}
