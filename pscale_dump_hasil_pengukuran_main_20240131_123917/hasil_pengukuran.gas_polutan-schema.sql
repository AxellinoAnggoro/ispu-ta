CREATE TABLE `gas_polutan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `temp` float DEFAULT NULL,
  `hum` float DEFAULT NULL,
  `pre` float DEFAULT NULL,
  `co` float DEFAULT NULL,
  `pm2_5` float DEFAULT NULL,
  `no2` float DEFAULT NULL,
  `pm1` float DEFAULT NULL,
  `o3` float DEFAULT NULL,
  `pm10` float DEFAULT NULL,
  `aqi` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18702 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
