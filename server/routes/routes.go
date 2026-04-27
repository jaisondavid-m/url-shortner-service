package routes

import (
	"server/handlers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	
	api := r.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/register",handlers.Register)
		auth.POST("/login",handlers.Login)
		auth.POST("/google",handlers.GoogleLogin)
	}

	protected := api.Group("/")
	protected.Use(middlewares.AuthMiddleware())
	{
		protected.GET("/test",handlers.TestHandler)
		protected.POST("/shorten",handlers.CreateShortURL)
		protected.POST("/shorten/custom",handlers.CreateCustomURL)
	}

	r.GET("/:code",handlers.RedirectURL)

}