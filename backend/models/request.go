package models

import (
	"time"

	"gorm.io/gorm"
)

type ClientRequest struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ClientID  uint           `gorm:"not null" json:"client_id"`
	CreatorID uint           `gorm:"not null" json:"creator_id"`
	Title     string         `gorm:"size:255;not null" json:"title"`
	Details   string         `gorm:"type:text" json:"details"`
	Status    string         `gorm:"size:50;not null;default:'pending'" json:"status"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}