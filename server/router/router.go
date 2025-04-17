package router

import (
	"github.com/gofiber/fiber/v2"
	"GO-REACT-BLOG/server/controller"
)

func SetUpRoutes(app *fiber.App) {
	// Static file server for uploads
	app.Static("/uploads", "./uploads")
	
	// API routes
	app.Get("/", controller.BlogList)
	app.Get("/:id", controller.BlogDetail)
	app.Post("/", controller.BlogCreate)
	app.Put("/:id", controller.BlogUpdate)
	app.Delete("/:id", controller.BlogDelete)
}