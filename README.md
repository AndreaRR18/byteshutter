# ByteShutter

ByteShutter is a simple website built with Swift on the server-side using the Vapor framework. It demonstrates how to create web applications using Swift for backend development with Leaf templates for the frontend.

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