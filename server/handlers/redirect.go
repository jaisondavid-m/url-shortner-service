package handlers

import (
	"net/http"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

	if url.Password != ""{

		c.JSON(http.StatusOK,gin.H{
			"protected":true,
		})
		return

		// var req struct {
		// 	Password string `json:"password"`
		// }

		// if err := c.ShouldBindJSON(&req); err != nil || req.Password == "" {
		// 	c.JSON(http.StatusUnauthorized,gin.H{
		// 		"message":"Password required",
		// 		"protected":true,
		// 		"error":true,
		// 	})
		// 	return
		// }

		// if err := utils.CheckPassword(url.Password,req.Password); err != nil {
		// 	c.JSON(http.StatusUnauthorized,gin.H{
		// 		"message":"Invalid Password",
		// 		"error":true,
		// 	})
		// 	return
		// }
	}

	config.DB.Model(&url).UpdateColumn("clicks",gorm.Expr("clicks + ?",1))

	c.Redirect(http.StatusFound,url.OriginalURL)
}

func VerifyAndRedirect(c *gin.Context) {

	code := c.Param("code")

	var url models.URL

	if err := config.DB.Where("short_code = ?",code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{
			"message":"URL not found",
			"error":true,
		})
		return
	}

	var req struct {
		Password 	string 		`json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil || req.Password == "" {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Password required",
			"error":true,
		})
		return
	}

	if err := utils.CheckPassword(req.Password, url.Password); err != nil {
		c.JSON(http.StatusUnauthorized,gin.H{
			"message":"Invalid Password",
			"error":true,
		})
		return
	}

	config.DB.Model(&url).UpdateColumn("clicks",gorm.Expr("clicks + ?",1))

	c.JSON(http.StatusOK,gin.H{
		"redirect_url":url.OriginalURL,
	})
}