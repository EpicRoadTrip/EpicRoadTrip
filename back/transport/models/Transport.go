package models

type Transport struct {
	Walk    string `json:"walk"`
	Drive   string `json:"drive"`
	Bicycl  string `json:"bicycl"`
	Transit string `json:"transit"`
}
