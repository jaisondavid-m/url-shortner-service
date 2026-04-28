package middlewares

import (
	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "User not authenticated",
				"error":   true,
			})
			c.Abort()
			return
		}

		userID, ok := userIDValue.(uint)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid user context",
				"error":   true,
			})
			c.Abort()
			return
		}

		var user models.User
		if err := config.DB.Select("role").First(&user, userID).Error; err != nil || user.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Access denied",
				"error":   true,
			})
			c.Abort()
			return
		}

		c.Set("role", user.Role)
		c.Next()
	}
}
