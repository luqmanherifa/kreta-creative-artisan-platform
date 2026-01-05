package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/luqmanherifa/creative-artisan-platform/internal/middleware"
	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{DB: db}
}

// Create User (Admin)
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value(middleware.RoleContextKey).(string)
	if role != "admin" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	var input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Role:     input.Role,
	}

	if err := user.SetPassword(input.Password); err != nil {
		http.Error(w, "failed to hash password", http.StatusInternalServerError)
		return
	}

	if err := h.DB.Create(&user).Error; err != nil {
		http.Error(w, "username or email already exists", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user.SafeResponse())
}

// Get Current User
func (h *UserHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDContextKey).(uint)

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user.SafeResponse())
}

// List Users (Admin)
func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value(middleware.RoleContextKey).(string)
	if role != "admin" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	var users []models.User
	if err := h.DB.Find(&users).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	var result []models.UserResponse
	for _, u := range users {
		result = append(result, u.SafeResponse())
	}

	json.NewEncoder(w).Encode(result)
}

// Update User (Admin)
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value(middleware.RoleContextKey).(string)
	if role != "admin" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	idStr := r.URL.Query().Get("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var user models.User
	if err := h.DB.First(&user, id).Error; err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	var input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	user.Username = input.Username
	user.Email = input.Email
	user.Role = input.Role

	if err := h.DB.Save(&user).Error; err != nil {
		http.Error(w, "update failed", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user.SafeResponse())
}

// Delete User (Admin)
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.DB.Delete(&models.User{}, id).Error; err != nil {
		http.Error(w, "failed to delete user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "user deleted",
	})
}
