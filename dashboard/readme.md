## Air Quality Forecasting Dashboard Monitoring

Welcome to the Air Quality Dashboard Monitoring project! This dashboard allows you to monitor air quality using Node.js, Tailwind CSS, and Express.js. Follow the steps below to set up the dashboard locally.

### Prerequisites

Ensure you have the following prerequisites installed:
* Node.js
    ```sh
    sudo apt update && sudo apt upgrade
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt install nodejs
    ```
* npm
    ```sh
    sudo npm install -g npm@latest
    ```

### Installation

Follow these steps to install and set up the Air Quality Forecasting Service:

1. Clone the Repository:
    ```sh
    https://github.com/AxellinoAnggoro/ispu-ta.git
    ```
2. Open port 3000:
    ```sh
    sudo ufw allow 3000
    ```
3. Fill Environment Configuration:
   * Locate the env.example file in the repository.
   * Fill in the necessary environment variables (DATABASE_URL)
   * Save the file as .env
4. Install Requirement and Run the Dashboard:
    ```sh
    npm i
    npm run start
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>