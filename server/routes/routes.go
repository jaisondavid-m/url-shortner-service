package routes

import (
	"server/handlers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	
	api := r.Group("/api")
	api.GET("/health",handlers.TestHandler)

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
		protected.GET("/shortcode/:code/check",handlers.CheckShortCodeAvailability)
		protected.GET("/expand",handlers.ExpandURL)
		protected.GET("/myurls",handlers.GetUserURL)
		protected.DELETE("/url/:code",handlers.DeleteURL)
		protected.POST("/protected",handlers.CreateProtectedURL)
	}

	admin := protected.Group("/admin")
	admin.Use(middlewares.AdminOnly())
	{
		admin.GET("/users",handlers.GetAllUsers)
		admin.GET("/urls",handlers.GetAllURLs)
		admin.DELETE("/user/:id",handlers.DeleteUser)
		admin.DELETE("/url/:code",handlers.DeleteAnyURL)
	}

	r.GET("/:code",handlers.RedirectURL)
	r.POST("/:code/verify",handlers.VerifyAndRedirect)
}