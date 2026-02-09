package main

import (
	"flag"
	"log"

	"github.com/luqmanherifa/creative-artisan-platform/internal/config"
	"github.com/luqmanherifa/creative-artisan-platform/internal/database"
	"github.com/luqmanherifa/creative-artisan-platform/internal/seeder"
)

func main() {
	fresh := flag.Bool("fresh", false, "Clear all data before seeding")
	flag.Parse()

	cfg := config.Load()

	db, err := database.NewGorm(cfg.DB)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	log.Println("Starting seeder...")

	if *fresh {
		log.Println("Clearing existing data...")
		if err := seeder.ClearAll(db); err != nil {
			log.Fatalf("failed to clear data: %v", err)
		}
	}

	if err := seeder.RunAll(db); err != nil {
		log.Fatalf("seeder failed: %v", err)
	}

	log.Println("Seeding completed successfully! 🎉")
	log.Println("\nDefault credentials:")
	log.Println("  Admin: admin@example.com / password123")
	log.Println("  Creator: john@example.com / password123")
	log.Println("  Client: alice@example.com / password123")
}