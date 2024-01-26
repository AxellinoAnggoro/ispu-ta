## Air Quality Forecasting Service

Welcome to the Air Quality Forecasting Service! This service predicts air quality, such as CO, NO2, O3, PM1, PM25, and PM10 using Python 3.10.12 and XGBoost. Follow the steps below to set up the service locally.

### Prerequisites

Ensure you have the following prerequisites installed:
* Python 3.10.12
* pip (Python package installer)

### Installation

Follow these steps to install and set up the Air Quality Forecasting Service:

1. Clone the Repository:
    ```sh
    https://github.com/AxellinoAnggoro/ispu-ta.git
    ```
2. Install Python Dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Fill Environment Configuration:
   * Locate the environment.example file in the repository.
   * Fill in the necessary environment variables (DATABASE_URL, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME)
   * Save the file as .env
4. Run the Script:
    ```sh
    python3 app_rev.py
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>