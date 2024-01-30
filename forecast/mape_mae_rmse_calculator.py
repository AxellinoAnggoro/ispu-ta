import numpy as np

# Data hasil pengukuran sensor untuk gas PM10
pm10_measurements = [
    45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534,
    45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534,
    45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534, 45.1534
]

# Nilai konstan dari alat kalibrator untuk PM10
calibrator_pm10_value = 40

# Menghitung Mean Absolute Error (MAE)
mae_pm10 = np.mean([abs(x - calibrator_pm10_value) for x in pm10_measurements])

# Menghitung Root Mean Square Error (RMSE)
rmse_pm10 = np.sqrt(np.mean([(x - calibrator_pm10_value) ** 2 for x in pm10_measurements]))

# Menghitung Mean Absolute Percentage Error (MAPE)
mape_pm10 = np.mean([abs((x - calibrator_pm10_value) / x) for x in pm10_measurements]) * 100

# Menampilkan hasil
print("MAE (PM10):", mae_pm10)
print("RMSE (PM10):", rmse_pm10)
print("MAPE (PM10):", mape_pm10)
