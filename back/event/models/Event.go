package models

type Event struct {
	Name        string `json:"name"`
	Address     string `json:"formatted_address"`
	Photo       string `json:"photo"`
	Description string `json:"description"`
	Date   string `json:"date"`
}
