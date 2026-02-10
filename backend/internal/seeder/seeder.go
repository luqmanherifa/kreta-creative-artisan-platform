package seeder

import (
	"log"

	"gorm.io/gorm"
)

type Seeder interface {
	Seed(db *gorm.DB) error
}

func RunAll(db *gorm.DB) error {
	seeders := []Seeder{
		&UserSeeder{},
		&CreatorSeeder{},
		&ArtworkSeeder{},
		&ClientRequestSeeder{},
	}

	for _, seeder := range seeders {
		if err := seeder.Seed(db); err != nil {
			return err
		}
	}

	log.Println("All seeders completed successfully")
	return nil
}

func ClearAll(db *gorm.DB) error {
	tables := []string{
		"client_requests",
		"artworks",
		"creators",
		"users",
	}

	for _, table := range tables {
		if err := db.Exec(
			"TRUNCATE TABLE " + table + " RESTART IDENTITY CASCADE",
		).Error; err != nil {
			return err
		}
	}

	log.Println("All tables truncated & identity reset")
	return nil
}
