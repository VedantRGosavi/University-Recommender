# University Recommender Project Structure

## Overview
The University Recommender is a full-stack web application designed to help students find suitable universities based on their preferences and criteria. The project follows a client-server architecture with React.js frontend and Node.js backend.

## Directory Structure

```
University-Recommender/
├── client/                 # Frontend React application
│   ├── build/             # Production build output
│   │   └── static/        # Compiled static assets
│   │       ├── css/       # Compiled CSS files
│   │       ├── js/        # Compiled JavaScript files
│   │       └── media/     # Media assets (images, fonts, etc.)
│   ├── public/            # Public assets and index.html
│   └── src/              # Source code for React application
│       ├── components/   # React components
│       └── res/         # Resource files (images, constants, etc.)
└── server/              # Backend Node.js application
```

## Client Directory (`/client`)

### Build Directory (`/client/build`)
- Contains the production-ready build of the React application
- Generated using `npm run build` or `yarn build`
- Includes optimized and minified assets

### Public Directory (`/client/public`)
- Contains static files that are publicly accessible
- Includes the main `index.html` file
- Place for favicon, robots.txt, and other static assets

### Source Directory (`/client/src`)
- Main development directory for the React application
- Contains all React components, styles, and application logic

#### Components Directory (`/client/src/components`)
- Houses all React components used in the application:
  - `LandingPage.js`: Main entry point of the application
  - `Navbar.js`: Navigation component
  - `ResultsPage.js`: Displays university recommendations
  - `HowItWorks.js`: Information about using the application
- Follows a modular structure for better organization and reusability

#### Resources Directory (`/client/src/res`)
- Contains static resources used in the application
- Includes images, icons, and other media files
- May contain constant definitions and configuration files

## Server Directory (`/server`)
The server implementation includes:
- `server.js`: Main server application file
- `recommendations.js`: University recommendation logic
- `indexUniversities.js`: University data indexing
- `helper.js`: Utility functions
- `algos.txt`: Algorithm documentation

## API Endpoints Documentation

### University Search and Recommendations
```
GET /api/universities
- Get list of universities with filtering
- Query params: { filters, preferences }
- Returns: List of universities matching criteria

GET /api/recommendations
- Get university recommendations based on preferences
- Query params: { preferences, criteria }
- Returns: List of recommended universities
```

Note: The current implementation does not include user authentication or user-specific features. All endpoints are publicly accessible.

## Key Features
1. University search and filtering
2. Personalized recommendations based on input criteria
3. Interactive user interface
4. Real-time search results
5. Comprehensive university information display

## Development Guidelines
1. Follow consistent coding standards
2. Write clear documentation for new components
3. Maintain separation of concerns
4. Use meaningful variable and function names
5. Include proper error handling
6. Write unit tests for critical functionality

## Getting Started
1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Start development servers
5. Begin development

## Build and Deployment
- Frontend build: `npm run build` in the client directory
- Backend build: Follow deployment guidelines in server documentation
- Use environment-specific configuration files
- Ensure proper security measures are in place

## Contributing
1. Create feature branches from main
2. Follow the established code style
3. Write clear commit messages
4. Submit pull requests with proper documentation
5. Review and address feedback

## Additional Notes
- Keep dependencies up to date
- Monitor application performance
- Follow security best practices
- Maintain documentation 