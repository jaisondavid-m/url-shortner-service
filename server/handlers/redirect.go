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
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<style>
				body { 
					display: flex;
					font-family: 'Segoe UI',sans-serif;
					justify-content: center;
					margin:0;
					height: 100vh;
					align-items: center;
					background: linear-gradient(135deg, #667eea, #764ba2);
				}
				.card {
					background: white;
					padding: 40px;
					border-radius: 12px;
					box-shadow: 0 10px 25px rgba(0,0,0,0.2);
					text-align: center;
					width: 300px;
				}
				h2 {
					margin-bottom: 20px;
					color: #333;
				}
				form {
					display: flex;
					gap:10px;
				}
				input {
					flex:1
					width: 100%%; 
					padding: 12px;
					border-radius: 8px;
					border: 1px solid #ddd;
					// margin-bottom: 15px;
					font-size: 14px;
					box-sizing: border-box;
				}
				button {
					width: 100%%;
					padding: 12px 16px;
					border: none;
					border-radius: 8px;
					background: #667eea;
					color: white;
					font-size: 16px;
					cursor: pointer;
					transition: 0.3s;
				}
				button:hover {
					background: #5a67d8;
				}
				.footer {
					margin-top: 15px;
					font-size: 12px;
					color: #888;
				}
			</style>
		</head>
		<body>
			<div class="card">
				<h2>Protected Link</h2>
				<form method="POST" action="/%s/verify">
					<input type="password" name="password" placeholder="Enter password" required />
					<button type="submit">Unlock</button>
				</form>
				<div class="footer">Secure Access Required</div>
			</div>	
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
		c.String(http.StatusBadRequest, "Password required")
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
	c.Redirect(http.StatusFound, url.OriginalURL)
}
