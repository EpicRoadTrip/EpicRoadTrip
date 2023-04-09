package services_test

import (
	"EpicRoadTrip/models"
	"EpicRoadTrip/services"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetTransports(t *testing.T) {
	params := models.Locations{
		LocationStart: "47.218096,-1.555852",
		LocationDest:  "47.27377001541292, -2.213751615944555",
	}

	transport, err := services.GetTransports(params)

	assert.NoError(t, err)
	assert.NotEmpty(t, transport.Walk)
	assert.NotEmpty(t, transport.Drive)
	assert.NotEmpty(t, transport.Bicycl)
	assert.NotEmpty(t, transport.Transit)
}
