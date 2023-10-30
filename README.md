# Claims - Case Numbers and Claims Management

## Overview

This project is a simple web application designed for managing case numbers and claims. It is constructed using Node.js with Express for the backend, and React for the frontend. The application facilitates users to:

- Register and login
- Add, update, and delete claims
- Generate an email draft for a payment plan based on the claims

## Features

- **User Registration and Login**: Users can register and login using a username and password.
- **Claims Management**: Users can add new claims or update existing ones.
- **Email Generation**: Users can generate an email draft for a payment plan.

## Technologies Used

- Backend: Node.js, Express
- Frontend: HTML, CSS, React
- Other Libraries: body-parser, cors

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Lamboserker/Forderungsaufsteller.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Forderungsaufsteller
    ```

### Server

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Install server dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    npm start
    ```

### Client

1. Navigate to the client directory:

    ```bash
    cd client
    ```

2. Install client dependencies:

    ```bash
    npm install
    ```

3. Start the client:

    ```bash
    npm start
    ```

The application will now be running at `http://localhost:4000`.

## Usage

1. Open `http://localhost:4000` in your web browser.
2. Register or login to start managing your claims.

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/claims/:username`: Add or update a claim for a user  
- `GET /api/claims/:username`: Get all claims for a user
- `DELETE /api/claims/:username`: Delete a specific claim for a user
- `GET /api/claims/users`: Get all users and their claims




## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

ISC
