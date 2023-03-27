package main

import (
	"EpicRoadTrip/controllers"
	"os"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/accomodations/:location", controllers.GetAccomodationHandler)

	return r
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // valeur par défaut
	}

	r := setupRouter()
	err := r.Run(":" + port)

	if err != nil {
		return
	}
}
