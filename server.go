package main

import(
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"GO-REACT-BLOG/server/database"
	"GO-REACT-BLOG/server/router"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


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

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type,Accept",
	}))
	
	app.Use(logger.New())
	router.SetUpRoutes(app)
	app.Listen(":8000")
}