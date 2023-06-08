from flask import Flask, send_from_directory, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS 
import json
import requests
import numpy as np

secret_key = 'Please enter your API key here'
cities = []

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app) 
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

@app.route('/city/', methods=['GET'])
def request_data():
    try:
        userquery = str(request.args.get('city'))

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
        return json_data
    except:
        return 'Wrong entry!'

@app.route('/cities/', methods=['GET'])
def request_cities():
        global cities
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
           return cities_list
        else:
           return 'No cities saved!'

@app.route('/citypost/', methods=['GET','POST'])
def add_city():
    global cities
    try:
        userquery = str(request.args.get('city'))

        if cities:
            for city in cities:
                if userquery in city:
                    return userquery + ' is already in the list!'
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
        cities.append(json_postdata)

        return name+' got successfully saved!'
    except:
        return 'Wrong entry!'

@app.route('/citydelete/', methods=['GET','DELETE'])
def delete_city():
    global cities
    try:
        userquery = str(request.args.get('city'))

        response = requests.get('https://api.openweathermap.org/data/2.5/weather?q='+userquery+'&appid='+secret_key+'&units=metric')
        name = response.json()['name']

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
        return 'Wrong entry!'