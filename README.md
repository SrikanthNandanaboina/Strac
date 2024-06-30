# Strac-OneDrive

## Project Description

Strac-OneDrive is a server-side application designed to connect with Microsoft's OneDrive API. It allows users to log in, view their profile, list files in the root folder, download individual files, and see users who have access to these files.

## Features

- User login via Microsoft account
- Display user profile information
- List files in the user's OneDrive root folder
- Download individual files
- View users who have access to the files

## Installation

To install the required dependencies, run the following command:

```bash
npm install
```

## Usage

To start the application, use the command:

```bash
npm start
```

## Configuration

Before running the application, make sure to set up the following environment variables:

- CLIENT_ID=your_client_id
- CLIENT_SECRET=your_client_secret
- EXPRESS_SESSION_SECRET=your_secret_key
- REDIRECT_URI=your_redirect_uri_added_while_app_registration
- POST_LOGOUT_REDIRECT_URI=should_be_host_url

## License

This project is licensed under the MIT License.
