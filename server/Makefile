postgresinit:
	docker run --name postgreSQL -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123456 -d postgres

postgres:
  docker ps | grep postgreSQL || docker start postgreSQL
  docker exec -it postgreSQL psql


createdb:
	docker exec -it postgreSQL createdb --username=admin --owner=admin go-chat

dropdb:
	docker exec -it postgreSQL dropdb --username=admin go-chat

migrateup:
	migrate -path db/migrations -database "postgresql://admin:123456@localhost:5432/go-chat?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://admin:123456@localhost:5432/go-chat?sslmode=disable" -verbose down
	
.PHONY: postgresinit postgres createdb dropdb migrateup migratedown