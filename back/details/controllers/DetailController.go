package controllers

import (
	"EpicRoadTrip/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /details
// @Router /details/{placeId} [get]
// @Summary Get details
// @Description Get details
// @Accept  json
// @Produce  json
// @Param placeId path string true "Place ID"
// @Success 200 {object} models.Details
// @Failure 404
// @Failure 500
func GetDetailHandler(c *gin.Context) {
	var placeId string = c.Param("placeId")

	var res, err = services.GetDetails(placeId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Details not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": res})
}
