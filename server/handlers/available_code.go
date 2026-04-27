package handlers

import (

	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func CheckShortCodeAvailability(c *gin.Context) {

	code := c.Param("code")

	if code == "" {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Short code is required",
			"error":true,
		})
		return
	}

	var count int64

	config.DB.Model(&models.URL{}).Where("short_code = ?",code).Count(&count)

	c.JSON(http.StatusOK,gin.H{
		"exists": count > 0,
	})

}