package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type ClientRequestHandler struct {
	DB *gorm.DB
}

func NewClientRequestHandler(db *gorm.DB) *ClientRequestHandler {
	return &ClientRequestHandler{DB: db}
}

func (h *ClientRequestHandler) CreateRequest(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ClientID  uint   `json:"client_id"`
		CreatorID uint   `json:"creator_id"`
		Title     string `json:"title"`
		Details   string `json:"details"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	req := models.ClientRequest{
		ClientID:  input.ClientID,
		CreatorID: input.CreatorID,
		Title:     input.Title,
		Details:   input.Details,
		Status:    "pending",
	}

	if err := h.DB.Create(&req).Error; err != nil {
		http.Error(w, "failed to create request", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}

func (h *ClientRequestHandler) ListRequests(w http.ResponseWriter, r *http.Request) {
	var requests []models.ClientRequest
	if err := h.DB.Find(&requests).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(requests)
}

func (h *ClientRequestHandler) GetRequest(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	var req models.ClientRequest
	if err := h.DB.First(&req, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "request not found", http.StatusNotFound)
			return
		}
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(req)
}

func (h *ClientRequestHandler) UpdateRequest(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var req models.ClientRequest
	if err := h.DB.First(&req, id).Error; err != nil {
		http.Error(w, "request not found", http.StatusNotFound)
		return
	}

	var input struct {
		ClientID  uint   `json:"client_id"`
		CreatorID uint   `json:"creator_id"`
		Title     string `json:"title"`
		Details   string `json:"details"`
		Status    string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	req.ClientID = input.ClientID
	req.CreatorID = input.CreatorID
	req.Title = input.Title
	req.Details = input.Details
	req.Status = input.Status

	if err := h.DB.Save(&req).Error; err != nil {
		http.Error(w, "update failed", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(req)
}

func (h *ClientRequestHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ID     uint   `json:"id"`
		Status string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	var req models.ClientRequest
	if err := h.DB.First(&req, input.ID).Error; err != nil {
		http.Error(w, "request not found", http.StatusNotFound)
		return
	}

	req.Status = input.Status
	if err := h.DB.Save(&req).Error; err != nil {
		http.Error(w, "failed to update", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(req)
}

func (h *ClientRequestHandler) DeleteRequest(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.DB.Unscoped().Delete(&models.ClientRequest{}, id).Error; err != nil {
		http.Error(w, "failed to delete request", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "request deleted",
	})
}