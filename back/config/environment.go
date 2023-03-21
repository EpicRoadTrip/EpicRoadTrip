package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// use godot package to load/read the .env file and
// return the value of the key
func GoDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

func GetVarEnv() map[string]string {
	tripAdvisorKey := os.Getenv("TRIPADVISOR_KEY")
	if tripAdvisorKey == "" {
		tripAdvisorKey = GoDotEnvVariable("TRIPADVISOR_KEY") // valeur par défaut
	}

	googleKey := os.Getenv("GOOGLE_KEY")
	if googleKey == "" {
		googleKey = GoDotEnvVariable("GOOGLE_KEY") // valeur par défaut
	}

	var envs = map[string]string{"tripAdvisorKey": tripAdvisorKey, "googleKey": googleKey}
	return envs
}
