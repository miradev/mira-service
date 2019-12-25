# Mira Service
This is the backend service for Mira.

## Getting Started
Install Dependencies
```shell script
yarn install
```
Start the server
```shell script
yarn start
```
Navigate to `http://localhost:8000/`. You should see the following:
```
Welcome to the Mira backend service!
```
## Development
Install docker. Start up docker daemon.
```shell script
sudo dockerd
```
Create the local database. You should be able to start using the endpoints locally.
```shell script
sudo ./scripts/create_mongo.sh
```