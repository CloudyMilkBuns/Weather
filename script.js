// Function to fetch weather data and display results
function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherApiKey = '07b556b807094c2fbd661495a3958042'; // Replace with your actual OpenWeather API key
    const timeZoneApiKey = 'TP8MKAELOH7N'; // Your TimeZoneDB API key
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                // Get the weather icon code and create the icon URL
                const iconCode = data.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

                // Update weather details and display icon with temperature
                document.getElementById("temp").innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="weather-icon"> ${data.main.temp}°C`;
                document.getElementById("humidity").innerHTML = `Humidity - ${data.main.humidity}%`;
                document.getElementById("wind").innerHTML = `Wind - ${data.wind.speed} kmph`;
                document.getElementById("cityName").innerHTML = data.name;
                document.getElementById("description").innerHTML = data.weather[0].description;

                // Format date and display it
                const date = new Date();
                document.getElementById("date").innerHTML = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                // Use latitude and longitude from OpenWeather response to get the timezone
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                const timezoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;

                // Fetch timezone data from TimeZoneDB
                fetch(timezoneUrl)
                    .then(response => response.json())
                    .then(timeData => {
                        if (timeData.status === "OK") {
                            const cityTime = new Date(timeData.formatted);
                            const formattedTime = `${cityTime.getHours().toString().padStart(2, '0')}:${cityTime.getMinutes().toString().padStart(2, '0')}:${cityTime.getSeconds().toString().padStart(2, '0')}`;
                            document.getElementById("time").innerHTML = formattedTime;
                        } else {
                            console.error("Error fetching city time:", timeData.message);
                        }
                    })
                    .catch(error => console.error("Error fetching city time:", error));

                // Hide search container and show weather container
                document.getElementById("searchContainer").style.display = "none";
                document.getElementById("weatherContainer").style.display = "block";

                // Show the Go Back button
                document.getElementById("goBackButton").style.display = "block";
            } else {
                alert("City not found. Please try again.");
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// Function to trigger search on Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}

// Function to go back to the home screen
function goBack() {
    // Reset the weather container and show the search container
    document.getElementById("searchContainer").style.display = "block";
    document.getElementById("weatherContainer").style.display = "none";

    // Hide the Go Back button again
    document.getElementById("goBackButton").style.display = "none";

    // Clear the input field and reset any displayed weather info
    document.getElementById("cityInput").value = "";
    document.getElementById("temp").innerHTML = "";
    document.getElementById("humidity").innerHTML = "";
    document.getElementById("wind").innerHTML = "";
    document.getElementById("cityName").innerHTML = "";
    document.getElementById("date").innerHTML = "";
    document.getElementById("description").innerHTML = "";
    document.getElementById("time").innerHTML = "";
}
