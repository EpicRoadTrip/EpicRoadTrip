package models

type Detail struct {
	Name         string   `json:"name"`
	Address      string   `json:"formatted_address"`
	Description  string   `json:"description"`
	Phone        string   `json:"phone"`
	Location     string   `json:"location"`
	OpeningHours []string `json:"opening_hours"`
	Website      string   `json:"website"`
	Photo        string   `json:"photo"`
}
