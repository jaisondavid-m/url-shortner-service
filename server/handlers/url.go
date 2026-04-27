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
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Input",
			"error":true,
		})
		return
	}

	userID := c.GetUint("userID")

	shortCode := utils.GenerateShortCode()

	url := models.URL{
		OriginalURL: req.OriginalURL,
		ShortCode: shortCode,
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
		"short_url": "http://localhost:8000/" + shortCode,
		"data": url,
		"success":false,
	})

}