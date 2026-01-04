package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	"github.com/luqmanherifa/creative-artisan-platform/internal/config"
)

func NewPostgres(cfg config.DatabaseConfig) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Name, cfg.SSLMode,
	)

	var db *sql.DB
	var err error
	for i := 0; i < 10; i++ {
		db, err = sql.Open("postgres", dsn)
		if err != nil {
			log.Println("failed to open db:", err)
		} else if err = db.Ping(); err == nil {
			log.Println("postgres connected")
			return db, nil
		} else {
			log.Println("db ping failed, retrying...", i+1)
		}
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("could not connect to postgres after retries: %v", err)
}
