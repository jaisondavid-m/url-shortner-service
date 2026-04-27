package middlewares

import (
	"net/http"
	"server/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		tokenStr := c.GetHeader("Authorization")

		if tokenStr == "" {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message":"No Token Found",
				"error":true,
			})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{},error) {
			return utils.JwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message":"Invalid Token",
				"error":true,
			})
			c.Abort()
			return
		}

		c.Next()

	}
}