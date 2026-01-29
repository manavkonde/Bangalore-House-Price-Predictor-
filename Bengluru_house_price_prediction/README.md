# Bangalore House Price Prediction

An AI-powered web application for predicting property prices in Bangalore, India. Get accurate estimates based on location, size, amenities, and market data.

## Features

- **AI Price Prediction**: Machine learning model trained on 13,000+ real transactions
- **Interactive Map**: Explore Bangalore neighborhoods and property locations
- **Nearby Amenities**: Find schools, hospitals, malls, and transportation
- **Location Comparison**: Compare prices across different areas
- **Price Trends**: Visualize historical price trends with charts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Maps**: OpenStreetMap integration
- **Backend**: Supabase (database and edge functions)
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd bengluru-house-price-prediction
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── data/               # Static data and constants
└── integrations/       # External service integrations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
