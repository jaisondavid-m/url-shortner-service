package handlers

import (
	"os"
	"context"
	"net/http"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

var GoogleClientID = os.Getenv("GOOGLE_CLIENT_ID")

func Register(c *gin.Context) {

	var req models.RegisterReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Input",
			"error":true,
		})
		return
	}

	hashed, _ := utils.HashPassword(req.Password)

	user := models.User{
		Name: req.Name,
		Email: req.Email,
		Password: hashed,
		Role: "user",
		IsActive: true,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"message":"User Alreay exists",
			"error": true,
		})
		return
	}

	token, _ := utils.GenerateToken(user.Email)

	c.JSON(http.StatusOK,gin.H{
		"token":token,
		"user":user,
		"error":false,
	})

}

func Login(c *gin.Context) {

	var req models.LoginReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Input",
			"error":true,
		})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?",req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized,gin.H{
			"message":"User not found",
			"error":true,
		})
		return
	}

	if err := utils.CheckPassword(req.Password,user.Password); err != nil {
		c.JSON(http.StatusUnauthorized,gin.H{
			"message":"Wrong Password",
			"error":true,
		})
		return
	}

	token, _ := utils.GenerateToken(user.Email)

	c.JSON(http.StatusOK,gin.H{
		"token":token,
		"user":user,
		"error":false,
	})

}

func GoogleLogin(c *gin.Context) {

	var req models.GoogleLoginReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Invalid Token",
			"error":true,
		})
		return
	}

	payload, err := idtoken.Validate(context.Background(), req.Token, GoogleClientID)
	if err != nil {
		c.JSON(http.StatusUnauthorized,gin.H{
			"message":"Invalid Google Token",
		})
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)
	picture := payload.Claims["sub"].(string)
	googleID := payload.Claims["sub"].(string)

	var user models.User
	err = config.DB.Where("email = ?",email).First(&user).Error

	if err != nil {
		user = models.User{
			Name: name,
			Email: email,
			Avatar: picture,
			GoogleID: googleID,
			Role: "user",
			IsActive: true,
		}
		config.DB.Create(&user)
	} else {
		user.Name = name
		user.Avatar = picture
		user.GoogleID = googleID
		config.DB.Save(&user)
	}

	token, _ := utils.GenerateToken(user.Email)

	c.JSON(http.StatusOK,gin.H{
		"token":token,
		"user":user,
		"error":false,
	})

}