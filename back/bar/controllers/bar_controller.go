package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /bars
// @Router /bars/{location} [get]
// @Summary Get bars
// @Description Get bars
// @Accept  json
// @Produce  json
// @Param location path string true "Location"
// @Success 200 {object} models.Bar
// @Failure 404
// @Failure 500
func GetBarHandler(c *gin.Context) {
	location := c.Param("location")

	res, err := services.GetBars(location)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Location not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
