package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /restaurants
// @Router /restaurants/{location} [get]
// @Summary Get restaurants
// @Description Get restaurants
// @Accept  json
// @Produce  json
// @Param location path string true "Location"
// @Success 200 {object} models.Restaurant
// @Failure 404
// @Failure 500
func GetRestaurantHandler(c *gin.Context) {
	location := c.Param("location")

	res, err := services.GetRestaurants(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
