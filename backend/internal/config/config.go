package config

import (
	"log"
	"os"
)

type DatabaseConfig struct {
	Host     string
	Port     string
	Name     string
	User     string
	Password string
	SSLMode  string
}

type Config struct {
	AppName string
	Port    string
	DB      DatabaseConfig
}

func Load() *Config {
	cfg := &Config{
		AppName: getEnv("APP_NAME", "creative-artisan-api"),
		Port:    getEnv("APP_PORT", "8080"),
		DB: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			Name:     getEnv("DB_NAME", "creative_artisan"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
	}

	log.Printf("config loaded: app=%s db host=%s", cfg.AppName, cfg.DB.Host)
	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
