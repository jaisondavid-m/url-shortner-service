package middlewares

import (
	"net/http"
	"server/utils"
	"strings"

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

		tokenStr = strings.Replace(tokenStr,"Bearer ","",1)

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

		claims := token.Claims.(jwt.MapClaims)
		email := claims["email"].(string)
		
		rawID, ok := claims["userID"]
		if !ok {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message":"UserID is missing in the token",
				"error":true,
			})
			c.Abort()
			return
		}
		idFloat := rawID.(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized,gin.H{
				"message":"Invalid userID type",
				"error":true,
			})
			c.Abort()
			return
		}
		userID := uint(idFloat)

		c.Set("email",email)
		c.Set("userID",userID)

		c.Next()

	}
}