## Air Quality Forecasting Service

Welcome to the Air Quality Forecasting Service! This service predicts air quality, such as CO, NO2, O3, PM1, PM25, and PM10 using Python 3.10.12 and XGBoost. Follow the steps below to set up the service locally.

### Prerequisites

Ensure you have the following prerequisites installed:
* Python 3.10.12
    ```sh
    apt install python3.10
    ```
* pip (Python package installer)
    ```sh
    apt install python3-pip
    ```

### Installation

Follow these steps to install and set up the Air Quality Forecasting Service:

1. Clone the Repository:
    ```sh
    https://github.com/AxellinoAnggoro/ispu-ta.git
    ```
2. Install Python Dependencies:
    ```sh
    apt install python3.10-venv
    apt install pkg-config
    apt install python3-dev default-libmysqlclient-dev build-essential
    apt install cloud-init
    python3.10 -m venv virtual_env
    source bin/activate
    ```
3. Install Requirement:
   ```sh
    python3.10 -m venv virtual_env
    source bin/activate
    pip install mysqlclient
    pip install scikit-learn
    pip install sqlalchemy
    pip install pandas
    pip install python-dotenv
    pip install datetime
    pip install xgboost
    python3.10 -m pip install --trusted-host pypi.python.org --trusted-host files.pythonhosted.org --trusted-host pypi.org --upgrade pip (optional)
   ```

4. Fill Environment Configuration:
   * Locate the environment.example file in the repository.
   * Fill in the necessary environment variables (DATABASE_URL, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME)
   * Save the file as .env
5. Run the Script:
    ```sh
    python3 app_rev.py
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>