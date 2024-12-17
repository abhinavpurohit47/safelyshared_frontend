# Safely Shared

Safely Shared is a React project using Vite for development and build processes. It includes various components, Redux for state management, and MUI for styling.

## Description

This project is designed to manage user authentication, file uploads, and user management. It uses [`react-router-dom`]for routing between different pages.

### Features

- **User Authentication**: Users can register, log in, and update their profiles.
- **File Uploads**: Users can upload files securely.
- **User Management**: Admins can view and manage user accounts.
- **State Management**: Redux is used for managing the application state.
- **Styling**: MUI is used for consistent and responsive UI components.
- **Routing**: [`react-router-dom`]

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhinavpurohit47/safelyshared_frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd safelyshared_frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

To start the development server, run:
```bash
npm run dev
```
This will start the Vite development server and you can view the application at `http://localhost:5173`.

### Build

To build the project for production, run:
```bash
npm run build
```

### Preview

To preview the production build, run:
```bash
npm run preview
```

### Linting

To lint the code, run:
```bash
npm run lint
```

## Project Structure

```
.gitignore
docker-compose.yml
Dockerfile
eslint.config.js
index.html
package.json
postcss.config.js
public/
README.md
src/
    App.css
    App.jsx
    assets/
    components/
        FileList/
            FileList.jsx
        FileUpload/
            FileUpload.jsx
        ListUsers/
            ListUsers.jsx
        LoadingPage/
            LoadingPage.jsx
        LoginUser/
            LoginUser.jsx
        RegisterUser/
            RegisterUser.jsx
        UpdateUser/
            UpdateUser.jsx
    encryption.js
    index.css
    main.jsx
    redux/
        slices/
            fileSlice.js
        store.js
tailwind.config.js
vite.config.js
```

### Key Files and Directories

- **src/main.jsx**: The main entry point of the application.
- **src/App.jsx**: The root component that sets up routing.
- **src/components/**: Contains all the React components.
- **src/redux/**: Contains Redux slices and store configuration.
- **src/encryption.js**: Contains functions for encrypting and decrypting file content.
- **public/**: Contains static assets.
- **Dockerfile**: Configuration for Docker containerization.
- **docker-compose.yml**: Configuration for Docker Compose.
- **tailwind.config.js**: Configuration for Tailwind CSS.
- **eslint.config.js**: Configuration for ESLint.

## Docker

To run the application in a Docker container, use the following commands:

1. Build the Docker image:
   ```bash
   docker build -t safely-shared .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5173:5173 safely-shared
   ```