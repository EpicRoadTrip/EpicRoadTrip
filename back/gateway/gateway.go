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

// Create a rate limiter that allows 10 requests per 100 milliseconds
var limiter = rate.NewLimiter(rate.Every(100*time.Millisecond), 10)

// Create a map to cache responses
var cache = sync.Map{}

// Handles incoming requests and proxies them to the appropriate API
func gatewayHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers to allow requests from anywhere
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")

	// Set the response content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Log the request URL path and method
	log.Printf("[%s] Request received: %s", r.Method, r.URL.Path)

	// Rate limit incoming requests
	if !limiter.Allow() {
		log.Printf("[%s] Rate limit exceeded: %s", r.Method, r.URL.Path)
		http.Error(w, "Too many requests", http.StatusTooManyRequests)
		return
	}

	// Split the URL path into components
	path := strings.Split(r.URL.Path, "/")
	if len(path) < 2 {
		// If the URL path doesn't contain at least 2 components, return a 404 error
		http.NotFound(w, r)
		return
	}

	// Extract the API and resource names from the URL path
	api := path[1]
	resource := ""
	if len(path) > 2 {
		resource = path[2]
	}

	// Look up the base URL for the API in an environment variable
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
	case "transports":
		fmt.Println("REdirect to transport API")
		baseUrl = os.Getenv("TRANSPORT_API_BASE_URL")
	default:
		// If the API name is not recognized, return a 404 error
		log.Printf("[%s] Unknown API: %s", r.Method, api)
		http.NotFound(w, r)
		return
	}

	// Print the base URL for debugging purposes
	log.Printf("[%s] baseUrl: %s", r.Method, baseUrl)

	// If the environment variable for the API is not set, return an error
	if baseUrl == "" {
		err := fmt.Errorf("environment variable for %s API not set", api)
		log.Printf("[%s] %v", r.Method, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("Cache: ", cache)

	// Generate a cache key for the requested resource
	cacheKey := baseUrl
	if resource != "" {
		cacheKey += "/" + resource
	}

	fmt.Println("Cache key: ", cacheKey)

	// Dont cache if the request method is POST
	if r.Method == http.MethodPost {
		// If the request method is POST, proxy the request to the API
		log.Printf("[%s] Cache miss: %s", r.Method, cacheKey)
		proxyAPI(w, *r, cacheKey)
		return
	}

	// Check if the response for the requested resource is already cached
	if cachedData, ok := cache.Load(cacheKey); ok {
		// If the response is cached, write it to the response writer
		log.Printf("[%s] Cache hit: %s", r.Method, cacheKey)
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData.([]byte))
	} else {
		// If the response is not cached, proxy the request to the API
		log.Printf("[%s] Cache miss: %s", r.Method, cacheKey)
		proxyAPI(w, *r, cacheKey)
	}
}

// Proxies a request to an API and caches the response
func proxyAPI(w http.ResponseWriter, r http.Request, url string) {
	// Create a timeout context with a 5-second deadline
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// Rate limit outgoing requests
	err := limiter.Wait(ctx)
	if err != nil {
		log.Printf("[%s] Rate limit exceeded: %s", r.Method, r.URL.Path)
		http.Error(w, "Too many requests", http.StatusTooManyRequests)
		return
	}

	// Prepare the request to the API endpoint
	req, err := http.NewRequest(r.Method, url, r.Body)
	if err != nil {
		err = fmt.Errorf("[%s] error creating request for %s: %w", r.Method, url, err)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy headers from the original request to the new request
	for name, values := range r.Header {
		for _, value := range values {
			req.Header.Set(name, value)
		}
	}

	// Send the request to the API endpoint
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// If there is an error fetching the resource, return an error response
		err = fmt.Errorf("[%s] error fetching resource from %s: %w", r.Method, url, err)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		// If there is an error reading the response body, return an error response
		err = fmt.Errorf("[%s] error reading response body from %s: %w", r.Method, url, err)
		log.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write the response headers and body to the response writer
	w.WriteHeader(resp.StatusCode)
	w.Write(body)

	// Cache the response for future requests
	cache.Store(url, body)
}
