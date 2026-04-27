package handlers

import (
	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func RedirectURL(c *gin.Context) {

	code := c.Param("code")

	var url models.URL

	if err := config.DB.Where("short_code = ?",code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{
			"message":"URL not found",
			"error":true,
		})
		return
	}

	config.DB.Model(&url).Update("clicks",url.Clicks+1)

	c.Redirect(http.StatusFound,url.OriginalURL)
}