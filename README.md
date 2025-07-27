# Formulix 🏎️

## Setup

1. Set up environment variables:

    ```sh
    cp .env.example .env
    ```

    Edit `.env` with your configuration

1. Install dependencies:

    ```sh
    npm install
    ```

1. Start development server:

    ```sh
    npm run dev
    ```

    The app will be available at [http://localhost:1111](http://localhost:1111)

1. To ensure respect of coding style rules of the project, add the pre-commit script:

    ```sh
    cp git/pre-commit .git/hooks
    ```

    This script will run before every commit to check that your changes match ESLint rules.
