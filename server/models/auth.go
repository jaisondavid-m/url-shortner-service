package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name 		string 		`json:"name"`
	Email 		string 		`json:"email" gorm:"unique"`
	Password 	string 		`json:"-"`
	GoogleID 	string 		`json:"google+id"`
	Avatar 		string 		`json:"avatar"`
	Role 		string 		`json:"role"`
	IsActive 	bool 		`json:"is_active"`
}

type RegisterReq struct {
	Name 		string 		`json:"name"`
	Email 		string 		`json:"email"`
	Password 	string 		`json:"password"`
}

type LoginReq struct {
	Email 		string 		`json:"email"`
	Password 	string 		`json:"password"`
}

type GoogleLoginReq struct {
	Token string `json:"token"`
}