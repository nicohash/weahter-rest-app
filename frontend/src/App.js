import React, { useState, useEffect, useCallback } from "react";
import { Oval } from  'react-loader-spinner'
import CityInputForm from "./components/CityInputForm";
import sun from './images/sun.png';
import cloud from './images/cloud.png';
import github from './images/github.png';
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
      const sunData = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${weatherData.coord.lat}&lng=${weatherData.coord.lon}&formatted=0`
      ).then((response) => response.json());

      const currentDate = new Date();

      function convertTZ(date) {
        const rawDate = new Date(typeof date === "string" ? new Date(date) : date);

        const localTZOffsetSeconds = rawDate.getTimezoneOffset() * 60;
        const cityTZOffsetSeconds = weatherData.timezone;
        const totalOffsetMilliseconds = (cityTZOffsetSeconds + localTZOffsetSeconds) * 1000;

        const rawDateTZ = rawDate.getTime() + totalOffsetMilliseconds;

        return new Date(rawDateTZ);
      }

      function format(date) {
        return date.toLocaleString("en-GB", {
          hour: "numeric",
          minute: "numeric",
          weekday: "long",
          month: "long",
          day: "numeric",
        });
      }

      function formatHM(date) {
        return date.toLocaleString("en-GB", {
          hour: "numeric",
          minute: "numeric",
        });
      }

      function setWeatherIcon() {
        if (weatherData.weather[0].main === "Clear") {
          return sun;
        }

        return cloud;
      }

      const transformedData = [
        {
          name: weatherData.name,
          currentTime: format(convertTZ(currentDate)),
          icon: setWeatherIcon(),
          description: weatherData.weather[0].main,
          feels_like: Math.trunc(weatherData.main.feels_like),
          temp: Math.trunc(weatherData.main.temp),
          humidity: Math.trunc(weatherData.main.humidity),
          wind: Math.trunc(weatherData.wind.speed * 3,6),
          sunrise: formatHM(convertTZ(sunData.results.sunrise)),
          sunset: formatHM(convertTZ(sunData.results.sunset))
        },
      ];

      setData(transformedData);

      if (!weatherData.ok || !sunData.ok) {
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
    content = (
      <div className="card-inner-loading">
        <Oval
          height={80}
          width={80}
          color="#1c1c1c"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#888888"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    )
  }

  if (data.length > 0) {
    content = (
      <section className="card-inner">
        <div className="widget">
          <div className="cityTitle">{data[0].name}</div>
          <div className="currentTime">{data[0].currentTime}</div>
          <div className="currentWeather">
          <img src={data[0].icon} alt="Weather Icon"/>
            <div className="temp-wrapper">
              <div className="temp-big">
                {data[0].temp}
              </div>
              <div className="sup">
                <div className="deg">&deg;C</div>
              </div>
            </div>
          </div>
          <div className="textWeather">{data[0].description}</div>
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
              {data[0].wind} km/h
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

  return (
    <div className="App">
      <section className="top-bar">
        <CityInputForm onSubmitHandler={addCityHandler} />
      </section>
      <div className="cards">
        <section className="card">
          {content}
        </section>
      </div>
      <div className="footer">
        <a href="https://github.com/nicohash/weahter-rest-app" target="_blank" rel="noopener noreferrer"><img src={github} alt="Github"/></a>
      </div>
    </div>
  );
}

export default App;