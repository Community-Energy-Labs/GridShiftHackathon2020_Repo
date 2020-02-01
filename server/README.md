# To Start Server & Run API

To start server:

1. get the solaredge API key & set as an env var
2. `virtualenv venv`
2. `source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `FLASK_APP=app.py flask run` or `FLASK_ENV=development FLASK_APP=app.py flask run` if you want it in debug mode


API docs at: [http://localhost:5000/](http://localhost:5000/)

Example endpoint: [http://localhost:5000/api/supply?date=2020-01-25](http://localhost:5000/api/supply?date=2020-01-25)
