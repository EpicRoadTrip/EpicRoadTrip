package models

type Search struct {
	LocationID    string        `json:"location_id"`
	Name          string        `json:"name"`
	AddressSearch AddressSearch `json:"address_obj"`
}

type AddressSearch struct {
	Street1       string `json:"street1"`
	Street2       string `json:"street2"`
	City          string `json:"city"`
	Country       string `json:"country"`
	PostalCode    string `json:"postalcode"`
	AddressString string `json:"address_string"`
}
