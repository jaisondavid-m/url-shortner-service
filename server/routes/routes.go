package routes

import (

	"server/handlers"
	"github.com/gin-gonic/gin"

)

func RegisterRoutes(r *gin.Engine) {
	
	api := r.Group("/api")

	api.GET("/test",handlers.TestHandler)

}