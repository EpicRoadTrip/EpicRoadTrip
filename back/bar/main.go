package main

import (
	"EpicRoadTrip/controllers"
	"os"

	docs "EpicRoadTrip/docs"
	"github.com/gin-gonic/gin"
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

	r.GET("/bars/:location", controllers.GetBarHandler)

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
