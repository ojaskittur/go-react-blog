package controller

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"GO-REACT-BLOG/server/database"
	"GO-REACT-BLOG/server/model"
	"log"
	"path/filepath"
	"time"
)

func BlogList(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Blog List",
	}
	db := database.DBConn
	var records []model.Blog
	db.Find(&records)
	context["blog_records"] = records
	c.Status(200)
	return c.JSON(context)
}

func BlogDetail(c *fiber.Ctx) error {
	c.Status(400)
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}
	id := c.Params("id")
	var record model.Blog
	database.DBConn.First(&record, id)
	if record.ID == 0 {
		log.Println("Record not found")
		context["msg"] = "record not found"
		return c.JSON(context)
		c.Status(404)
	}
	context["record"] = record
	context["statusText"] = "ok"
	context["msg"] = "Blog detail"
	c.Status(200)
	return c.JSON(context)
}

func BlogCreate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Add a blog",
	}
	
	// Handle file upload if present
	imagePath := ""
	file, err := c.FormFile("image")
	if err == nil {
		// Generate unique filename
		timestamp := time.Now().UnixNano()
		filename := fmt.Sprintf("%d%s", timestamp, filepath.Ext(file.Filename))
		imagePath = fmt.Sprintf("/uploads/%s", filename)
		
		// Save the file
		err := c.SaveFile(file, fmt.Sprintf("./uploads/%s", filename))
		if err != nil {
			log.Println("Error saving file:", err)
			context["statusText"] = ""
			context["msg"] = "Error saving uploaded image"
			c.Status(500)
			return c.JSON(context)
		}
	}
	
	// Create blog record
	record := new(model.Blog)
	if err := c.BodyParser(record); err != nil {
		log.Println("Error in parsing request:", err)
		context["statusText"] = ""
		context["msg"] = "something went wrong"
		c.Status(400)
		return c.JSON(context)
	}
	
	// Set image path if uploaded
	if imagePath != "" {
		record.ImagePath = imagePath
	}
	
	result := database.DBConn.Create(record)
	if result.Error != nil {
		log.Println("error in saving data:", result.Error)
		context["statusText"] = ""
		context["msg"] = "something went wrong"
		c.Status(500)
		return c.JSON(context)
	}
	
	context["msg"] = "Record saved successfully"
	context["data"] = record
	c.Status(201)
	return c.JSON(context)
}

func BlogUpdate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Update Blog",
	}
	id := c.Params("id")
	var record model.Blog
	database.DBConn.First(&record, id)
	if record.ID == 0 {
		log.Println("Record not found")
		context["statusText"] = ""
		context["msg"] = "record not found"
		c.Status(400)
		return c.JSON(context)
	}
	
	// Handle file upload if present
	file, err := c.FormFile("image")
	if err == nil {
		// Generate unique filename
		timestamp := time.Now().UnixNano()
		filename := fmt.Sprintf("%d%s", timestamp, filepath.Ext(file.Filename))
		imagePath := fmt.Sprintf("/uploads/%s", filename)
		
		// Save the file
		err := c.SaveFile(file, fmt.Sprintf("./uploads/%s", filename))
		if err != nil {
			log.Println("Error saving file:", err)
			context["statusText"] = ""
			context["msg"] = "Error saving uploaded image"
			c.Status(500)
			return c.JSON(context)
		}
		
		// Update the image path
		record.ImagePath = imagePath
	}
	
	// Parse form data
	if err := c.BodyParser(&record); err != nil {
		log.Println("error in parsing message:", err)
		context["statusText"] = ""
		context["msg"] = "Error parsing form data"
		c.Status(400)
		return c.JSON(context)
	}
	
	result := database.DBConn.Save(record)
	if result.Error != nil {
		log.Println("error in saving data:", result.Error)
		context["statusText"] = ""
		context["msg"] = "Error saving data"
		c.Status(500)
		return c.JSON(context)
	}
	
	context["msg"] = "record updated successfully"
	context["data"] = record
	c.Status(200)
	return c.JSON(context)
}

func BlogDelete(c *fiber.Ctx) error {
	c.Status(400)
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}
	id := c.Params("id")
	var record model.Blog
	database.DBConn.First(&record, id)
	if record.ID == 0 {
		log.Println("Record not found")
		context["msg"] = "record not found"
		return c.JSON(context)
	}
	
	result := database.DBConn.Delete(record)
	if result.Error != nil {
		context["msg"] = "something went wrong"
		return c.JSON(context)
	}
	
	context["statusText"] = "ok"
	context["msg"] = "record deleted successfully"
	c.Status(200)
	return c.JSON(context)
}