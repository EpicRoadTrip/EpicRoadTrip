package main

import (
	"EpicRoadTrip/controllers"
	"os"

	"github.com/gin-gonic/gin"
	docs "EpicRoadTrip/docs"
    swaggerfiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"
)

const DEFAULT_PORT = "8080"

func setupRouter() *gin.Engine {
	r := gin.Default()

	docs.SwaggerInfo.BasePath = "/"

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/accomodations/:location", controllers.GetAccomodationHandler)

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

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
