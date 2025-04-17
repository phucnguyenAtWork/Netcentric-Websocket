package main

import (
	"log"
	"server/server/db"
	"server/server/internal/user"
	"server/server/internal/ws"
	"server/server/router"
)

func main() {
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("Error connecting to database:%s", err)
	}
	userRep := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()
	router.InitRouter(userHandler, wsHandler)
	router.Start("0.0.0.0:8080")

}
