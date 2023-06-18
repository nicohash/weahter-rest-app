from flask import Flask, send_from_directory, request
from flask_restful import Api, Resource, reqparse
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
import json
import requests
import numpy as np
import json

def get_keys(path):
    with open(path) as f:
        return json.load(f)

keys = get_keys("frontend/src/secrets.json")
secret_key = keys['openWeatherAPI']
cities = []

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app) 
api = Api(app)

#get the weather App view
@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

#GET-reqeust for user entered city '/city/?city=cityname'
@app.route('/city/', methods=['GET'])
def request_data():
    try:
        userquery = str(request.args.get('city'))
         
        #get data from the two API's
        response = requests.get('https://api.openweathermap.org/data/2.5/weather?q='+userquery+'&appid='+secret_key+'&units=metric')
        lat = response.json()['coord']['lat']
        lon = response.json()['coord']['lon']
        response_sun = requests.get('https://api.sunrise-sunset.org/json?lat='+str(lat)+'&lng='+str(lon)+'}&formatted=0')

        name = response.json()['name']
        description = response.json()['weather'][0]['description']
        feels_like = response.json()['main']['feels_like']
        temp = response.json()['main']['temp']
        humidity = response.json()['main']['humidity']
        wind = response.json()['wind']['speed']
        sunrise = response_sun.json()['results']['sunrise']
        sunset = response_sun.json()['results']['sunset']
        dataset = {'city': {'name' : name, 'description' : description, 'feels_like' : feels_like, 'temp' : temp, 'humidity' : humidity, 'wind' : wind, 'sunrise' : sunrise, 'sunset' : sunset}}
        json_data = json.dumps(dataset)
        #returning JSON
        return json_data
    except:
        #returning wrong entry
        return 'Wrong entry!'

#GET-reqeust for saved list '/cities/'
@app.route('/cities/', methods=['GET'])
def request_cities():
        global cities
        #creating JSON out of the cities in list
        if cities:
           cities_list = '{"city":['
           counter = 1
           for city in cities:
               if counter < len(cities):
                    cities_list += city + ','
                    counter += 1
               else:
                    cities_list += city
           cities_list += ']}'
           #returning the JSON
           return cities_list
        else:
           #returning No citites saved as list is empty
           return 'No cities saved!'

#POST-reqeust for user entered city to add in saving list '/citypost/?city=cityname'
@app.route('/citypost/', methods=['GET','POST'])
def add_city():
    global cities
    try:
        userquery = str(request.args.get('city'))

        #check if city already in list
        if cities:
            for city in cities:
                if userquery in city:
                    return userquery + ' is already in the list!'
        #get data from the two API's
        response = requests.get('https://api.openweathermap.org/data/2.5/weather?q='+userquery+'&appid='+secret_key+'&units=metric')
        lat = response.json()['coord']['lat']
        lon = response.json()['coord']['lon']
        response_sun = requests.get('https://api.sunrise-sunset.org/json?lat='+str(lat)+'&lng='+str(lon)+'}&formatted=0')

        name = response.json()['name']
        description = response.json()['weather'][0]['description']
        feels_like = response.json()['main']['feels_like']
        temp = response.json()['main']['temp']
        humidity = response.json()['main']['humidity']
        wind = response.json()['wind']['speed']
        sunrise = response_sun.json()['results']['sunrise']
        sunset = response_sun.json()['results']['sunset']
        postdataset = {'name' : name, 'description' : description, 'feels_like' : feels_like, 'temp' : temp, 'humidity' : humidity, 'wind' : wind, 'sunrise' : sunrise, 'sunset' : sunset}
        json_postdata = json.dumps(postdataset)
        #add new city data to the list
        cities.append(json_postdata)
        
        #retun the successful update
        return name+' got successfully saved!'
    except:
        #return wrong entry
        return 'Wrong entry!'

#DELETE-reqeust for user entered city to delete in saving list '/citydelete/?city=cityname'
@app.route('/citydelete/', methods=['GET','DELETE'])
def delete_city():
    global cities
    try:
        #get name of the entered city from openweatherAPI
        userquery = str(request.args.get('city'))

        response = requests.get('https://api.openweathermap.org/data/2.5/weather?q='+userquery+'&appid='+secret_key+'&units=metric')
        name = response.json()['name']

        #search for that city in the list and returning the state
        counter = 0
        deleted = 0
        if cities:
            for city in cities:
                if name in city:
                    cities.pop(counter)
                    deleted += 1
                else:
                    counter += 1
            if deleted > 0:
                return 'Deleted successfully '+ str(deleted) + ' entries!'
            else:
                return 'No entry for '+ name +' is saved!'
        else:
            return 'No cities saved!'
    except:
        #return wrong entry
        return 'Wrong entry!'

# Configure Swagger UI
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Weather Sunrise API"
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

'''
@app.route('/swagger.json')
def swagger():
    with open('swagger.json', 'r') as f:
        return jsonify(json.load(f))
'''