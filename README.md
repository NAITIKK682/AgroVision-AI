# AgroVision AI

AI-powered crop disease detection system with voice assistant and weather integration.

## Description

AgroVision AI is a comprehensive full-stack application designed to help farmers detect crop diseases through image analysis, provide AI-powered chat assistance, voice commands, weather information, and generate PDF reports. The system supports multiple languages and offers offline capabilities for rural areas with limited internet access.

## Features

- **Image-based Disease Detection**: Upload crop images to detect diseases using machine learning models.
- **AI Chat Assistant**: Interactive chatbot for farming advice and queries.
- **Voice Commands**: Voice-activated assistant for hands-free operation.
- **Weather Information**: Real-time weather data integration for farming decisions.
- **Multi-language Support**: Available in English and Hindi.
- **Offline Capability**: Service worker for offline functionality.
- **PDF Reports**: Generate and download detailed reports of detections and advice.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, PWA (Progressive Web App)
- **Backend**: Flask, Python
- **AI/ML**: TensorFlow, Groq API
- **Database**: SQLite
- **Other**: OpenCV for image processing, ReportLab for PDF generation

## Project Structure

```
AgroVision-AI/
├── .github/
│   └── appmod/  # App modernization tools and configurations
├── backend/  # Flask backend application
│   ├── app.py  # Main Flask application entry point, handles routing and app initialization
│   ├── requirements.txt  # Python dependencies: Flask, TensorFlow, OpenCV, etc.
│   ├── config/  # Configuration files
│   │   ├── config.py  # Main configuration settings
│   │   ├── constants.py  # Application constants
│   │   └── settings.py  # Environment-specific settings
│   ├── database/  # Database related files
│   │   ├── db.py  # Database connection and setup
│   │   ├── models.py  # Database models and schemas
│   │   └── queries.py  # Database query functions
│   ├── model/  # Machine learning model files
│   │   ├── inference.py  # Model inference logic for predictions
│   │   ├── model.py  # Model definition and loading
│   │   ├── requirements.txt  # Model-specific dependencies: TensorFlow, NumPy, Pillow
│   │   └── train.py  # Model training script
│   ├── routes/  # API route handlers
│   │   ├── assistant.py  # Routes for AI assistant functionality
│   │   ├── health.py  # Health check routes
│   │   ├── history.py  # Routes for prediction history
│   │   ├── init.py  # Route initialization
│   │   ├── predict.py  # Routes for disease prediction
│   │   ├── reports.py  # Routes for report generation
│   │   └── weather.py  # Routes for weather data
│   ├── services/  # Business logic services
│   │   ├── cache_service.py  # Caching service for performance
│   │   ├── groq_service.py  # Integration with Groq AI API
│   │   ├── model_service.py  # Model prediction service
│   │   ├── pdf_service.py  # PDF generation service
│   │   ├── translation_service.py  # Language translation service
│   │   ├── validation_service.py  # Input validation service
│   │   ├── voice_service.py  # Voice processing service
│   │   └── weather_service.py  # Weather data service
│   ├── static/  # Static files served by backend
│   │   └── reports/  # Generated report files
│   ├── uploads/  # Uploaded image files
│   └── utils/  # Utility functions
│       ├── helpers.py  # General helper functions
│       ├── logger.py  # Logging utilities
│       └── validators.py  # Data validation utilities
├── dataset/  # Dataset for model training
│   └── README.md  # Dataset documentation
├── docs/  # Documentation files
│   ├── API.md  # API documentation
│   ├── FARMER_GUIDE.md  # User guide for farmers
│   └── SETUP.md  # Setup and installation guide
├── frontend/  # React frontend application
│   ├── index.html  # Main HTML file
│   ├── package.json  # Node.js dependencies and scripts: React, Vite, Tailwind, etc.
│   ├── postcss.config.js  # PostCSS configuration for Tailwind
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── vite.config.js  # Vite build tool configuration
│   ├── public/  # Public static assets
│   │   └── manifest.json  # PWA manifest file
│   └── src/  # Source code
│       ├── App.jsx  # Main React app component
│       ├── index.css  # Global CSS styles
│       ├── main.jsx  # React app entry point
│       ├── service-worker.js  # PWA service worker
│       ├── components/  # Reusable React components
│       │   ├── AIChat.jsx  # AI chat interface component
│       │   ├── CameraCapture.jsx  # Camera capture for image upload
│       │   ├── ErrorPrediction.jsx  # Error handling for predictions
│       │   ├── Footer.jsx  # Footer component
│       │   ├── HealthyDiseasedGallery.jsx  # Gallery of healthy/diseased crops
│       │   ├── ImageUploader.jsx  # Image upload component
│       │   ├── LanguageToggle.jsx  # Language switcher
│       │   ├── Navbar.jsx  # Navigation bar
│       │   ├── ResultDetails.jsx  # Prediction result display
│       │   ├── ScanGuide.jsx  # Scanning guide component
│       │   ├── VoiceAssistant.jsx  # Voice assistant interface
│       │   └── WeatherCard.jsx  # Weather information card
│       ├── contexts/  # React context providers
│       │   ├── LanguageContext.jsx  # Language context for i18n
│       │   └── OfflineContext.jsx  # Offline capability context
│       ├── pages/  # Page components
│       │   ├── AssistantPage.jsx  # AI assistant page
│       │   ├── DetectionPage.jsx  # Disease detection page
│       │   ├── HistoryPage.jsx  # Prediction history page
│       │   └── LandingPage.jsx  # Landing/home page
│       ├── services/  # Frontend service functions
│       │   ├── api.js  # API client functions
│       │   ├── cacheService.js  # Client-side caching
│       │   ├── pdfService.js  # PDF generation on client
│       │   ├── voiceService.js  # Voice processing
│       │   └── weatherService.js  # Weather API client
│       ├── translations/  # Translation files
│       │   ├── en.json  # English translations
│       │   └── hi.json  # Hindi translations
│       └── utils/  # Frontend utilities
│           ├── constants.js  # Frontend constants
│           └── helpers.js  # Helper functions
└── README.md  # This file
```

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install Node.js dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Model Training (Optional)
1. Navigate to the model directory:
   ```
   cd backend/model
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run training:
   ```
   python train.py
   ```

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md).

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Open the application in your browser.
4. Upload crop images for disease detection.
5. Use the AI chat assistant for farming advice.
6. Access weather information and generate reports.

## API Documentation

See [docs/API.md](docs/API.md) for detailed API endpoints and usage.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.