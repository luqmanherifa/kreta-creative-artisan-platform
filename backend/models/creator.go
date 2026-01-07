package models

import (
	"time"

	"gorm.io/gorm"
)

type Creator struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"uniqueIndex;not null" json:"user_id"`
	Bio       string         `gorm:"type:text" json:"bio"`
	Website   string         `gorm:"size:255" json:"website"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}