# ByteShutter

[![Deploy to GitHub Pages](https://github.com/AndreaRR18/byteshutter/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/AndreaRR18/byteshutter/actions/workflows/gh-pages.yml)

ByteShutter is a simple website built with Swift on the server-side using the Vapor framework. It demonstrates how to create web applications using Swift for backend development with Leaf templates for the frontend.

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch. The static site is generated from the Vapor application and deployed to the `gh-pages` branch.

### How it works

1. When you push to `main`, GitHub Actions will:
   - Build the Vapor application
   - Start a local server
   - Generate static HTML files for all routes
   - Deploy the static site to the `gh-pages` branch
   - GitHub Pages will serve the site from the `gh-pages` branch

### Manual Deployment

To manually trigger a deployment:
1. Go to the [Actions](https://github.com/AndreaRR18/byteshutter/actions) tab
2. Select the "GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

## Overview

This project shows how to use server-side Swift for web development. The website features a clean, responsive design with a few basic pages including articles, about, and contact pages.

## Features

- Article display with clean, modern design
- Markdown content rendering
- Simple contact form with validation
- PostgreSQL database integration
- Swift concurrency with async/await patterns

## Technologies

- **Backend**: Swift 6 with Vapor 4
- **Frontend**: HTML/CSS with Leaf templating
- **Database**: PostgreSQL with Fluent ORM
- **Markdown**: Ink parser for rendering article content

## Requirements

- Swift 6.0 or higher
- macOS 13.0 or higher (for local development)
- PostgreSQL (local installation)

## Installation

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/byteshutter.git
   cd byteshutter
   ```

2. Install dependencies:
   ```bash
   swift package resolve
   ```

3. Set up PostgreSQL:
   ```bash
   # Install PostgreSQL (if not already installed)
   brew install postgresql
   
   # Start PostgreSQL service
   brew services start postgresql
   
   # Create database and user
   createdb vapor_database
   psql vapor_database -c "CREATE USER vapor_username WITH PASSWORD 'vapor_password'"
   psql vapor_database -c "GRANT ALL PRIVILEGES ON DATABASE vapor_database TO vapor_username"
   ```

4. Create a `.env` file in the project root with the following contents:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=vapor_username
   DATABASE_PASSWORD=vapor_password
   DATABASE_NAME=vapor_database
   ```

5. Run the migrations to set up the database schema:
   ```bash
   swift run App migrate
   ```

## Development Workflow

1. Ensure PostgreSQL is running:
   ```bash
   brew services start postgresql
   ```

2. Start the application:
   ```bash
   swift run
   ```

3. The website will be available at `http://localhost:8080`

4. For development with Xcode, generate an Xcode project:
   ```bash
   swift package generate-xcodeproj
   ```

## Running Tests

The project includes tests for the API endpoints:

```bash
swift test
```

## Project Structure

- `Sources/App`: Application source code
    - `Controllers`: Route handlers and business logic
    - `Models`: Data models
    - `Migrations`: Database migrations
    - `DTOs`: Data Transfer Objects
- `Resources/Views`: Leaf templates for HTML rendering
- `Public`: Static assets (CSS, JavaScript, images)
- `Tests`: Test suite

## License

This project is licensed under the MIT License - see the LICENSE file for details.