package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type ArtworkHandler struct {
	DB *gorm.DB
}

func NewArtworkHandler(db *gorm.DB) *ArtworkHandler {
	return &ArtworkHandler{DB: db}
}

func (h *ArtworkHandler) CreateArtwork(w http.ResponseWriter, r *http.Request) {
	var input struct {
		CreatorID   uint   `json:"creator_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		MediaURL    string `json:"media_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	artwork := models.Artwork{
		CreatorID:   input.CreatorID,
		Title:       input.Title,
		Description: input.Description,
		MediaURL:    input.MediaURL,
	}

	if err := h.DB.Create(&artwork).Error; err != nil {
		http.Error(w, "failed to create artwork", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(artwork)
}

func (h *ArtworkHandler) ListArtworks(w http.ResponseWriter, r *http.Request) {
	var artworks []models.Artwork
	if err := h.DB.Find(&artworks).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(artworks)
}

func (h *ArtworkHandler) GetArtwork(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	var artwork models.Artwork
	if err := h.DB.First(&artwork, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "artwork not found", http.StatusNotFound)
			return
		}
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(artwork)
}

func (h *ArtworkHandler) UpdateArtwork(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var artwork models.Artwork
	if err := h.DB.First(&artwork, id).Error; err != nil {
		http.Error(w, "artwork not found", http.StatusNotFound)
		return
	}

	var input struct {
		CreatorID   uint   `json:"creator_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		MediaURL    string `json:"media_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	artwork.CreatorID = input.CreatorID
	artwork.Title = input.Title
	artwork.Description = input.Description
	artwork.MediaURL = input.MediaURL

	if err := h.DB.Save(&artwork).Error; err != nil {
		http.Error(w, "update failed", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(artwork)
}

func (h *ArtworkHandler) DeleteArtwork(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.DB.Unscoped().Delete(&models.Artwork{}, id).Error; err != nil {
		http.Error(w, "failed to delete artwork", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "artwork deleted",
	})
}