package models

type Accommodation struct {
	LocationID    string        `json:"location_id"`
	Name          string        `json:"name"`
	AddressSearch AddressSearch `json:"address_obj"`
}
