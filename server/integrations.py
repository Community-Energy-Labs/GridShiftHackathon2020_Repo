from functools import lru_cache
from datetime import datetime
import io
from datetime import timedelta
import pandas as pd
import zipfile
import requests
import os
from pytz import timezone


"""
Integrations date in a date and return a dictionary of stats over a 24 hr period
format  [{"time": "00:00:00","value": 0.0},{"time": "00:15:00","value": 0.2}, ... ]
"""

os.environ['SOLAREDGE_API_KEY'] = 'D5KG4QG40QC6R9QGHFGRYX695UK2W69X'

SOLAREDGE_API_KEY = os.environ.get('SOLAREDGE_API_KEY')
SOLAREDGE_SITE_ID = '581494'


@lru_cache(128)
def get_solaredge_usage(date):
    unit = 'QUARTER_OF_AN_HOUR'
    energy_resp = requests.get(f'https://monitoringapi.solaredge.com/site/{SOLAREDGE_SITE_ID}/energy?timeUnit={unit}&endDate={date}&startDate={date}&api_key={SOLAREDGE_API_KEY}')
    if energy_resp.status_code != 200:
        raise ConnectionError("Got code {} from Solaredge API".format(energy_resp.status_code))
    energy_data = energy_resp.json()['energy']
    energy_df = pd.DataFrame(energy_data['values'])
    # Hacky parsing
    energy_df['time'] = energy_df['date'].apply(lambda x: str(x[11:]))
    energy_dict = energy_df[['time', 'value']].to_dict('records')
    return energy_dict


@lru_cache(128)
def get_caiso_day_ahead(date, renewable_type=None):
    # CAISO requests are in GMT- need to convert to/from timezones
    start_time = datetime.strptime(date, '%Y-%m-%d')
    start_time_gmt = start_time.astimezone(timezone('GMT'))
    end_time_gmt = start_time_gmt + timedelta(days=1)
    end_time_gmt = end_time_gmt.strftime("%Y%m%dT%H:%M-") + '0000'
    start_time_gmt = start_time_gmt.strftime("%Y%m%dT%H:%M-") + '0000'

    caiso_req = f"http://oasis.caiso.com/oasisapi/SingleZip?queryname=SLD_REN_FCST&market_run_id=RTPD&startdatetime={start_time_gmt}&enddatetime={end_time_gmt}&resultformat=6&version=1"
    print(caiso_req)

    # handle the zip file
    caiso_resp = requests.get(caiso_req, stream=True)
    z = zipfile.ZipFile(io.BytesIO(caiso_resp.content))

    caiso_df = pd.read_csv(z.open(z.namelist()[0]))
    caiso_df.rename(columns={"INTERVALSTARTTIME_GMT": "date",
                             "MW": "value",
                             'RENEWABLE_TYPE': 'renewable_type',
                             'TRADING_HUB': 'trading_hub'}, inplace=True)

    caiso_df['date'] = pd.to_datetime(caiso_df.date).apply(lambda x: x.astimezone(timezone('US/Pacific')))

    caiso_df = caiso_df[caiso_df.trading_hub == 'SP15']

    if renewable_type is not None:
        if renewable_type not in ['Solar', 'Wind']:
            raise NotImplementedError("type must be Solar or Wind")
        caiso_df = caiso_df[caiso_df['renewable_type'] == renewable_type]
    else:
        # otherwise, sum renewables for all types
        caiso_df = caiso_df.sort_values('date').groupby(['date']).sum().reset_index()
    caiso_df['time'] = caiso_df.date.apply(lambda x: x.strftime('%H:%M:%S'))
    caiso_dict = caiso_df[['time', 'value']].to_dict('records')
    return caiso_dict


