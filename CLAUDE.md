# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Client: `cd client && npm start` - Run React frontend
- Server: `cd server && npm run dev` - Run Express server with nodemon
- Client tests: `cd client && npm test` - Run frontend tests
- Client tests (specific): `cd client && npm test -- -t "test name"` - Run specific test
- Client build: `cd client && npm run build` - Build production frontend

## Code Style
- React: Functional components with hooks (useState, useEffect)
- Styling: Tailwind CSS with @material-tailwind/react components
- Frontend: Follow existing patterns in components folder
- Backend: Express.js with Elasticsearch for university recommendations
- API: RESTful endpoints in server.js
- Error handling: Try/catch blocks for API calls and async functions
- Naming: camelCase for variables/functions, PascalCase for components
- Imports: Group by external, internal, then relative paths

## Guidelines
- Update or add tests when modifying functionality
- Follow existing component patterns for new UI features
- Use Clerk for authentication-related features
- Maintain separation between client and server code