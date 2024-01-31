CREATE TABLE `hasil_prediksi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `forecast_datetime` datetime DEFAULT NULL,
  `co_forecast` float DEFAULT NULL,
  `o3_forecast` float DEFAULT NULL,
  `pm1_forecast` float DEFAULT NULL,
  `pm25_forecast` float DEFAULT NULL,
  `pm10_forecast` float DEFAULT NULL,
  `no2_forecast` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2275 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
