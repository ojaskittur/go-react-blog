package router
import "github.com/gofiber/fiber/v2"
import "GO-REACT-BLOG/server/controller"

func SetUpRoutes(app * fiber.App){
	app.Get("/", controller.BlogList)
	app.Post("/",controller.BlogCreate)
	app.Put("/",controller.BlogUpdate)
	app.Delete("/",controller.BlogDelete)
}