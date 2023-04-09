package models

type Restaurant struct {
	PlaceID     string `json:"place_id"`
	Name        string `json:"name"`
	Address     string `json:"formatted_address"`
	Photo       string `json:"photo"`
	Location    string `json:"location"`
	PriceLevel  string `json:"price_level"`
	Description string `json:"description"`
}
