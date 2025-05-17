# Event Booking System Frontend

This is the frontend application for the Event Booking System, built with React, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Event-Booking-System.git
cd Event-Booking-System/Event-Booking-System-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
VITE_API_URL=https://localhost:7054
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── services/      # API service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Features

- User authentication (login/register)
- Event browsing and searching
- Event booking management
- Admin dashboard for event management
- Category management
- Responsive design

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query
- Vite

## Browser Support

The application is tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
