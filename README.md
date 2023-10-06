# Forderung - Case Numbers and Claims Management

## Overview

This project is a simple web application for managing case numbers and claims. It's built using Node.js with Express for the backend and vanilla JavaScript for the frontend. The application allows users to:

- Register and login
- Add, update, and delete claims
- Generate an email draft for a payment plan based on the claims

## Features

- **User Registration and Login**: Users can register and login using a username.
- **Claims Management**: Users can add new claims or update existing ones.
- **Email Generation**: Users can generate an email draft for a payment plan.

## Technologies Used

- Backend: Node.js, Express
- Frontend: HTML, CSS, JavaScript
- Other Libraries: body-parser, cors

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/forderung.git
    ```

2. Navigate to the project directory:

    ```bash
    cd forderung
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    node server.js
    ```

    The server will start running at `http://localhost:3000`.

2. Open `index.html` in your web browser.

3. Register or login to start managing your claims.

## API Endpoints

- `POST /api/register`: Register a new user
- `POST /api/claims/:username`: Add or update a claim for a user
- `GET /api/claims/:username`: Get all claims for a user
- `DELETE /api/claims/:username`: Delete a specific claim for a user
- `GET /api/users`: Get all users and their claims

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

ISC
