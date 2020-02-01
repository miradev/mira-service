#!/bin/bash

# Create widget
curl -X POST 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "A clock application",
  "active": false
}' && echo

curl -X PUT 'http://localhost:8000/widgets/5e08e7d2d8c9b1285e8ebd3e' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "An updated description",
  "active": false
}' && echo

#curl -X DELETE 'http://localhost:8000/widgets/5e06c542b9593c81c8f6bf22' && echo

# Create widget
curl -X POST 'http://localhost:8000/signup' \
-H "Content-Type: application/json" \
-d '{
  "username": "User",
  "password": "hunter2"
}' && echo
