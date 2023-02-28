package controllers

import (
	"EpicRoadTrip/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetSearchHandler(c *gin.Context) {
	city := c.Param("city")

	/*
		var input models.Search
		err := c.ShouldBindJSON(&input)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	var search, err2 = services.GetSearchByCity(city)
	if err2 != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "City not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": search})
}
