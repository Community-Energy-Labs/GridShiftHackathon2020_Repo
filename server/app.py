from flask import Flask
from flask_restplus import Api, Resource, reqparse
import integrations

flask_app = Flask(__name__)
app = Api(app=flask_app)


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
@name_space.doc(params={'date': 'Date in YYYY-MM-DD format', 'renewable_type': 'Wind or Solar. Will sum sources if None'})
class UsageClass(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('date', required=True, help='must provide date')
        parser.add_argument('renewable_type', help='Wind or Solar')
        args = parser.parse_args()
        caiso_dict = integrations.get_caiso_day_ahead(args.date, renewable_type=args.renewable_type)
        return {"data": caiso_dict}, 200


@name_space.route("acct_num/suggestions")
@name_space.doc(params={'start_date': 'Start date in YYYY-MM-DD format',
                        'end_date': 'End date in YYYY-MM-DD format'})
class UsageClass(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('start_date', required=True, help='must provide start date')
        parser.add_argument('end_date', required=True, help='must provide end date')
        args = parser.parse_args()
        ['Turn your dishwasher off at 7pm', '']

        return {"args": args}, 200



