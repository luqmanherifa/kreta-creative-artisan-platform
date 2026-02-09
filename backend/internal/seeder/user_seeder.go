package seeder

import (
	"log"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type UserSeeder struct{}

func (s *UserSeeder) Seed(db *gorm.DB) error {
	users := []models.User{
		{Username: "admin", Email: "admin@example.com", Role: "admin"},

		{Username: "creator_john", Email: "john@example.com", Role: "creator"},
		{Username: "creator_jane", Email: "jane@example.com", Role: "creator"},
		{Username: "creator_mike", Email: "mike@example.com", Role: "creator"},
		{Username: "creator_lisa", Email: "lisa@example.com", Role: "creator"},

		{Username: "creator_anna", Email: "anna@example.com", Role: "creator"},
		{Username: "creator_tom", Email: "tom@example.com", Role: "creator"},
		{Username: "creator_sophia", Email: "sophia@example.com", Role: "creator"},
		{Username: "creator_ryan", Email: "ryan@example.com", Role: "creator"},
		{Username: "creator_emma", Email: "emma@example.com", Role: "creator"},

		{Username: "client_alice", Email: "alice@example.com", Role: "client"},
		{Username: "client_bob", Email: "bob@example.com", Role: "client"},
		{Username: "client_charlie", Email: "charlie@example.com", Role: "client"},
		{Username: "client_diana", Email: "diana@example.com", Role: "client"},
		{Username: "client_eric", Email: "eric@example.com", Role: "client"},
	}

	for i := range users {
		if err := users[i].SetPassword("password123"); err != nil {
			return err
		}

		if err := db.
			Where("email = ?", users[i].Email).
			FirstOrCreate(&users[i]).
			Error; err != nil {
			return err
		}
	}

	log.Printf("✓ Seeded %d users", len(users))
	return nil
}
