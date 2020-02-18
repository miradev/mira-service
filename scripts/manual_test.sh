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
  "username": "User",
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
  "name": "Mira Weather",
  "description": "This is the default weather app. Displays local weather conditions and temperatures.",
  "active": false,
  "filename": "weather.zip"
}' && echo

curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "name": "Mira Clock",
  "description": "This is the default clock. Basic 7-segment display showing current time.",
  "active": false,
  "filename": "clock.zip"
}' && echo

curl -X POST --cookie jarfile 'http://localhost:8000/widgets' \
-H "Content-Type: application/json" \
-d '{
  "name": "Mira Calender",
  "description": "Sync with your preferred calendar application and shows your daily agenda.",
  "active": false,
  "filename": "calendar.zip"
}' && echo

# Update, should not be successful
curl -X PUT --cookie jarfile 'http://localhost:8000/widgets/5e08e7d2d8c9b1285e8ebd3e' \
-H "Content-Type: application/json" \
-d '{
  "name": "Clock",
  "description": "An updated description",
  "active": false
}' && echo

#curl -X DELETE 'http://localhost:8000/widgets/5e06c542b9593c81c8f6bf22' && echo
rm widget.zip
