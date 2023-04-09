// gateway.go
package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

var limiter = rate.NewLimiter(rate.Every(100*time.Millisecond), 10)
var cache = sync.Map{}

func gatewayHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Request received: %s", r.URL.Path)

	if !limiter.Allow() {
		log.Printf("Rate limit exceeded: %s", r.URL.Path)
		http.Error(w, "Too many requests", http.StatusTooManyRequests)
		return
	}

	path := strings.Split(r.URL.Path, "/")
	if len(path) < 3 {
		http.NotFound(w, r)
		return
	}

	api := path[1]
	resource := path[2]

	var baseUrl string

	switch api {
	case "accommodations":
		baseUrl = os.Getenv("ACCOMMODATIONS_API_BASE_URL")
	case "bar":
		baseUrl = os.Getenv("BAR_API_BASE_URL")
	case "details":
		baseUrl = os.Getenv("DETAILS_API_BASE_URL")
	case "event":
		baseUrl = os.Getenv("EVENT_API_BASE_URL")
	case "restaurant":
		baseUrl = os.Getenv("RESTAURANT_API_BASE_URL")
	case "transport":
		baseUrl = os.Getenv("TRANSPORT_API_BASE_URL")
	default:
		log.Printf("Unknown API: %s", api)
		http.NotFound(w, r)
		return
	}

	// print baseUrl
	log.Printf("baseUrl: %s", baseUrl)

	if baseUrl == "" {
		err := fmt.Errorf("environment variable for %s API not set", api)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	cacheKey := baseUrl + "/" + resource
	if cachedData, ok := cache.Load(cacheKey); ok {
		log.Printf("Cache hit: %s", cacheKey)
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData.([]byte))
	} else {
		log.Printf("Cache miss: %s", cacheKey)
		proxyAPI(w, r, cacheKey)
	}

}

func proxyAPI(w http.ResponseWriter, r *http.Request, url string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := limiter.Wait(ctx)
	if err != nil {
		log.Printf("Rate limit exceeded: %s", r.URL.Path)
		http.Error(w, "Too many requests", http.StatusTooManyRequests)
		return
	}

	resp, err := http.Get(url)
	if err != nil {
		err = fmt.Errorf("error fetching resource from %s: %w", url, err)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		err = fmt.Errorf("error reading response body from %s: %w", url, err)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(resp.StatusCode)
	w.Write(body)

	cache.Store(url, body)
}
