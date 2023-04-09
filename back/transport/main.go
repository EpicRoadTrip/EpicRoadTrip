package main

import (
	"EpicRoadTrip/controllers"
	"os"

	docs "EpicRoadTrip/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	docs.SwaggerInfo.BasePath = "/"

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/transports", controllers.GetTransportsHandler)

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

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
