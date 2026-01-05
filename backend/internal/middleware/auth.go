package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	UserIDContextKey contextKey = "userID"
	RoleContextKey   contextKey = "role"
)

func AuthMiddleware(next http.Handler, rolesAllowed []string) http.Handler {
	secret := []byte(os.Getenv("JWT_SECRET"))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "missing or invalid token", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return secret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		role := claims["role"].(string)
		userID := uint(claims["user_id"].(float64))

		allowed := false
		for _, r := range rolesAllowed {
			if role == r {
				allowed = true
				break
			}
		}
		if !allowed {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, UserIDContextKey, userID)
		ctx = context.WithValue(ctx, RoleContextKey, role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}