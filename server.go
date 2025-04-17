package main

import(
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"GO-REACT-BLOG/server/database"
	"GO-REACT-BLOG/server/router"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"os"
)

func ensureUploadsDirectory() {
	uploadsDir := "./uploads"
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		err := os.MkdirAll(uploadsDir, 0755)
		if err != nil {
			log.Fatal("Failed to create uploads directory:", err)
		}
		log.Println("Created uploads directory")
	}
}
func init(){
	database.ConnectDB()
}
func main(){
	
	sqlDb, err :=database.DBConn.DB()
	if err !=nil{
		panic("error in sql connection")
	}
	defer sqlDb.Close()
	ensureUploadsDirectory()
	app :=fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type,Accept",
	}))
	
	app.Use(logger.New())
	router.SetUpRoutes(app)
	app.Listen(":8000")
}