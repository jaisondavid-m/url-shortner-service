package config

import (
	"log"
	"server/models"
)

func Migrate() {

	err := DB.AutoMigrate(
		&models.User{},
		&models.URL{},
	)

	if err != nil {
		log.Fatal("Migration Failed:",err)
	}

	log.Println("Database migrated successfully")

}