# WebScraper - Content Collection Platform

A web application that allows users to scrape websites, extract information, and display it in a beautiful card-based interface. Users can create accounts to save their finds and view detailed information about each item.

## Features

- User authentication and account management
- Web scraping functionality to extract information from websites
- Card-based interface for displaying scraped content
- Detailed view for each item with comprehensive information
- Responsive design for mobile and desktop
- API endpoints for potential integration with Discord or Telegram bots

## Tech Stack

### Frontend
- React.js with TypeScript
- Chakra UI for responsive components
- React Router for navigation
- Redux Toolkit for state management

### Backend
- Node.js with Express
- MongoDB for database
- Cheerio for web scraping
- Puppeteer for handling JavaScript-rendered content
- JWT for authentication

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── store/          # Redux store
│       └── types/          # TypeScript types
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   └── scraper/        # Web scraping functionality
│   └── utils/              # Utility functions
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Start the development servers

## API Integration

The application provides RESTful API endpoints that can be used to integrate with Discord or Telegram bots. These endpoints allow for:

- User authentication
- Submitting URLs for scraping
- Retrieving saved items
- Managing user preferences

## License

MIT