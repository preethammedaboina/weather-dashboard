Weather Dashboard

A responsive weather dashboard built with **Next.js** and **React** that allows users to track weather information for multiple cities. The application uses the **OpenWeatherMap API** to fetch real-time weather data and provides an engaging UI with dynamic backgrounds based on weather conditions.

## Features

- **Add and Remove Cities**: Easily add cities to the dashboard and remove them when needed.
- **Persisted Data**: Cities added to the dashboard are saved across sessions.
- **Temperature Toggle**: Switch between Celsius and Fahrenheit with a simple toggle.
- **Weather Information Display**:
  - Current temperature, weather condition, humidity, and wind speed.
  - 5-day weather forecast with average temperatures.
- **Dynamic Backgrounds**: Background colors adjust based on the weather condition for each city.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Setup Instructions

Follow these steps to set up and run the Weather Dashboard locally:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/weather-dashboard.git
    ```
   
2. **Navigate to the project directory**:
    ```bash
    cd weather-dashboard
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Configure Environment Variables**:
   - Create a `.env.local` file in the root of the project.
   - Add your **OpenWeatherMap API key** in the `.env.local` file:
     ```plaintext
     NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
     ```

5. **Run the development server**:
    ```bash
    npm run dev
    ```

6. **Open the app**:
   - The app will be running on `http://localhost:3000`. Open it in your browser.

## Usage

1. **Adding a City**:
   - Enter the city name in the input field and click “Add City.”
   
2. **Removing a City**:
   - Each city card has a "Remove" button that allows you to delete the city from the dashboard.
   
3. **Toggle Temperature Unit**:
   - Click on "Show in Fahrenheit" or "Show in Celsius" to toggle the temperature display units.

4. **Clear All Cities**:
   - Click the “Clear All Cities” button to remove all cities from the dashboard.

## Assumptions and Trade-Offs

- **Assumptions**:
  - The weather data is fetched only once upon adding a city and auto-refreshes every 5 minutes.
  - City names are case-insensitive.
  
- **Trade-Offs**:
  - Due to rate limits of the free OpenWeatherMap API, the app minimizes unnecessary API calls by caching data in local storage.
  - Real-time updates are limited to every 5 minutes to avoid excessive API usage.

## Future Improvements

If I had more time, I would consider adding:
- **Search Autocomplete**: Implementing city name autocomplete to assist users in finding cities more efficiently.
- **Animations and Effects**: Adding subtle weather animations for rain, snow, or sunshine to enhance visual appeal.
- **Additional Weather Data**: Displaying more detailed weather information, such as UV index or precipitation probability.
- **Enhanced Error Handling**: Improving error feedback for users, especially when cities are not found.

## Known Issues

- **Hydration Warnings**: Occasionally, Next.js hydration warnings may appear due to server-client rendering differences in dynamic data. This is mitigated by client-only rendering but may need further adjustment.

## Demo Video

- [Link to Demo Video](https://drive.google.com/file/d/1rY1b7n8pqkIS_K_jAAHhwG5ugsE1bo4-/view?usp=sharing) – A brief screen-recorded video demonstrating key features.

## Deployment

The application is deployed on [Vercel](https://weather-dashboard-tan-one.vercel.app/) for easy access and testing.
