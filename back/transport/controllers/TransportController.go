package controllers

import (
	"EpicRoadTrip/models"
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /transports
// @Router /transports/ [get]
// @Summary Get transports
// @Description Get transports
// @Accept  json
// @Produce  json
// @Success 200 {object} models.Transport
// @Failure 404
// @Failure 500
func GetTransportsHandler(c *gin.Context) {

	var params models.Locations

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var res, err = services.GetTransports(params)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
