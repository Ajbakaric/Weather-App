import './styles.css';
import axios from 'axios';

const visualCrossingApiKey = 'AJUJEAEGU57QQQVN9M8TBHEV4'; // Replace with your actual key
const weatherApiKey = '7c566255520644928cc182823240309'; // Replace with your actual key
const visualCrossingUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline`;

const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weatherIcon');
const toggleUnitButton = document.getElementById('toggleUnit');
const searchForm = document.getElementById('searchForm');
const locationInput = document.getElementById('locationInput');
const defaultCities = document.querySelectorAll('.city');


const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const pressureElement = document.getElementById('pressure');

let isCelsius = true;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Salt Lake City, UT');
    startClock();  // Start the clock when the page loads
});

toggleUnitButton.addEventListener('click', () => {
    isCelsius = !isCelsius;
    fetchWeather(locationElement.textContent);
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

defaultCities.forEach(city => {
    city.addEventListener('click', (event) => {
        const location = event.target.getAttribute('data-city');
        fetchWeather(location);
    });
});

function fetchWeather(location) {
    const unitGroup = isCelsius ? 'metric' : 'us';
    const encodedLocation = encodeURIComponent(location);
    const visualCrossingUrlComplete = `${visualCrossingUrl}/${encodedLocation}?unitGroup=${unitGroup}&key=${visualCrossingApiKey}&include=days&contentType=json`;

    console.log('Visual Crossing URL:', visualCrossingUrlComplete); // Log the Visual Crossing URL

    axios.get(visualCrossingUrlComplete)
        .then(response => {
            updateWeather(response.data);
            fetchWeatherApiIcon(location); // Fetch the WeatherAPI icon and time after fetching the data
        })
        .catch(error => {
            console.error('Error fetching Visual Crossing data:', error); // Log the error
            alert('Error fetching weather data. Please try again.');
        });
}

function fetchWeatherApiIcon(location) {
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`;

    console.log('WeatherAPI URL:', weatherApiUrl); // Log the WeatherAPI URL

    axios.get(weatherApiUrl)
        .then(response => {
            const iconUrl = response.data.current.condition.icon;
            weatherIconElement.src = `https:${iconUrl}`; // Set the icon

            const localTime = response.data.location.localtime;
            updateDateTime(localTime);  // Update the date and time based on the location's local time
        })
        .catch(error => {
            console.error('Error fetching WeatherAPI icon:', error);
        });
}

function updateWeather(data) {
    const todayWeather = data.days[0];
    locationElement.textContent = `${data.resolvedAddress}`;
    temperatureElement.textContent = `${todayWeather.temp}°${isCelsius ? 'C' : 'F'}`;
    descriptionElement.textContent = todayWeather.conditions;

    
    humidityElement.textContent = `Humidity: ${todayWeather.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${todayWeather.windspeed} km/h`;
    pressureElement.textContent = `Pressure: ${todayWeather.pressure} hPa`;
}

function updateDateTime(localTime) {
    const [datePart, timePart] = localTime.split(' ');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(datePart).toLocaleDateString(undefined, options);
    const formattedTime = timePart; // Use the time part directly

    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');

    currentDateElement.textContent = `Date: ${formattedDate}`;
    currentTimeElement.textContent = `Time: ${formattedTime}`;
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();
        const currentTimeElement = document.getElementById('currentTime');
        currentTimeElement.textContent = `Time: ${formattedTime}`;
    }, 1000);
}
