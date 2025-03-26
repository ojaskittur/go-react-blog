package router
import "github.com/gofiber/fiber/v2"
import "GO-REACT-BLOG/server/controller"

func SetUpRoutes(app * fiber.App){
	app.Get("/", controller.BlogList)
	app.Post("/",controller.BlogCreate)
	app.Put("/:id",controller.BlogUpdate)
	app.Delete("/:id",controller.BlogDelete)
}