package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JwtSecret = []byte("secret_key")

func GenerateToken(userID uint, email string) (string, error) {

	claims := jwt.MapClaims{
		"userID": float64(userID),
		"email": email,
		"exp": time.Now().Add(time.Hour*24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	return token.SignedString(JwtSecret)

}