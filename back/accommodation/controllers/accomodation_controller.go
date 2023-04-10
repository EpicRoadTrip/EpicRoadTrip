package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)


// @BasePath /accomodations
// @Router /accomodations/{location} [get]
// @Summary Get accomodations
// @Description Get accomodations
// @Accept  json
// @Produce  json
// @Param location path string true "Location"
// @Success 200 {object} models.Accommodation
// @Failure 404
// @Failure 500
func GetAccomodationHandler(c *gin.Context) {
	location := c.Param("location")

	res, err := services.GetAccomodations(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
