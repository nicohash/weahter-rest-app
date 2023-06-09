# Weather Rest App

A simple REST web-app build with React and Flask.

React was used to build a beautiful and functional weather web-app, while Flask handles the API operations for us.

Our project is designed to run locally in order to function as intended. However we have created a live server implementation for the React frontend without the API from Flask.
It can be accessed at https://weathersunrise.de.cool/.

We could not include the API at server level because we would have needed a paid subscription from our provider for this.

Our frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

```zsh
git clone https://github.com/nicohash/weather-rest-app.git ~/weather-rest-app
cd ~/weather-rest-app
```

## Usage

1. Create a free account at https://openweathermap.org/ and obtain an API key.
2. Add your API key to frontend/src/secrets-mock.json. To edit the file:
``` zsh
nano frontend/src/secrets-mock.json
```
3. Rename secrets-mock.json to secrets.json
```zsh
mv secrets-mock.json secrets.json
```
4. Run the app
```zsh
python -m flask run
```

### Hints

The React frontend can also be used without the API. More info on this [here](frontend/README.md).

## APIs used in this project

- [Open Weather Map](https://openweathermap.org/current)
- [Sunset and Sunrise](https://sunrise-sunset.org/api)
