package main

import (
	"EpicRoadTrip/controllers"
	"fmt"
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

	r.GET("/details/:placeId", controllers.GetDetailHandler)

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

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
