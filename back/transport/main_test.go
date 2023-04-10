package main_test

import (
	"EpicRoadTrip/controllers"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "pong", w.Body.String())
}

func TestGetTransportsHandler(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/transports", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 400, w.Code)
}

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	r.GET("/transports", controllers.GetTransportsHandler)

	return r
}

func TestMain(m *testing.M) {
	os.Setenv("PORT", "8080")
	code := m.Run()
	os.Exit(code)
}
