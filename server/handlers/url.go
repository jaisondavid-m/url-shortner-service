package handlers

import (
	"net/http"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func CreateShortURL(c *gin.Context) {

	var req models.UrlReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Input",
			"error":   true,
		})
		return
	}

	userID := c.GetUint("userID")

	// shortCode := utils.GenerateShortCode()
	var shortCode string

	for {

		shortCode = utils.GenerateShortCode()

		var count int64

		config.DB.Model(&models.URL{}).Where("short_code = ?", shortCode).Count(&count)

		if count == 0 {
			break
		}

	}

	url := models.URL{
		OriginalURL: req.OriginalURL,
		ShortCode:   shortCode,
		UserID:      userID,
	}

	if err := config.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to create URL",
			"error":   true,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"short_url": "http://localhost:8000/" + shortCode,
		"data":      url,
		"success":   false,
	})

}


func CreateCustomURL(c *gin.Context) {

	var req models.CustomUrlReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Input",
			"error":true,
		})
		return
	}

	if req.CustomCode == "" {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Custom code is required",
			"error":true,
		})
		return
	}

	userID := c.GetUint("userID")

	var count int64
	config.DB.Model(&models.URL{}).Where("short_code = ?",req.CustomCode).Count(&count)

	if count > 0 {
		c.JSON(http.StatusConflict,gin.H{
			"message":"Custom code already taken",
			"error":true,
		})
		return
	}

	url := models.URL{
		OriginalURL: req.OriginalURL,
		ShortCode: req.CustomCode,
		UserID: userID,
	}

	if err := config.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Unable to create URL",
			"error":true,
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"short_url":"http://localhost:8000/" + req.CustomCode,
		"data":url,
		"error":false,
		"success":true,
	})

}

