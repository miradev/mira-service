#!/bin/bash

# Create user
curl -X POST 'http://localhost:8000/signup' \
-H "Content-Type: application/json" \
-d '{
  "username": "User2",
  "password": "hunter2",
  "email": "example@gmail.com",
  "dev": true
}' && echo

# Login
curl -X POST --cookie-jar jarfile 'http://localhost:8000/login' \
-H "Content-Type: application/json" \
-d '{
  "username": "User2",
  "password": "hunter2"
}' && echo

#curl --cookie-jar jarfile --data "{username=User&password=hunter2}" http://localhost:8000/login && echo

echo "I am a widget" >> widget.zip
# Upload widget file
curl -X POST --cookie jarfile 'http://localhost:8000/widgets/upload' \
-H "Content-Type: multipart/form-data" \
-F 'widget=@widget.zip' && echo

# Create widget
curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "_id": "mira_weather",
  "name": "Mira Weather",
  "description": "This is the default weather app. Displays local weather conditions and temperatures.",
  "active": false,
  "filename": "weather.zip",
  "images": ["https://images.unsplash.com/photo-1508697014387-db70aad34f4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"]
}' && echo

curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "_id": "mira_clock",
  "name": "Mira Clock",
  "description": "This is the default clock. Basic 7-segment display showing current time.",
  "active": false,
  "filename": "clock.zip",
  "images": ["https://images.unsplash.com/photo-1547908068-b3c55fdda5be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"]
}' && echo

curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "_id": "mira_calendar",
  "name": "Mira Calendar",
  "description": "Sync with your preferred calendar application and shows your daily agenda.",
  "active": false,
  "filename": "calendar.zip",
  "images": ["https://images.unsplash.com/photo-1543168256-4ae2229821f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"]
}' && echo

# Widget with bad id
curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "_id": "mira calendar",
  "name": "Mira Calendar",
  "description": "Sync with your preferred calendar application and shows your daily agenda.",
  "active": false,
  "filename": "calendar.zip",
  "images": ["https://images.unsplash.com/photo-1543168256-4ae2229821f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"]
}' && echo

# Update, should not be successful
curl -X PUT --cookie jarfile 'http://localhost:8000/widgets/5e08e7d2d8c9b1285e8ebd3e' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "An updated description",
  "active": false
}' && echo

# Widgets by userId 5e5eda40d5c09c19e0b26b32
curl -X GET --cookie jarfile 'http://localhost:8000/widgets?userId=5e5eda40d5c09c19e0b26b32' \
-H "Content-Type: application/json" && echo

# Add device
curl -X POST --cookie jarfile 'http://localhost:8000/users/5e5eda40d5c09c19e0b26b32/devices' \
-H "Content-Type: application/json" \
-d '{
  "name": "My bedroom mirror",
  "_id" : "124"
}' && echo

curl -X GET --cookie jarfile 'http://localhost:8000/users/5e5eda40d5c09c19e0b26b32/devices/124' \
-H "Content-Type: application/json" && echo

curl -X PUT --cookie jarfile 'http://localhost:8000/users/5e5eda40d5c09c19e0b26b32/devices/124' \
-H "Content-Type: application/json" \
-d '{
  "name": "My bedroom mirror updated",
  "_id" : "124",
  "config": {"someConfig": true}
}' && echo

#curl -X DELETE 'http://localhost:8000/widgets/5e06c542b9593c81c8f6bf22' && echo
rm widget.zip
