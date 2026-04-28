package models

import "gorm.io/gorm"

type URL struct {
	gorm.Model
	OriginalURL 	string 		`json:"original_url"`
	ShortCode 		string 		`json:"short_code" gorm:"type:varchar(20);uniqueIndex"`
	UserID 			uint 		`json:"user_id"`
	User			User		`json:"foreignKey:UserID"`
	Clicks			int 		`json:"clicks"`
	Password 		string 		`json:"-"`
}

type UrlReq struct {
	OriginalURL 	string 		`json:"original_url"`
}

type CustomUrlReq struct {
	OriginalURL 	string 		`json:"original_url"`
	CustomCode 		string 		`json:"custom_code"`
}

type ProtectedUrlReq struct {
	OriginalURL 	string 		`json:"original_url"`
	Password 		string		`json:"password"`
}