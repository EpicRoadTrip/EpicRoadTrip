// main.go
package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	// Configure the logger
	log.SetOutput(os.Stdout)
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	http.HandleFunc("/", gatewayHandler)

	log.Println("API Gateway listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
