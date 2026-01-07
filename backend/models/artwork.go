package models

import (
	"time"

	"gorm.io/gorm"
)

type Artwork struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatorID   uint           `gorm:"index;not null" json:"creator_id"`
	Title       string         `gorm:"size:255;not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	MediaURL    string         `gorm:"size:255" json:"media_url"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}