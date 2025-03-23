package main

import (
	"log"
	"server/server/db"
)

func main() {
	_, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("Error connecting to database:%s", err)
	}
}
