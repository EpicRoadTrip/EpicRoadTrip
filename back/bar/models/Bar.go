package models

type Bar struct {
	PlaceID  string `json:"place_id"`
	Name     string `json:"name"`
	Address  string `json:"formatted_address"`
	Photo    string `json:"photo"`
	Location string `json:"location"`
}
