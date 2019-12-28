#!/bin/bash

# Create widget
curl -X POST 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "A clock application",
  "active": false
}' && echo

curl -X DELETE 'http://localhost:8000/widgets/5e06c542b9593c81c8f6bf22' && echo