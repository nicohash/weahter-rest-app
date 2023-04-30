import React, { useState, useEffect, useCallback } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import CityInputForm from "./components/CityInputForm";
import cloud from './images/cloud.png'; // TODO: credit flaticon
import keys from "./secrets.json";
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Frankfurt, Germany");

  const fetchDataHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const weatherData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keys.openWeatherAPI}&units=metric`
      ).then((response) => response.json());
      /*
      const geocodingData = await fetch(
        // TODO: input geocoding API
      ).then((response) => response.json());
      const sunriseData = await fetch(
        // TODO: input sunrise API
      ).then((response) => response.json());
      */

      const c = new Date();
      // Sonntag, 30. April um 17:10
      const currentTime = c.toLocaleString("de-DE", {
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      const transformedData = [
        {
          name: weatherData.name,
          currentTime: currentTime,
          feels_like: Math.trunc(weatherData.main.feels_like),
          temp: Math.trunc(weatherData.main.temp),
          humidity: Math.trunc(weatherData.main.humidity),
          wind: Math.trunc(weatherData.wind.speed),
          sunrise: "No data yet",
          sunset: "No data yet"
        },
      ];

      setData(transformedData);

      // TODO: add checks for sunrise and geocoding APIs
      if (!weatherData.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [city]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);

  const addCityHandler = (city) => {
    setCity(city);
  };

  let content = <p>No weather or sun data available.</p>;

  if (error) {
    content = <p>Error: {error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  // TODO: add sunrise and sunset data as new row bottom-info
  // TODO: check length of locally saved cities list instead of data.length
  if (data.length > 0) {
    content = (
      <section className="main-inner">
        <div className="widget">
          <div className="cityTitle">{data[0].name}</div>
          <div className="currentTime">{data[0].currentTime}</div>
          <div className="currentWeather">
          <img src={cloud} alt="Cloud" />
            <div className="temp-wrapper">
              <div className="temp-big">
                {data[0].temp}
              </div>
              <div className="sup">
                <div className="deg">&deg;C</div>
              </div>
            </div>
          </div>
          <div className="textWeather">Cloudy</div>
          <div className="feelsLike">
            Feels Like {data[0].feels_like} &deg;C
          </div>
          <div className="row bottom-info">
            <div className="col">
              <h4>Humidity</h4>
              {data[0].humidity}%
            </div>
            <div className="col">
              <h4>Wind Speed</h4>
              {data[0].wind} kph
            </div>
          </div>
          <div className="row bottom-info">
            <div className="col">
              <h4>Sunrise</h4>
              {data[0].sunrise}
            </div>
            <div className="col">
              <h4>Sunset</h4>
              {data[0].sunset}
            </div>
          </div>
        </div>
      </section>
    );
  }

// TODO: exchange Github text for Icon)
// TODO: add button to add cities
// TODO: improve this with Container Bootstrap
  return (
    <div className="App">
      <section className="top-bar">
        <CityInputForm onSubmitHandler={addCityHandler} />
      </section>
      <div className="cards">
        <section className="main">
          {content}
        </section>
        <section className="main">
          {content}
        </section>
        <section className="main">
          {content}
        </section>
      </div>
      <a href="https://github.com/nicohash/weahter-rest-app">View on Github</a>
    </div>
  );
}

export default App;
