# Bayt Jobs Backend

This Node.js Express application fetches job data from the Bayt client RSS feed, parses it, geocodes the country to latitude and longitude, and exposes the data through an API endpoint.

The backend is deployed and accessible at [https://bayt-service.onrender.com](https://bayt-service.onrender.com).

## Technologies Used

- Node.js
- Express
- Geocoding API (e.g., Google Maps Geocoding)

## Running the Backend Locally
This project requires you to set up environment variables for configuration. To do this, create a file called `.env` in the root directory of this project and add the following variables, as mentioned in the email:
## Environment Variables

This project requires you to set up environment variables for configuration. To do this, create a file called `.env` in the root directory of this project and add the following variables, as mentioned in the email:

```env
# Example .env file
GOOGLE_MAPS_API_KEY=<key from the email>
```

1-Clone the repository:
   ```bash
   git clone <repository-url>
   cd bayt-jobs-backend
  ```
2-Install dependencies:
   ```bash
   npm install
  ```
3-Run the app:
   ```bash
   node index.js
   ```
 The API will be available at http://localhost:3000/api/jobs.

API Endpoint:

GET /api/jobs: Retrieve a list of Bayt job data with titles and geocoded locations.

-Demo Video
[Add a link to your demo video here.]


