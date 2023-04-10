package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

const (
	tripAdvisorKeyVar = "TRIPADVISOR_KEY"
	googleKeyVar      = "GOOGLE_KEY"
	serpApiKeyVar	  = "SERP_API_KEY"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}
}

func getEnvVariable(key string) string {
	return os.Getenv(key)
}

func GetVarEnv() map[string]string {
	tripAdvisorKey := getEnvVariable(tripAdvisorKeyVar)
	googleKey := getEnvVariable(googleKeyVar)
	serpAPIKey := getEnvVariable(serpApiKeyVar)

	var envs = map[string]string{
		"tripAdvisorKey": tripAdvisorKey,
		"googleKey":      googleKey,
		"serpAPIKey":     serpAPIKey,
	}

	return envs
}
