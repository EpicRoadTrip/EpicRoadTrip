package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /events
// @Router /events/{location} [get]
// @Summary Get events
// @Description Get events
// @Accept  json
// @Produce  json
// @Param location path string true "Location"
// @Success 200 {object} models.Event
// @Failure 404
// @Failure 500
func GetEventHandler(c *gin.Context) {
	location := c.Param("location")

	res, err := services.GetEvents(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
