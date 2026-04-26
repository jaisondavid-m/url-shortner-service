package main

import (

	// "log"

	"log"
	"server/config"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Error loading .env:", err)
	}

	config.Connect()

	if config.DB == nil {
		panic("Database is not initilized")
	}

	r := gin.Default()

	// r.Use()

	r.Run(":8000")

}
