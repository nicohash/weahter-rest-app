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
mv frontend/src/secrets-mock.json frontend/src/secrets.json
```
4. Run the app
```zsh
python -m flask run
```

### Hints

If you get errors due to missing dependencies just run the following command while in the projects root directory:
``` zsh
pip install -r requirements.txt

```

The React frontend can also be used without the API. More info on this [here](frontend/README.md).

## Documentation

We have documented the frontend via [JSDoc](https://jsdoc.app/index.html).
All docs can be found [here](https://weathersunrise-docs.de.cool/index.html).

The documentation for out API was done with [SwaggerUI](https://swagger.io/tools/swagger-ui/).
All API-docs can be accessed at http://localhost:5000/swagger/ after the flask app is started.

## APIs used in this project

- [Open Weather Map](https://openweathermap.org/current)
- [Sunset and Sunrise](https://sunrise-sunset.org/api)

## Credits

Icons made by iconixar, heisenberg_jr and Freepik from www.flaticon.com
