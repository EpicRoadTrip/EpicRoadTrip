package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

// Constantes pour les clés de variables d'environnement
const (
	TRIPADVISOR_KEY_VAR = "TRIPADVISOR_KEY"
	GOOGLE_KEY_VAR      = "GOOGLE_KEY"
)

// init charge les variables d'environnement du fichier .env
func init() {
	envPath, err := findEnvFile()
	if err != nil {
		log.Printf("Error finding .env file: %v", err)
		return
	}

	err = godotenv.Load(envPath)
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}
}

func findEnvFile() (string, error) {
	// Check if the .env file is in the current working directory
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	envPath := filepath.Join(wd, ".env")
	if _, err := os.Stat(envPath); err == nil {
		return envPath, nil
	}

	// Check if the .env file is in the parent directory
	envPath = filepath.Join(wd, "..", ".env")
	if _, err := os.Stat(envPath); err == nil {
		return envPath, nil
	}

	return "", fmt.Errorf(".env file not found")
}

// getEnvVariable récupère la valeur d'une variable d'environnement
func getEnvVariable(key string) string {
	return os.Getenv(key)
}

// GetVarEnv retourne un dictionnaire des variables d'environnement
func GetVarEnv() map[string]string {
	tripAdvisorKey := getEnvVariable(TRIPADVISOR_KEY_VAR)
	googleKey := getEnvVariable(GOOGLE_KEY_VAR)

	var envs = map[string]string{
		"tripAdvisorKey": tripAdvisorKey,
		"googleKey":      googleKey,
	}
	return envs
}
