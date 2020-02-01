from flask import Flask, request
from flask_restplus import Api, Resource, reqparse
import integrations
import analysis
from datetime import datetime
from flask_cors import CORS
from twilio.rest import Client
import os

flask_app = Flask(__name__)
app = Api(app=flask_app)

# enable CORS
CORS(flask_app, resources={r'/*': {'origins': '*'}})

TWILIO_AUTH = os.environ.get('TWILIO_AUTH')
TWILIO_SID = os.environ.get('TWILIO_SID')
TEST_NUMBER = os.environ.get('TEST_NUMBER')

name_space = app.namespace('api', description='CEL APIs')


@name_space.route("/")
class MainClass(Resource):
    def get(self):
        return {"status": "active"}, 200


@name_space.route("/usage")
@name_space.doc(params={'date': 'Date in YYYY-MM-DD format'})
class UsageClass(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('date', required=True, help='must provide date')
        args = parser.parse_args()
        energy_dict = integrations.get_solaredge_usage(args.date)
        return {"data": energy_dict}, 200


@name_space.route("/supply")
@name_space.doc(
    params={'date': 'Date in YYYY-MM-DD format', 'renewable_type': 'Wind or Solar. Will sum sources if None'})
class SupplyClass(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('date', required=True, help='must provide date')
        parser.add_argument('renewable_type', help='Wind or Solar')
        args = parser.parse_args()
        caiso_dict = integrations.get_caiso_day_ahead(args.date, renewable_type=args.renewable_type)
        return {"data": caiso_dict}, 200


@name_space.route("/household_consumers")
@name_space.doc(
    params={'consumers': 'dictionary with household energy consumers and true/false for'
                         ' items in [laundry, pool, electric heater, electric vehicle]'})
class OptionsClass(Resource):
    def post(self):
        data = request.get_json()
        for key in list(analysis.CONSUMERS.keys()):
            if key in list(data.keys()):
                analysis.CONSUMERS[key] = data[key]
        return {'data': analysis.CONSUMERS}, 200


@name_space.route("/suggestions")
class SuggestionsClass(Resource):
    @name_space.doc(params={'date': 'Date in YYYY-MM-DD format'},
                    responses={"data": "array of {time: suggestion} for given user"})
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('date', help='must provide start date')
        args = parser.parse_args()
        date = args.date
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')

        caiso_dict = integrations.get_caiso_day_ahead(date)
        suggestions = analysis.get_suggestions(caiso_dict)

        return {"data": suggestions}, 200

    @name_space.doc(params={'message': 'text message of notification to send'})
    def post(self):
        message = request.get_json()['message']
        client = Client(TWILIO_SID, TWILIO_AUTH)

        text_message = client.messages.create(
            body=message,
            from_='+19566836041',
            to=TEST_NUMBER
        )
        return {"data": {"twilio_id": text_message.sid, "message": message}}, 200

