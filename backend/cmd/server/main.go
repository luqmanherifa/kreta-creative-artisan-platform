package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/luqmanherifa/creative-artisan-platform/internal/config"
	"github.com/luqmanherifa/creative-artisan-platform/internal/database"
	"github.com/luqmanherifa/creative-artisan-platform/internal/handlers"
	"github.com/luqmanherifa/creative-artisan-platform/internal/middleware"
	"github.com/luqmanherifa/creative-artisan-platform/models"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()

	// Database
	db, err := database.NewGorm(cfg.DB)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	if err := migrate(db); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	// Handlers
	authHandler := handlers.NewAuthHandler(db)
	userHandler := handlers.NewUserHandler(db)
	creatorHandler := handlers.NewCreatorHandler(db)
	artworkHandler := handlers.NewArtworkHandler(db)
	requestHandler := handlers.NewClientRequestHandler(db)

	// Router
	mux := http.NewServeMux()

	registerPublicRoutes(mux, authHandler)
	registerProtectedRoutes(
		mux,
		userHandler,
		creatorHandler,
		artworkHandler,
		requestHandler,
	)

	// HTTP Server
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: middleware.CORSMiddleware(mux),
	}

	startServer(server, cfg)
	gracefulShutdown(server)
}

// Migration
func migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&models.User{},
		&models.Creator{},
		&models.Artwork{},
		&models.ClientRequest{},
	); err != nil {
		return err
	}

	log.Println("migration completed")
	return nil
}

// Public Routes
func registerPublicRoutes(mux *http.ServeMux, auth *handlers.AuthHandler) {
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	mux.HandleFunc("/register", auth.Register)
	mux.HandleFunc("/login", auth.Login)
}

// Protected Routes (JWT + Role)
func registerProtectedRoutes(
	mux *http.ServeMux,
	user *handlers.UserHandler,
	creator *handlers.CreatorHandler,
	artwork *handlers.ArtworkHandler,
	request *handlers.ClientRequestHandler,
) {
	// Users (Admin)
	mux.Handle("/users", middleware.AuthMiddleware(
		methodHandler(map[string]http.HandlerFunc{
			http.MethodGet:  user.ListUsers,
			http.MethodPost: user.CreateUser,
		}),
		[]string{"admin"},
	))

	mux.Handle("/users/update", middleware.AuthMiddleware(
		http.HandlerFunc(user.UpdateUser),
		[]string{"admin"},
	))

	mux.Handle("/users/delete", middleware.AuthMiddleware(
		http.HandlerFunc(user.DeleteUser),
		[]string{"admin"},
	))

	// Current User
	mux.Handle("/me", middleware.AuthMiddleware(
		http.HandlerFunc(user.GetMe),
		[]string{"admin", "creator", "client"},
	))

	// Creators
	mux.Handle("/creators", middleware.AuthMiddleware(
		methodHandler(map[string]http.HandlerFunc{
			http.MethodGet:  creator.ListCreators,
			http.MethodPost: creator.CreateCreator,
		}),
		[]string{"admin", "creator"},
	))

	mux.Handle("/creator", middleware.AuthMiddleware(
		http.HandlerFunc(creator.GetCreator),
		[]string{"admin", "creator", "client"},
	))

	mux.Handle("/creators/update", middleware.AuthMiddleware(
		http.HandlerFunc(creator.UpdateCreator),
		[]string{"admin"},
	))

	mux.Handle("/creators/delete", middleware.AuthMiddleware(
		http.HandlerFunc(creator.DeleteCreator),
		[]string{"admin"},
	))

	// Artworks
	mux.Handle("/artworks", middleware.AuthMiddleware(
		methodHandler(map[string]http.HandlerFunc{
			http.MethodGet:  artwork.ListArtworks,
			http.MethodPost: artwork.CreateArtwork,
		}),
		[]string{"admin", "creator"},
	))

	mux.Handle("/artwork", middleware.AuthMiddleware(
		http.HandlerFunc(artwork.GetArtwork),
		[]string{"admin", "creator", "client"},
	))

	mux.Handle("/artworks/update", middleware.AuthMiddleware(
		http.HandlerFunc(artwork.UpdateArtwork),
		[]string{"admin"},
	))

	mux.Handle("/artworks/delete", middleware.AuthMiddleware(
		http.HandlerFunc(artwork.DeleteArtwork),
		[]string{"admin"},
	))

	// Requests
	mux.Handle("/requests", middleware.AuthMiddleware(
		methodHandler(map[string]http.HandlerFunc{
			http.MethodGet:  request.ListRequests,
			http.MethodPost: request.CreateRequest,
		}),
		[]string{"client", "creator", "admin"},
	))

	mux.Handle("/request", middleware.AuthMiddleware(
		http.HandlerFunc(request.GetRequest),
		[]string{"client", "creator", "admin"},
	))

	mux.Handle("/request/status", middleware.AuthMiddleware(
		http.HandlerFunc(request.UpdateStatus),
		[]string{"creator", "admin"},
	))
}

// Method Switcher
func methodHandler(handlers map[string]http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if h, ok := handlers[r.Method]; ok {
			h(w, r)
			return
		}
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	})
}

// Server Start/Shutdown
func startServer(server *http.Server, cfg *config.Config) {
	go func() {
		log.Printf("%s running on :%s", cfg.AppName, cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()
}

func gracefulShutdown(server *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	log.Println("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("forced shutdown: %v", err)
	}

	log.Println("server exited properly")
}
