package handlers

import (
	"net/http"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func CreateProtectedURL(c *gin.Context) {

	var req models.ProtectedUrlReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Input",
			"error":true,
		})
		return
	}

	if req.Password == "" {
		c.JSON(http.StatusBadRequest,gin.H{
			"message": "Password is required",
			"error":true,
		})
		return
	}

	userID := c.GetUint("userID")

	var shortCode string
	for {
		shortCode = utils.GenerateShortCode()
		var count int64
		config.DB.Model(&models.URL{}).Where("short_code = ?",shortCode).Count(&count)
		if count == 0 {
			break
		}
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Error securing password",
			"error":true,
		})
		return
	}

	url := models.URL{
		OriginalURL: req.OriginalURL,
		ShortCode: shortCode,
		UserID: userID,
		Password: hashedPassword,
	}

	if err := config.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Unable to create URL",
			"error":true,
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"short_url":"http://localhost:8000/" + shortCode,
		"success":true,
		"error":false,
	})

}