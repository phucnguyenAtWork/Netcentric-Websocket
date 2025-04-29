postgresinit:
	docker run --name postgreSQL -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=Password123 -d postgres

postgres:
	docker exec -it postgreSQL psql

createdb:
	docker exec -it postgreSQL createdb --username=root --owner=root go-chat

dropdb:
	docker exec -it postgreSQL dropdb go-chat

migrateup:
	migrate -path db/migration -database "postgresql://admin:123456@localhost:5432/go-chat?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://admin:123456@localhost:5432/go-chat?sslmode=disable" -verbose down
	
.PHONY: postgresinit postgres createdb dropdb