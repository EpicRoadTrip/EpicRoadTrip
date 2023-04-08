package main

import (
	"EpicRoadTrip/controllers"
	"os"

	"github.com/gin-gonic/gin"
)

const DEFAULT_PORT = "8080"

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
		port = "8080"
	}

	r := setupRouter()
	err := r.Run(":" + DEFAULT_PORT)

	if err != nil {
		return
	}
}
