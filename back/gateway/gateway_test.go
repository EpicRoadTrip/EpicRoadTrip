// gateway_test.go
package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestGatewayHandler(t *testing.T) {
	os.Setenv("ACCOMMODATIONS_API_BASE_URL", "http://example.com")

	tests := []struct {
		url          string
		expectedCode int
	}{
		{url: "/accommodations/test", expectedCode: http.StatusNotFound},
		{url: "/nonexistent/test", expectedCode: http.StatusNotFound},
		{url: "/accommodations", expectedCode: http.StatusNotFound},
	}

	for _, test := range tests {
		req, err := http.NewRequest("GET", test.url, nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(gatewayHandler)

		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != test.expectedCode {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, test.expectedCode)
		}
	}
}

func TestProxyAPI(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello, client")
	}))
	defer ts.Close()

	os.Setenv("TEST_API_BASE_URL", ts.URL)

	tests := []struct {
		url          string
		expectedCode int
	}{
		{url: ts.URL + "/test", expectedCode: http.StatusOK},
		{url: ts.URL + "/nonexistent", expectedCode: http.StatusOK},
	}

	for _, test := range tests {
		req, err := http.NewRequest("GET", test.url, nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()

		proxyAPI(rr, req, test.url)

		if status := rr.Code; status != test.expectedCode {
			t.Errorf("proxyAPI returned wrong status code: got %v want %v",
				status, test.expectedCode)
		}
	}
}
