package config

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"log"
	"os"
	"strings"
	"time"

	mysqlDriver "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {

	err := godotenv.Load()

	if err != nil {
		log.Println("No env file found")
	}

	dsn := os.Getenv("DB_DSN")

	if dsn == "" {
		log.Fatal("DB_DSN is not set")
	}

	cert := os.Getenv("DB_CERT")

	if cert == "" {
		log.Fatal("DB_CERT is not set")
	}

	cert = strings.TrimSpace(cert)
	cert = strings.Trim(cert, `"`)
	cert = strings.ReplaceAll(cert, `\n`, "\n")
	if !strings.Contains(cert, "BEGIN CERTIFICATE") {
		log.Fatal("Invalid cert format")
	}
	cert = strings.Replace(cert, "-----BEGIN CERTIFICATE-----", "-----BEGIN CERTIFICATE-----\n", 1)
	cert = strings.Replace(cert, "-----END CERTIFICATE-----", "\n-----END CERTIFICATE-----", 1)

	rootCertPool := x509.NewCertPool()

	block, _ := pem.Decode([]byte(cert))
	if block == nil {
		log.Println("==== CERT DEBUG START ====")
		log.Println(cert[:200])
		log.Println("==== CERT DEBUG END ====")
		log.Fatal("PEM decode failed -> cert is invalid")
	}

	if ok := rootCertPool.AppendCertsFromPEM([]byte(cert)); !ok {
		log.Fatal("Failed to append CA cert")
	}

	tlsConfig := &tls.Config{
		RootCAs:    rootCertPool,
		MinVersion: tls.VersionTLS12,
	}

	err = mysqlDriver.RegisterTLSConfig("custom", tlsConfig)

	if err != nil {
		log.Fatal(err)
	}

	for i := 1; i <= 5; i++ {
		DB, err = gorm.Open(mysql.New(mysql.Config{
			DSN: dsn,
		}), &gorm.Config{
			PrepareStmt: true,
		})
		if err == nil {
			log.Println("DB Connected an attempt", i)
			break
		}
		log.Println("Retrying DB connection....", i)
		time.Sleep(3 * time.Second)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("DB ping failed", err)
	}
	if err := sqlDB.Ping(); err != nil {
		log.Fatal("DB ping failed:", err)
	}

	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	log.Print("DB Connected Successfully")

}
