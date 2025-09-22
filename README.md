# UV Index Map Viewer

This project provides a simple interactive map interface for checking the UV index of any location. Users can either click directly on the map to select a point or enter latitude and longitude coordinates manually. The application fetches real-time UV and sun position data from the OpenUV API, with a small Flask backend proxy handling API requests securely instead of calling the OpenUV API directly from the frontend.

## Setup Instructions
### Clone the Repository
git clone https://github.com/Bucibo/uv-map-app.git

cd uv-map-app


### Install Frontend (React) Dependencies 

npm install


### Install Backend (Flask) Dependencies

cd server

pip install -r requirements.txt


### Configure Environment Variables

Create a .env file inside the server folder:

OPENUV_API_KEY=your_api_key_here

PORT=5000


You can get your API key from https://www.openuv.io/


### Run the Server

cd server

python app.py


### Run the Frontend

In a separate terminal:

cd uv-map-app

npm start


The React app will be available at http://localhost:3000 and will communicate with the Flask backend at http://localhost:5000


## Features


### Interactive Map (Leaflet + React Leaflet)

Click anywhere on the map to instantly fetch UV index data.


### Coordinate Search Form

Enter latitude and longitude manually if you already know the location.


### Real-time UV Data

Displays current UV index, maximum UV for the day, ozone levels, and sun position/times.


### Backend API Proxy

Flask securely fetches data from OpenUV, keeping the API key hidden.


## Design Decisions

This project was designed with simplicity and user experience in mind, making sure that it serves it's purpose while also giving the user a simple experience. The frontend provides two intuitive ways of selecting a location: direct map interaction with the help of Leaflet.js and manual coordinate entry. To ensure security, the API key is never exposed in the frontend; instead, the Flask backend acts as a proxy to the OpenUV API. React Leaflet was chosen for its lightweight integration with Leaflet.js and ease of handling map events, while Flask was selected for its minimal setup and flexibility as a backend service. The architecture cleanly separates responsibilities: React handles the user interface, while Flask manages API communication.
