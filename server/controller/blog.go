package controller
import (
	"github.com/gofiber/fiber/v2"
	"GO-REACT-BLOG/server/database"
	"GO-REACT-BLOG/server/model"
	"log"
)

func BlogList(c *fiber.Ctx) error{
	context :=fiber.Map{
		"statusText": "OK",
		"msg": "Blog List",
	}
	db :=database.DBConn
	var records []model.Blog
	db.Find(&records)
	context["blog_records"]= records
	c.Status(200)
	return c.JSON(context)
}

func BlogCreate(c *fiber.Ctx) error{
	context :=fiber.Map{
		"statusText": "OK",
		"msg": "Add a blog",
	}

	record :=new (model.Blog)
	if err :=c.BodyParser(&record); err!=nil{
		log.Println("Error in parsing request")
		context["statusText"]=""
		context["msg"]="something went wrong"
	}
	result :=database.DBConn.Create(record)

	if(result.Error !=nil){
		log.Println("error in saving data")
		context["statusText"]=""
		context["msg"]="something went wrong"
	}
	context["msg"]="Record saved sucessfully"
	context["data"]=record

	c.Status(201)
	return c.JSON(context)
}

func BlogUpdate(c *fiber.Ctx) error{
	context :=fiber.Map{
		"statusText": "OK",
		"msg": "Update Blog",
	}
	id :=c.Params("id")
	var record model.Blog
	database.DBConn.First(&record, id)
	if(record.ID==0){
		log.Println("Record not found")
		context["statusText"]=""
		context["msg"]="record not found"
		c.Status(400)
		return c.JSON(context)
	}
	if err:=c.BodyParser(&record); err!=nil{
		log.Println("error in parsing message")
	}

	result:=database.DBConn.Save(record)

	if result.Error !=nil{
		log.Println("error in saving data")
	}
	context["msg"]="record updation sucessful"
	context["data"]=record
	c.Status(200)
	return c.JSON(context)
}

func BlogDelete(c *fiber.Ctx) error{
	context :=fiber.Map{
		"statusText": "OK",
		"msg": "Delete Blog with id",
	}
	c.Status(200)
	return c.JSON(context)
}