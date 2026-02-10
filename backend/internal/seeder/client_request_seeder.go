package seeder

import (
	"log"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type ClientRequestSeeder struct{}

func (s *ClientRequestSeeder) Seed(db *gorm.DB) error {
	var clients []models.User
	var creators []models.Creator

	db.Where("role = ?", "client").Find(&clients)
	db.Find(&creators)

	if len(clients) == 0 || len(creators) == 0 {
		log.Println("No clients or creators found")
		return nil
	}

	requests := []models.ClientRequest{
		{Title: "Character Design", Details: "Fantasy warrior", Status: "pending"},
		{Title: "Game Logo", Details: "Esports logo", Status: "in_progress"},
		{Title: "Landscape Art", Details: "Office decoration", Status: "pending"},
		{Title: "Portrait", Details: "Anniversary gift", Status: "completed"},
		{Title: "Book Illustration", Details: "Children book", Status: "pending"},
		{Title: "NFT Artwork", Details: "Crypto collection", Status: "pending"},
		{Title: "Album Cover", Details: "Indie band", Status: "completed"},
		{Title: "Mascot Design", Details: "Brand identity", Status: "in_progress"},
		{Title: "Poster Art", Details: "Event poster", Status: "pending"},
		{Title: "Concept Art", Details: "Game environment", Status: "completed"},
	}

	for i := range requests {
		requests[i].ClientID = clients[i%len(clients)].ID
		requests[i].CreatorID = creators[i%len(creators)].ID

		if err := db.Create(&requests[i]).Error; err != nil {
			return err
		}
	}

	log.Printf("Seeded %d client requests", len(requests))
	return nil
}
