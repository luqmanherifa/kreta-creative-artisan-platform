package seeder

import (
	"log"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type CreatorSeeder struct{}

func (s *CreatorSeeder) Seed(db *gorm.DB) error {
	var users []models.User

	if err := db.Where("role = ?", "creator").Find(&users).Error; err != nil {
		return err
	}

	if len(users) == 0 {
		log.Println("⚠ No creator users found")
		return nil
	}

	bios := []string{
		"Fantasy & character illustrator",
		"Watercolor landscape painter",
		"Concept artist for games",
		"Children book illustrator",
		"Digital portrait specialist",
		"Sci-fi environment artist",
		"Anime style illustrator",
		"Minimalist graphic artist",
		"Traditional ink artist",
		"Surreal visual storyteller",
	}

	websites := []string{
		"https://creator1.art",
		"https://creator2.art",
		"https://creator3.art",
		"https://creator4.art",
		"https://creator5.art",
		"https://creator6.art",
		"https://creator7.art",
		"https://creator8.art",
		"https://creator9.art",
		"https://creator10.art",
	}

	for i, user := range users {
		creator := models.Creator{
			UserID:  user.ID,
			Bio:     bios[i%len(bios)],
			Website: websites[i%len(websites)],
		}

		if err := db.
			Where("user_id = ?", user.ID).
			FirstOrCreate(&creator).
			Error; err != nil {
			return err
		}
	}

	log.Printf("✓ Seeded %d creators", len(users))
	return nil
}
