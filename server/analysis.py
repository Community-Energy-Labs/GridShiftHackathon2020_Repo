from datetime import datetime
from datetime import timedelta
import pandas as pd

# Mocking out a db/storage scheme. We would ideally store these types of options per-user
CONSUMERS = {"electric_water_heater": False, "dishwasher": True, "electric_vehicle": True, "washer_dryer": True, "solar": True}
SOURCES = {
    "smart meter": False,
    "home_energy_monitor": False
}


def readable_time(time):
    time = pd.to_datetime(time)
    return time.strftime("%I:%M %p")


def get_max_renewable_time(caiso_dict):
    df = pd.DataFrame(caiso_dict)
    df['time'] = df.time.apply(lambda x: datetime.strptime(x, "%H:%M:%S"))
    max_renewable = df[df['value'] > df.value.quantile(.75)].iloc[0]['time']
    return max_renewable


def get_suggestions(caiso_dict):
    suggestions = []
    max_renewable_time = get_max_renewable_time(caiso_dict)
    if CONSUMERS['electric_vehicle']:
        t_end = pd.to_datetime(max_renewable_time) + timedelta(hours=3)
        suggestions.append((readable_time(max_renewable_time),
                            "Set your electric car to charge between {} and {} tomorow".format(
                                readable_time(max_renewable_time), readable_time(t_end))))
    if CONSUMERS['dishwasher']:
        suggestions.append((readable_time(max_renewable_time),
                            "Load your dishwasher tonight and set it to run after {} tomorrow".format(
                                readable_time(max_renewable_time))))
    if CONSUMERS['washer_dryer']:
        t = pd.to_datetime(max_renewable_time) + timedelta(hours=1)
        suggestions.append((readable_time(max_renewable_time),
                            "Load your dishwasher tonight and set it to run after {} tomorrow".format(
                                readable_time(t))))
    if CONSUMERS['solar']:
        t = pd.to_datetime(max_renewable_time) + timedelta(hours=7.5)
        t_end = pd.to_datetime(max_renewable_time) + timedelta(hours=10.5)

        suggestions.append((readable_time(t), "Pre-cool. Close drapes & windows. Program AC to run on max until {}. "
                                              "Then allow the temp to stay at 78 until {}".format(readable_time(t), readable_time(t_end))))

    return suggestions
