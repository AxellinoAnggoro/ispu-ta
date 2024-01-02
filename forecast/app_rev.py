import MySQLdb
from sqlalchemy import create_engine
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime, timedelta
load_dotenv()
import os
import xgboost as xgb

db_connection_str = os.getenv("DATABASE_URL")
db_engine  = create_engine(db_connection_str)


# db_connection = MySQLdb.connect(
#     host= os.getenv("DB_HOST"),
#     user=os.getenv("DB_USERNAME"),
#     passwd= os.getenv("DB_PASSWORD"),
#     db= os.getenv("DB_NAME"),
#     autocommit = True,
#     ssl_mode = "VERIFY_IDENTITY",
#     ssl      = {
#         "ca": "/etc/ssl/certs/ca-certificates.crt"
#     }
# )

db_connection = MySQLdb.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    autocommit = True,
    ssl_mode = "VERIFY_IDENTITY",
)

cursor = db_connection.cursor()
# Menjalankan query untuk menguji koneksi
cursor.execute("select @@version")
version = cursor.fetchone()
if version:
    print('Running version: ', version)
else:
    print('Not connected.')


now = datetime.now()
start_of_hour = now.replace(minute=0, second=0, microsecond=0)
end_of_hour = start_of_hour + timedelta(hours=1)

start_of_hour_str = start_of_hour.strftime('%Y-%m-%d %H:%M:%S')
end_of_hour_str = end_of_hour.strftime('%Y-%m-%d %H:%M:%S')

# query = f"SELECT * FROM gas_polutan WHERE timestamp >= '{start_of_hour_str}' AND timestamp < '{end_of_hour_str}'"
# train = pd.read_sql(query, con=db_engine)

query = "SELECT * FROM gas_polutan WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL 1 HOUR"
train = pd.read_sql(query, con=db_engine)

train.set_index('timestamp', inplace=True)
train = train.resample('10T').last()

def create_feature(df, column):
    for lag in range(1, 4):
        df[f'lag_{lag}'] = df[column].shift(lag)
    df[f'{column}_rolling_mean'] = df[column].rolling(window=3).mean().shift(1)
    df[f'{column}_rolling_std'] = df[column].rolling(window=3).std().shift(1)

    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['year'] = df.index.year
    df['minute'] = df.index.minute
    df['dayofyear'] = df.index.dayofyear
    df['dayofmonth'] = df.index.day

train_co = train[['co']]
train_pm1 = train[['pm1']]
train_pm25 = train[['pm2_5']]
train_pm10 = train[['pm10']]
train_no2 = train[['no2']]
train_o3 = train[['o3']]

create_feature(train_co, 'co')
create_feature(train_pm25, 'pm2_5')
create_feature(train_no2, 'no2')
create_feature(train_pm1, 'pm1')
create_feature(train_o3, 'o3')
create_feature(train_pm10, 'pm10')

train_co.dropna(inplace=True)
train_pm1.dropna(inplace=True)
train_pm25.dropna(inplace=True)
train_pm10.dropna(inplace=True)
train_no2.dropna(inplace=True)
train_o3.dropna(inplace=True)

def forecast_polutant(model, train_data, polutant_name):
    X_train = train_data.drop(columns=[polutant_name])
    y_train = train_data[polutant_name]

    model.fit(X_train, y_train)

    results = []
    for i in range(6):
        last_row = train_data.iloc[-1]
        new_timestamp = last_row.name + pd.Timedelta(minutes=10)
        new_row = pd.DataFrame(columns=train_data.columns, index=[new_timestamp])

        # Using pd.concat instead of append
        train_data = pd.concat([train_data, new_row])

        create_feature(train_data, polutant_name)
        data_to_predict = train_data.iloc[-1].values[1:].reshape(1, -1)
        prediction = model.predict(data_to_predict)
        results.append((new_timestamp, prediction[0]))
        train_data.at[new_timestamp, polutant_name] = prediction[0]

    return results


# Forecasting
model_co = xgb.XGBRegressor()
result_co = forecast_polutant(model_co, train_co, 'co')
print(result_co)
print('\n')

model_no2 = xgb.XGBRegressor()
result_no2 = forecast_polutant(model_no2, train_no2, 'no2')
print(result_no2)
print('\n')

model_o3 = xgb.XGBRegressor()
result_o3 = forecast_polutant(model_o3, train_o3, 'o3')
print(result_o3)
print('\n')

model_pm1 = xgb.XGBRegressor()
result_pm1 = forecast_polutant(model_pm1, train_pm1, 'pm1')
print(result_pm1)
print('\n')

model_pm2_5 = xgb.XGBRegressor()
result_pm2_5 = forecast_polutant(model_pm2_5, train_pm25, 'pm2_5')
print(result_pm2_5)
print('\n')

model_pm10 = xgb.XGBRegressor()
result_pm10 = forecast_polutant(model_pm10, train_pm10, 'pm10')
print(result_pm10)
print(train_pm10.tail())
print('\n')


def prepare_insert_data(result_list):
    data_for_insertion = []
    for timestamp, value in result_list:
        data_for_insertion.append((timestamp, value))
    return data_for_insertion

data_co = prepare_insert_data(result_co)
data_no2 = prepare_insert_data(result_no2)
data_o3 = prepare_insert_data(result_o3)
data_pm1 = prepare_insert_data(result_pm1)
data_pm2_5 = prepare_insert_data(result_pm2_5)
data_pm10 = prepare_insert_data(result_pm10)

combined_data = []
for i in range(len(data_co)):
    combined_data.append((
        data_co[i][0], # forecast_datetime
        data_co[i][1], # co_forecast
        data_o3[i][1], # o3_forecast
        data_pm1[i][1], # pm1_forecast
        data_pm2_5[i][1], # pm25_forecast
        data_pm10[i][1], # pm10_forecast
        data_no2[i][1], # no2_forecast
    ))

insert_query = '''
    INSERT INTO hasil_prediksi
    (forecast_datetime, co_forecast, o3_forecast, pm1_forecast, pm25_forecast, pm10_forecast, no2_forecast)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
'''
cursor.executemany(insert_query, combined_data)
db_connection.commit()

print("Data insertion completed.")

cursor.close()
db_connection.close()