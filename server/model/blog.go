package model

// import "gorm.io/gorm"


type Blog struct {
	ID    uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Title string `json:"title" gorm:"not null;column:title;size:255"`
	Post  string `json:"post" gorm:"not null;column:post;size:255"`
}
