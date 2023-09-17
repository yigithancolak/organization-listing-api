mongo-test-db: mongo-network
	@sh -c 'docker run --name mongo-test-db --network mongo-network -p 27017:27017 --memory="512m" -d mongo:latest'

mongo-admin: mongo-network
	@sh -c 'docker run --network mongo-network -e ME_CONFIG_MONGODB_SERVER=mongo-test-db -p 8081:8081 mongo-express'


mongo-network:
	@sh -c 'docker network create mongo-network || true'


.PHONY: create-network mongo-test-db mongo-admin
