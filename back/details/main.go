package main

import (
	"EpicRoadTrip/controllers"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/details/:placeId", controllers.GetDetailHandler)
	r.GET("/trip/:location", controllers.GetDetailTripHandler)

	return r
}

func runApp() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // valeur par défaut
	}

	r := setupRouter()
	return r.Run(":" + port)
}

func main() {
	err := runApp()
	if err != nil {
		fmt.Println("Error running the app:", err)
		os.Exit(1)
	}
}
