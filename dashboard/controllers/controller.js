import db from "../query/db.js";
import moment from 'moment'

export async function dashboard(req, res, next) {
  let initialData = await db.get_initial_data();
  const timestampDate = new Date(initialData.timestamp);

  // Convert to Jakarta timezone
  const jakartaTimestamp = new Date(timestampDate);
  jakartaTimestamp.setHours(timestampDate.getHours());

  // Format the timestamp to hh:mm
  const formattedTime = jakartaTimestamp.toLocaleTimeString("en-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Update the timestamp in initialData
  initialData.formattedTimestamp = formattedTime;
  console.log(initialData.timestamp)
  console.log(initialData.formattedTimestamp);
  if (initialData.pm10 >= 0 && initialData.aqi <= 50) {
    initialData.aqi_label = "Healthy";
    initialData.aqi_label_color = "text-healthy";
    initialData.aqi_bg_color = "bg-healthy";
  } else if (initialData.aqi > 50 && initialData.aqi <= 100) {
    initialData.aqi_label = "Moderate";
    initialData.aqi_label_color = "text-moderate";
    initialData.aqi_bg_color = "bg-moderate"
  } else if (initialData.aqi > 100 && initialData.aqi <= 150) {
    initialData.aqi_label = "Unhealthy for Sensitive Groups";
    initialData.aqi_label_color = "text-unhealthy";
    initialData.aqi_bg_color = "bg-unhealthy"
  } else if (initialData.aqi > 150 && initialData.aqi <= 200) {
    initialData.aqi_label = "Unhealthy";
    initialData.aqi_label_color = "text-unhealthy2";
    initialData.aqi_bg_color = "bg-unhealthy2"
  } else if (initialData.aqi > 200 && initialData.aqi <= 300) {
    initialData.aqi_label = "Very Unhealthy";
    initialData.aqi_label_color = "text-veryunhealthy";
    initialData.aqi_bg_color = "bg-veryunhealthy"
  } else if (initialData.aqi > 300 && initialData.aqi <= 500) {
    initialData.aqi_label = "Hazardous";
    initialData.aqi_label_color = "text-hazardous";
    initialData.aqi_bg_color = "bg-hazardous"
  }

  if (initialData.pm10 >= 0 && initialData.pm10 <= 50) {
    initialData.pm10_label_color = "bg-healthy";
  } else if (initialData.pm10 > 50 && initialData.pm10 <= 150) {
    initialData.pm10_label_color = "bg-moderate";
  } else if (initialData.pm10 > 150 && initialData.pm10 <= 350) {
    initialData.pm10_label_color = "bg-unhealthy";
  } else if (initialData.pm10 > 350 && initialData.pm10 <= 420) {
    initialData.pm10_label_color = "bg-unhealthy2";
  } else if (initialData.pm10 > 420 && initialData.pm10 <= 500) {
    initialData.pm10_label_color = "bg-veryunhealthy";
  } else if (initialData.pm10 > 500) {
    initialData.pm10_label_color = "bg-hazardous";
  }

  if (initialData.pm2_5 >= 0 && initialData.pm2_5 <= 15.5) {
    initialData.pm2_5_label_color = "bg-healthy";
  } else if (initialData.pm2_5 > 15.5 && initialData.pm2_5 <= 55.4) {
    initialData.pm2_5_label_color = "bg-moderate";
  } else if (initialData.pm2_5 > 55.4 && initialData.pm2_5 <= 150.4) {
    initialData.pm2_5_label_color = "bg-unhealthy";
  } else if (initialData.pm2_5 > 150.4 && initialData.pm2_5 <= 250.4) {
    initialData.pm2_5_label_color = "bg-unhealthy2";
  } else if (initialData.pm2_5 > 250.4 && initialData.pm2_5 <= 500) {
    initialData.pm2_5_label_color = "bg-veryunhealthy";
  } else if (initialData.pm2_5 > 500) {
    initialData.pm2_5_label_color = "bg-hazardous";
  }

  if (initialData.co >= 0 && initialData.co <= 4000) {
    initialData.co_label_color = "bg-healthy";
  } else if (initialData.co > 4000 && initialData.co <= 8000) {
    initialData.co_label_color = "bg-moderate";
  } else if (initialData.co > 8000 && initialData.co <= 15000) {
    initialData.co_label_color = "bg-unhealthy";
  } else if (initialData.co > 15000 && initialData.co <= 30000) {
    initialData.co_label_color = "bg-unhealthy2";
  } else if (initialData.co > 30000 && initialData.co <= 45000) {
    initialData.co_label_color = "bg-veryunhealthy";
  } else if (initialData.co > 45000) {
    initialData.co_label_color = "bg-hazardous";
  }

  if (initialData.no2 >= 0 && initialData.no2 <= 80) {
    initialData.no2_label_color = "bg-healthy";
  } else if (initialData.no2 > 80 && initialData.no2 <= 200) {
    initialData.no2_label_color = "bg-moderate";
  } else if (initialData.no2 > 200 && initialData.no2 <= 1130) {
    initialData.no2_label_color = "bg-unhealthy";
  } else if (initialData.no2 > 1130 && initialData.no2 <= 2260) {
    initialData.no2_label_color = "bg-unhealthy2";
  } else if (initialData.no2 > 2260 && initialData.no2 <= 3000) {
    initialData.no2_label_color = "bg-veryunhealthy";
  } else if (initialData.no2 > 3000) {
    initialData.no2_label_color = "bg-hazardous";
  }

  if (initialData.o3 >= 0 && initialData.o3 <= 120) {
    initialData.o3_label_color = "bg-healthy";
  } else if (initialData.o3 > 120 && initialData.o3 <= 235) {
    initialData.o3_label_color = "bg-moderate";
  } else if (initialData.o3 > 235 && initialData.o3 <= 400) {
    initialData.o3_label_color = "bg-unhealthy";
  } else if (initialData.o3 > 400 && initialData.o3 <= 800) {
    initialData.o3_label_color = "bg-unhealthy2";
  } else if (initialData.o3 > 800 && initialData.o3 <= 1000) {
    initialData.o3_label_color = "bg-veryunhealthy";
  } else if (initialData.o3 > 1000) {
    initialData.o3_label_color = "bg-hazardous";
  }


  initialData.pm1 = Math.floor(initialData.pm1);
  initialData.pm25 = Math.floor(initialData.pm25);
  initialData.pm10 = Math.floor(initialData.pm10);

  res.render("index", { initialData, activePath: "dashboard" });
}

export async function forecasting(req, res, next) {
  let forecasting = await db.get_forecasting()

  const data = {
    co: forecasting.map(row => row.co_forecast),
    o3: forecasting.map(row => row.o3_forecast),
    pm1: forecasting.map(row => row.pm1_forecast),
    pm25: forecasting.map(row => row.pm25_forecast),
    pm10: forecasting.map(row => row.pm10_forecast),
    no2: forecasting.map(row => row.no2_forecast),
    labels: forecasting.map(row => moment(row.forecast_datetime).format('HH:mm:ss'))
  }
  console.log(data)

  res.render("forecasting", { data, activePath: "forecasting" });
}

export async function history(req, res, next) {
  let historyData = await db.get_history_data();
  let dailyData = await db.get_daily_data();
  let weeklyData = await db.get_weekly_data();
  let monthlyData = await db.get_monthly_data();

  // console.log(dailyData)

  const data = {
    labels: [],
    pm1: [],
    pm25: [],
    pm10: [],
    co: [],
    no2: [],
    o3: [],
    aqi: [],
  };

  historyData.forEach((element) => {
    const date = new Date(element.timestamp);
    const formattedTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    data.labels.push(formattedTime);
    data.pm1.push(element.pm1);
    data.pm25.push(element.pm2_5);
    data.pm10.push(element.pm10);
    data.co.push(element.co);
    data.no2.push(element.no2);
    data.o3.push(element.o3);
    data.aqi.push(element.aqi);
  });

  const data_daily = {
    labels: [],
    pm1: [],
    pm25: [],
    pm10: [],
    co: [],
    no2: [],
    o3: [],
    aqi: [],
  }

  dailyData.forEach((element) => {
    const date = new Date(element.timestamp);
    const formattedTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    data_daily.labels.push(formattedTime);
    data_daily.pm1.push(element.pm1);
    data_daily.pm25.push(element.pm2_5);
    data_daily.pm10.push(element.pm10);
    data_daily.co.push(element.co);
    data_daily.no2.push(element.no2);
    data_daily.o3.push(element.o3);
    data_daily.aqi.push(element.aqi);
  });

  const data_weekly = {
    labels: [],
    avg_pm1: [],
    avg_pm25: [],
    avg_pm10: [],
    avg_co: [],
    avg_no2: [],
    avg_o3: [],
    avg_aqi: [],
  };

  weeklyData.forEach((element) => {
    const formattedDate = moment(element.date).format('MM-DD'); // Format yyyy-mm-dd
    data_weekly.labels.push(formattedDate);
    data_weekly.avg_pm1.push(element.avg_pm1);
    data_weekly.avg_pm25.push(element.avg_pm2_5);
    data_weekly.avg_pm10.push(element.avg_pm10);
    data_weekly.avg_co.push(element.avg_co);
    data_weekly.avg_no2.push(element.avg_no2);
    data_weekly.avg_o3.push(element.avg_o3);
    data_weekly.avg_aqi.push(element.avg_aqi);
  });

  const data_monthly = {
    labels: [],
    avg_pm1: [],
    avg_pm25: [],
    avg_pm10: [],
    avg_co: [],
    avg_no2: [],
    avg_o3: [],
    avg_aqi: [],
  };

  monthlyData.forEach((element) => {
    const formattedDate = moment(element.date).format('MM-DD'); // Format yyyy-mm-dd
    data_monthly.labels.push(formattedDate);
    data_monthly.avg_pm1.push(element.avg_pm1);
    data_monthly.avg_pm25.push(element.avg_pm2_5);
    data_monthly.avg_pm10.push(element.avg_pm10);
    data_monthly.avg_co.push(element.avg_co);
    data_monthly.avg_no2.push(element.avg_no2);
    data_monthly.avg_o3.push(element.avg_o3);
    data_monthly.avg_aqi.push(element.avg_aqi);
  });


  res.render("history", { data, data_daily, data_weekly, data_monthly, activePath: "history" });
}
