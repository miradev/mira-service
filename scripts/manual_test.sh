#!/bin/bash

# Create widget
curl -X POST 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "A clock application"
}' && echo