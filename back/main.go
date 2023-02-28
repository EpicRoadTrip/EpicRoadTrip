package main

import (
	"EpicRoadTrip/controllers"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/search/:city", controllers.GetSearchHandler)

	return r
}

func main() {
	r := setupRouter()
	err := r.Run(":8080")

	if err != nil {
		return
	}
}
