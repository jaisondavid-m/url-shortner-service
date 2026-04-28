package handlers

import (
	"fmt"
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

	if err := config.DB.Where("short_code = ?", code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "URL not found",
			"error":   true,
		})
		return
	}

	if url.Password != "" {

		html := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Protected Link</title>
			<style>
				body { font-family: Arial; text-align: center; margin-top:100px; }
				input { padding: 10px; width: 200px; }
				button { padding: 10px 20px; margin-top: 10px; }
			</style>
		</head>
		<body>
			<h2>This link is password protected</h2>
			<form method="POST" action="/%s/verify">
				<input type="password" name="password" placeholder="Enter password" required />
				<br/>
				<button type="submit">Unlock</button>
			</form>
		</body>
		</html>
		`, code)
		c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(html))
		return
		// c.JSON(http.StatusOK,gin.H{
		// 	"protected":true,
		// })
		// return

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

	config.DB.Model(&url).UpdateColumn("clicks", gorm.Expr("clicks + ?", 1))

	c.Redirect(http.StatusFound, url.OriginalURL)
}

func VerifyAndRedirect(c *gin.Context) {

	code := c.Param("code")

	var url models.URL

	if err := config.DB.Where("short_code = ?", code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "URL not found",
			"error":   true,
		})
		return
	}

	password := c.PostForm("password")

	if password == "" {
		var req struct {
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			password = req.Password
		}
	}

	// if err := c.ShouldBindJSON(&req); err != nil || req.Password == "" {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"message": "Password required",
	// 		"error":   true,
	// 	})
	// 	return
	// }

	if password == "" {
		c.String(http.StatusBadRequest,"Password required")
		return
	}

	if err := utils.CheckPassword(password, url.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid Password",
			"error":   true,
		})
		return
	}

	config.DB.Model(&url).UpdateColumn("clicks", gorm.Expr("clicks + ?", 1))

	// c.JSON(http.StatusOK, gin.H{
	// 	"redirect_url": url.OriginalURL,
	// })
	c.Redirect(http.StatusFound,url.OriginalURL)
}
