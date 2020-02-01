from functools import lru_cache
from datetime import datetime
import io
from datetime import timedelta
import pandas as pd
import zipfile
import requests
import os


"""
Integrations date in a date and return a dictionary of stats over a 24 hr period
format  [{"time": "00:00:00","value": 0.0},{"time": "00:15:00","value": 0.2}, ... ]
"""

SOLAREDGE_API_KEY = os.environ.get('SOLAREDGE_API_KEY')
SOLAREDGE_SITE_ID = '581494'


@lru_cache(128)
def get_solaredge_usage(date):
    end_date = datetime.strptime(date, '%Y-%m-%d') + timedelta(days=1)
    end_date = end_date.strftime('%Y-%m-%d')
    unit = 'QUARTER_OF_AN_HOUR'
    energy_resp = requests.get(
        f'https://monitoringapi.solaredge.com/site/{SOLAREDGE_SITE_ID}/energy?timeUnit={unit}&endDate={end_date}&startDate={date}&api_key={SOLAREDGE_API_KEY}')
    energy_data = energy_resp.json()['energy']
    energy_df = pd.DataFrame(energy_data['values'])

    # Hacky parsing
    energy_df['time'] = energy_df['date'].apply(lambda x: str(x[11:]))
    energy_dict = energy_df[['time', 'value']].to_dict('records')
    return energy_dict


@lru_cache(128)
def get_caiso_day_ahead(date, renewable_type=None):
    start_time = datetime.strptime(date, '%Y-%m-%d').strftime("%Y%m%dT%H:%M-") + '0000'
    end_time = datetime.strptime(date, '%Y-%m-%d') + timedelta(days=1)
    end_time = end_time.strftime("%Y%m%dT%H:%M-") + '0000'
    caiso_req = f"http://oasis.caiso.com/oasisapi/SingleZip?queryname=SLD_REN_FCST&market_run_id=RTPD&startdatetime={start_time}&enddatetime={end_time}&resultformat=6&version=1"

    # handle the zip file
    caiso_resp = requests.get(caiso_req, stream=True)
    z = zipfile.ZipFile(io.BytesIO(caiso_resp.content))

    caiso_df = pd.read_csv(z.open(z.namelist()[0]))
    caiso_df.rename(columns={"INTERVALSTARTTIME_GMT": "date",
                             "MW": "value",
                             'RENEWABLE_TYPE': 'renewable_type',
                             'TRADING_HUB': 'trading_hub'}, inplace=True)

    caiso_df = caiso_df[caiso_df.trading_hub == 'SP15']
    if renewable_type is not None:
        if renewable_type not in ['Solar', 'Wind']:
            raise NotImplementedError("type must be Solar or Wind")
        caiso_df = caiso_df[caiso_df['renewable_type'] == renewable_type]
    else:
        # otherwise, sum renewables
        caiso_df = caiso_df.sort_values('date').groupby(['date']).sum().reset_index()
    caiso_df['time'] = caiso_df['date'].apply(lambda x: str(x[11:-6]))
    caiso_dict = caiso_df[['time', 'value']].to_dict('records')
    return caiso_dict


