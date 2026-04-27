package utils

import(
	"math/rand"
	"time"
)

const charset = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"

func GenerateShortCode() string {

	rand.Seed(time.Now().UnixNano())

	b := make([]byte,7)

	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}

	return string(b)

}