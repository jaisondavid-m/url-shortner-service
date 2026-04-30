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
		"short_url": "https://url-shortner-service-jjjx.onrender.com/" + shortCode,
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
		"short_url":"https://url-shortner-service-jjjx.onrender.com/" + req.CustomCode,
		"data":url,
		"error":false,
		"success":true,
	})

}

func GetUserURL(c *gin.Context) {

	userID := c.GetUint("userID")

	var urls []models.URL

	if err := config.DB.Where("user_id = ?",userID).Order("created_at").Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Unable to fetch URLs",
			"error":true,
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"data": urls,
		"count": len(urls),
		"success":true,
		"error":false,
	})
}

func DeleteURL(c *gin.Context) {

	code := c.Param("code")
	userID := c.GetUint("userID")

	var url models.URL

	if err := config.DB.Where("short_code = ?",code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{
			"message":"URL not found",
			"error":true,
		})
		return
	}

	if url.UserID != userID {
		c.JSON(http.StatusForbidden,gin.H{
			"message":"You are not allowed to delete this URL",
			"error":true,
		})
		return
	}

	if err := config.DB.Delete(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to delete URL",
			"error":true,
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"message":"URL deleted Successfully",
		"success":true,
		"error":false,
	})

}