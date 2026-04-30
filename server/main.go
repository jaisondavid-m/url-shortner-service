package main

import (

	// "log"

	"log"
	"server/config"
	"server/middlewares"
	"server/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Error loading .env:", err)
	}

	config.Connect()
	config.Migrate()

	if config.DB == nil {
		panic("Database is not initilized")
	}

	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())
	// r.Use(middlewares.AuthMiddleware())

	routes.RegisterRoutes(r)

	r.Run(":8000")

}