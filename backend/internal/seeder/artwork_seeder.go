package seeder

import (
	"log"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type ArtworkSeeder struct{}

func (s *ArtworkSeeder) Seed(db *gorm.DB) error {
	var creators []models.Creator
	if err := db.Find(&creators).Error; err != nil {
		return err
	}

	if len(creators) == 0 {
		log.Println("⚠ No creators found, skipping artworks")
		return nil
	}

	artworks := []models.Artwork{
		{Title: "Dragon Warrior", Description: "Epic fantasy knight", MediaURL: "https://img/1.jpg"},
		{Title: "Cyberpunk City", Description: "Neon futuristic city", MediaURL: "https://img/2.jpg"},
		{Title: "Forest Spirit", Description: "Mythical forest being", MediaURL: "https://img/3.jpg"},
		{Title: "Mountain Dawn", Description: "Sunrise landscape", MediaURL: "https://img/4.jpg"},
		{Title: "Ocean Calm", Description: "Peaceful waves", MediaURL: "https://img/5.jpg"},
		{Title: "Space Wanderer", Description: "Sci-fi explorer", MediaURL: "https://img/6.jpg"},
		{Title: "Portrait Study", Description: "Human face study", MediaURL: "https://img/7.jpg"},
		{Title: "Ancient Ruins", Description: "Lost civilization", MediaURL: "https://img/8.jpg"},
		{Title: "Desert Nomad", Description: "Traveler illustration", MediaURL: "https://img/9.jpg"},
		{Title: "Night Market", Description: "City night life", MediaURL: "https://img/10.jpg"},
	}

	for i := range artworks {
		artworks[i].CreatorID = creators[i%len(creators)].ID
		if err := db.Create(&artworks[i]).Error; err != nil {
			return err
		}
	}

	log.Printf("✓ Seeded %d artworks", len(artworks))
	return nil
}
