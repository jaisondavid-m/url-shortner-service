package handlers

import (

	"os"
	"net/http"

	"github.com/gin-gonic/gin"

)

func TestHandler(c *gin.Context) {
	c.JSON(http.StatusOK,gin.H{
		"message":"API is working",
		"env_check":os.Getenv("FRONTEND_URLS"),
	})
}