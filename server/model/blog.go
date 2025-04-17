package model

type Blog struct {
	ID        uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Title     string `json:"title" gorm:"not null;column:title;size:255"`
	Post      string `json:"post" gorm:"not null;column:post;size:255"`
	ImagePath string `json:"image_path" gorm:"column:image_path;size:255"`
}