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

func DeleteUser(c *gin.Context) {

	id := c.Param("id")

	var user models.User

	if err := config.DB.First(&user,id).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{
			"message":"User Not Found",
			"error":true,
		})
		return
	}

	currentUserID := c.GetUint("userID")
	if user.ID == currentUserID {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"You cannot delete yourself",
			"error":true,
		})
		return
	}

	if err := config.DB.Where("user_id = ?",user.ID).Delete(&models.URL{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to delete user's URLs",
			"error":true,
		})
		return
	}

	if err := config.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to delete user",
			"error":true,
		})
		return
	}

	if err := config.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to delete user",
			"error":true,
		})
		return
	}

	c.JSON(http.StatusOK,gin.H{
		"message":"User delete successfully",
		"success":true,
	})

}

func DeleteAnyURL(c *gin.Context) {

	code := c.Param("code")

	var url models.URL

	if err := config.DB.Where("short_code = ?",code).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{
			"message":"URL not found",
			"error":true,
		})
		return
	}

	if err := config.DB.Delete(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"Failed to delete URL",
			"error":true,
		})
	}

	c.JSON(http.StatusOK,gin.H{
		"message":"URL deleted Successfully",
		"success":true,
		"error":false,
	})

}