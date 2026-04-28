package handlers

import (
	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)
 
func GetAllUsers(c *gin.Context) {

	var users []models.User

	if err := config.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to fetch Users",
			"error": true,
		})
		return
	}

	var response []models.UserResponse

	for _, u := range users {
		response = append(response, models.UserResponse{
			ID: u.ID,
			Name: u.Name,
			Email: u.Email,
			Avatar: u.Avatar,
			Role: u.Role,
			IsActive: u.IsActive,
			CreatedAt: u.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK,gin.H{
		"users":response,
		"error":false,
	})

}

func GetAllURLs(c *gin.Context) {

	var urls []models.URL

	if err := config.DB.Order("created_at desc").Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to fetch URLs",
			"error":true,
		})
		return
	}

	var response []models.URLResponse

	for _, u := range urls {
		response = append(response, models.URLResponse{
			ID: u.ID,
			OriginalURL: u.OriginalURL,
			ShortCode: u.ShortCode,
			UserID: u.UserID,
			Clicks: u.Clicks,
			CreatedAt: u.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK,gin.H{
		"data":response,
		"count":len(response),
		"success":true,
		"error":false,
	})
}