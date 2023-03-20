package models

type Location struct {
	ID            string        `json:"location_id"`
	Name          string        `json:"name"`
	Description   string        `json:"description"`
	WebURL        string        `json:"web_url"`
	Address       Address       `json:"address_obj"`
	Ancestors     []Ancestor    `json:"ancestors"`
	Latitude      string        `json:"latitude"`
	Longitude     string        `json:"longitude"`
	Timezone      string        `json:"timezone"`
	Email         string        `json:"email"`
	Phone         string        `json:"phone"`
	Website       string        `json:"website"`
	WriteReview   string        `json:"write_review"`
	RankingData   RankingData   `json:"ranking_data"`
	Rating        string        `json:"rating"`
	RatingImgURL  string        `json:"rating_image_url"`
	NumReviews    string        `json:"num_reviews"`
	ReviewRatings ReviewRatings `json:"review_rating_count"`
	PhotoCount    string        `json:"photo_count"`
	SeeAllPhotos  string        `json:"see_all_photos"`
	Hours         Hours         `json:"hours"`
}

type Address struct {
	Street1       string `json:"street1"`
	Street2       string `json:"street2"`
	City          string `json:"city"`
	Country       string `json:"country"`
	PostalCode    string `json:"postalcode"`
	AddressString string `json:"address_string"`
}

type Ancestor struct {
	Level      string `json:"level"`
	Name       string `json:"name"`
	LocationID string `json:"location_id"`
}

type RankingData struct {
	GeoLocationID   string `json:"geo_location_id"`
	RankingString   string `json:"ranking_string"`
	GeoLocationName string `json:"geo_location_name"`
	RankingOutOf    string `json:"ranking_out_of"`
	Ranking         string `json:"ranking"`
}

type ReviewRatings struct {
	One   string `json:"1"`
	Two   string `json:"2"`
	Three string `json:"3"`
	Four  string `json:"4"`
	Five  string `json:"5"`
}

type Hours struct {
	Periods []Period `json:"periods"`
}

type Period struct {
	Open  DayTime `json:"open"`
	Close DayTime `json:"close"`
}

type DayTime struct {
	Day  int    `json:"day"`
	Time string `json:"time"`
}
