package middlewares

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {

		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden,gin.H{
				"message":"Access denied",
				"error":true,
			})
			c.Abort()
			return
		}
	}
}