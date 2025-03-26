package main

import "github.com/gofiber/fiber/v2"
import "GO-REACT-BLOG/server/database"

func init(){
	database.ConnectDB()
}
func main(){
	
	sqlDb, err :=database.DBConn.DB()
	if err !=nil{
		panic("error in sql connection")
	}
	defer sqlDb.Close()
	app :=fiber.New()
	app.Get("/",func(c *fiber.Ctx) error{
		return c.JSON(fiber.Map{"message":"welcome to my first blog application"})
	})
	app.Listen(":8000")
}