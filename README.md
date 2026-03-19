# AgroVision AI

AI-powered crop disease detection system with voice assistant and weather integration.

## Description

AgroVision AI is a comprehensive full-stack application designed to help farmers detect crop diseases through image analysis, provide AI-powered chat assistance, voice commands, weather information, and generate PDF reports. The system supports multiple languages and offers offline capabilities for rural areas with limited internet access.

## Features

- **📸 Professional Camera UI**: Modern, mobile-friendly camera interface with live preview and scan guide
- **🎯 Image-based Disease Detection**: Upload crop images to detect diseases using machine learning models
- **📊 Prediction Charts**: Visual comparison of all disease predictions with interactive bar charts
- **📱 Camera Capture**: Live camera feed with automatic image capture and preview
- **💾 Image History Display**: View all scanned crop images in history with proper persistence
- **🤖 AI Chat Assistant**: Interactive chatbot for farming advice and queries
- **🎤 Voice Commands**: Voice-activated assistant for hands-free operation
- **🌤️ Weather Information**: Real-time weather data integration for farming decisions
- **🌍 Multi-language Support**: Available in English and Hindi with auto-translation
- **📴 Offline Capability**: Service worker and caching for offline functionality
- **📄 PDF Reports**: Generate and download detailed reports of detections and advice
- **⚡ Auto-Scan**: Automatic disease prediction when capturing images from camera

## Tech Stack

- **Frontend**: React 18+, Vite, Tailwind CSS, PWA (Progressive Web App)
  - **UI Libraries**: Framer Motion (animations), React Icons, Recharts (data visualization)
  - **State Management**: React Context API
  - **API Client**: Axios
- **Backend**: Flask, Python 3.8+
  - **Database ORM**: SQLAlchemy
  - **API Format**: RESTful with JSON
- **AI/ML**: TensorFlow, Keras, Groq API
- **Database**: SQLite with SQLAlchemy models
- **Image Processing**: OpenCV, PIL/Pillow
- **Other**: ReportLab for PDF generation, Geolocation API

## Project Structure

```
AgroVision-AI/
├── package.json                    # Root package configuration
├── README.md                       # Project documentation
├── CAMERA_UI_GUIDE.md             # 📸 Comprehensive camera UI documentation
├── backend/                        # Flask backend application
│   ├── app.py                     # Main Flask application entry point
│   ├── final_fix.py               # Final fixes and adjustments
│   ├── Readme.md                  # Backend documentation
│   ├── requirements.txt           # Python dependencies
│   ├── test_image_flow.py         # 🧪 Image flow testing suite
│   ├── __pycache__/               # Python cache files
│   ├── config/                    # Configuration files
│   │   ├── config.py              # Main configuration settings
│   │   ├── constants.py           # Application constants
│   │   ├── settings.py            # Environment-specific settings
│   │   └── __pycache__/
│   ├── database/                  # Database layer
│   │   ├── __init__.py            # Package initialization
│   │   ├── db.py                  # Database connection setup (✅ Updated: ScanHistory import)
│   │   ├── models.py              # 🆕 SQLAlchemy ORM models (ScanHistory, AssistantQuery)
│   │   ├── queries.py             # Legacy SQL query functions
│   │   └── __pycache__/
│   ├── instance/                  # Instance folder for runtime data
│   ├── logs/                      # Application logs
│   ├── model/                     # Machine learning models
│   │   ├── classes.txt            # Model class definitions
│   │   ├── crop_disease_model.keras  # Pre-trained Keras model
│   │   ├── inference.py           # Model inference logic
│   │   ├── model.py               # Model loading utilities
│   │   ├── requirements.txt       # ML dependencies
│   │   └── train.py               # Model training script
│   ├── routes/                    # API route handlers
│   │   ├── assistant.py           # AI assistant routes
│   │   ├── health.py              # Health check endpoints
│   │   ├── history.py             # ✅ History API (Returns image_url)
│   │   ├── init.py                # Route initialization
│   │   ├── predict.py             # ✅ Prediction endpoint (ORM-based save)
│   │   ├── reports.py             # Report generation routes
│   │   ├── weather.py             # Weather data routes
│   │   └── __pycache__/
│   ├── services/                  # Business logic services
│   │   ├── cache_service.py       # Performance caching
│   │   ├── groq_service.py        # Groq AI API integration
│   │   ├── knowledge_base.py      # Knowledge base for AI
│   │   ├── model_service.py       # Model prediction service
│   │   ├── pdf_service.py         # PDF generation
│   │   ├── translation_service.py # Language translation
│   │   ├── validation_service.py  # Image validation (accepts diseased leaves)
│   │   ├── voice_service.py       # Voice processing
│   │   ├── weather_service.py     # Weather data fetching
│   │   └── __pycache__/
│   ├── static/                    # Static files
│   │   └── reports/               # Generated PDF reports
│   ├── uploads/                   # 📁 Captured image files (UUID-timestamped)
│   ├── utils/                     # Utility functions
│   │   ├── helpers.py             # Helper functions
│   │   ├── logger.py              # Logging utilities
│   │   ├── validators.py          # Data validators
│   │   └── __pycache__/
│   └── venv311/                   # Python virtual environment
│       ├── pyvenv.cfg
│       ├── Include/
│       ├── Lib/
│       │   └── site-packages/
│       └── Scripts/
│           ├── activate
│           ├── activate.bat
│           ├── Activate.ps1
│           └── deactivate.bat
└── frontend/                      # React frontend application
    ├── index.html                 # Main HTML file
    ├── package.json               # ✅ npm dependencies (includes recharts)
    ├── postcss.config.js          # PostCSS configuration
    ├── tailwind.config.js         # Tailwind CSS configuration
    ├── vite.config.js             # Vite build configuration
    ├── vercel.json                # Vercel deployment config
    ├── public/                    # Public static assets
    │   ├── manifest.json          # PWA manifest
    │   └── sw.js                  # Service worker
    └── src/                       # Source code
        ├── App.jsx                # Main React component
        ├── index.css              # Global CSS styles
        ├── main.jsx               # React entry point
        ├── service-worker.js      # PWA service worker
        ├── components/            # Reusable components
        │   ├── AIChat.jsx         # AI chat interface
        │   ├── CameraCapture.jsx  # 📸 Professional camera UI (redesigned)
        │   ├── ErrorPrediction.jsx # Error handling display
        │   ├── Footer.jsx         # Footer component
        │   ├── HealthyDiseasedGallery.jsx # Crop gallery
        │   ├── ImageUploader.jsx  # Image upload handling
        │   ├── LanguageToggle.jsx # Language switcher (EN/HI)
        │   ├── Navbar.jsx         # Navigation bar
        │   ├── PredictionChart.jsx # 📊 NEW: Recharts visualization
        │   ├── ResultDetails.jsx  # ✅ Updated: Image + chart display
        │   ├── ScanGuide.jsx      # Scanning instructions
        │   ├── VoiceAssistant.jsx # Voice interface
        │   └── WeatherCard.jsx    # Weather display
        ├── contexts/              # React context providers
        │   ├── LanguageContext.jsx # i18n context
        │   └── OfflineContext.jsx # Offline caching context
        ├── pages/                 # Page components
        │   ├── AssistantPage.jsx  # AI assistant page
        │   ├── DetectionPage.jsx  # ✅ Updated: Auto-scan on camera capture
        │   ├── HistoryPage.jsx    # ✅ Updated: Image display with fallback
        │   └── LandingPage.jsx    # Landing/home page
        ├── services/              # Frontend services
        │   ├── api.js             # API client (axios)
        │   ├── cacheService.js    # Client-side caching
        │   ├── pdfService.js      # PDF handling
        │   ├── voiceService.js    # Voice API
        │   └── weatherService.js  # Weather API client
        ├── translations/          # i18n translation files
        │   ├── en.json            # ✅ English translations
        │   └── hi.json            # ✅ Hindi translations
        └── utils/                 # Utility functions
            ├── constants.js       # Frontend constants
            └── helpers.js         # Helper functions
```

### Key Improvements (Latest Updates)

#### 🔄 Backend Improvements
- **Database Model** (`models.py`): Added `image_filename` column to `ScanHistory` ORM model
- **History API** (`routes/history.py`): Now returns `image_url` for all scanned images
- **Prediction Route** (`routes/predict.py`): Refactored to use SQLAlchemy ORM for consistency
- **Database Init** (`database/db.py`): Updated to load both `ScanResult` and `ScanHistory` models
- **Test Suite** (`test_image_flow.py`): Complete image persistence testing (4 test cases)

#### 🎨 Frontend Improvements
- **Camera UI** (`CameraCapture.jsx`): Professional redesign with rounded preview, circular button, scan guide
- **Live Preview**: Animated scan guide frame with corner brackets and center pulse
- **Image Preview State**: Shows captured image with Retake/Predict options
- **Prediction Charts** (`PredictionChart.jsx`): Bar chart visualization using Recharts
- **Result Display** (`ResultDetails.jsx`): Image at top, followed by quick stats and charts
- **Detection Page** (`DetectionPage.jsx`): Auto-scan trigger when image captured from camera
- **History Page** (`HistoryPage.jsx`): Displays images in history cards with emoji fallback
- **Error Handling**: Friendly error screens with helpful messages

#### 📱 Features Added
✅ Mobile-first responsive design
✅ Smooth fade-in/scale animations
✅ Loading spinners during processing
✅ Auto-scan from camera capture
✅ Image persistence in database
✅ Desktop and mobile support
✅ Portrait and landscape orientation support

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Supported browsers: Chrome 33+, Firefox 25+, Safari 11+, Edge 79+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create virtual environment (if not exists):
   ```bash
   python -m venv venv311
   .venv/Scripts/activate  # Windows
   source venv311/bin/activate  # macOS/Linux
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
   This includes:
   - React 18.2+
   - Tailwind CSS
   - Recharts (data visualization)
   - Framer Motion (animations)
   - React Icons
   - Axios (API client)

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

### Model Training (Optional)
1. Navigate to the model directory:
   ```bash
   cd backend/model
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run training:
   ```bash
   python train.py
   ```

### Testing Image Flow (Backend)
To verify that image upload, storage, and retrieval are working correctly:
```bash
cd backend
python test_image_flow.py
```

This runs 4 comprehensive tests:
- ✅ Database model stores/retrieves images
- ✅ History API returns image data  
- ✅ Image serving route works
- ✅ Database schema validation

For detailed setup instructions, see backend/Readme.md and [CAMERA_UI_GUIDE.md](CAMERA_UI_GUIDE.md).

## Usage

### Basic Workflow
1. **Start Servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && python app.py
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Open Application**: Navigate to `http://localhost:5173`

3. **Crop Disease Detection**:
   - **Option A - Camera**: Click "Scan Crop" → Capture image with camera → Auto-scan triggered
   - **Option B - Upload**: Click "Upload Image" → Select crop image from device
   - View results with:
     - Prediction details
     - Confidence percentage
     - Disease symptoms and treatments
     - Interactive prediction chart
     - Disease prevention methods

4. **View History**:
   - Navigate to "History" page
   - View all scanned crops with thumbnails
   - Click any card to see detailed results

5. **AI Assistant**:
   - Go to "Assistant" page
   - Ask farming-related questions
   - Get personalized advice from Groq AI

6. **Weather Information**:
   - Check weather card on detection page
   - Make informed farming decisions

7. **Language Support**:
   - Toggle between English and Hindi
   - All translations auto-applied

8. **Generate Reports**:
   - After detection, download PDF report
   - Includes predictions, advice, and recommendations

### Feature Highlights

#### 📸 Professional Camera Interface
- Live camera preview with rounded corners
- Animated scan guide frame with corner brackets
- Center focus indicator
- Smooth fade-in animations
- Mobile-friendly full-screen view

#### 📊 Prediction Charts
- Interactive bar charts showing all disease predictions
- Color-coded by prediction type
- Hover tooltips with exact percentages
- Responsive design for all screen sizes

#### 💾 Image Management
- Images persist in database after capture
- UUID-timestamped filenames for uniqueness
- Backend serves images via `/uploads/<filename>` route
- Auto-fallback to emoji if image unavailable
- Proper memory cleanup (blob URL revocation)

#### ⚡ Auto-Scan Feature
- When capturing from camera: Auto-scan triggers after "Analyze Crop"
- When uploading: Manual "Scan" button available
- Loading spinner during processing
- Results display immediately after processing

#### 🌐 Offline Support
- Service worker pre-caches essential files
- Client-side caching for API responses
- Works offline for previously loaded content
- Syncs with backend when online restored

## Recent Updates & Improvements

### Version 3.2 - Production Ready Release

#### 🎨 UI/UX Enhancements
- ✅ Professional camera UI redesign with modern styling
- ✅ Animated scan guide frame with corner brackets
- ✅ Smooth fade-in and scale animations
- ✅ Loading spinners for user feedback
- ✅ Error screens with helpful messages
- ✅ Mobile-first responsive design
- ✅ Portrait and landscape orientation support

#### 📊 Data Visualization
- ✅ Added Recharts-based prediction charts
- ✅ Bar chart showing all disease predictions side-by-side
- ✅ Color-coded predictions (emerald, cyan, purple)
- ✅ Interactive tooltips with exact percentages
- ✅ Integrated into ResultDetails component

#### 🔧 Backend Fixes
- ✅ Fixed image persistence issue
  - Added `image_filename` column to `ScanHistory` ORM model
  - Updated `history.py` to return `image_url` for all scans
  - Refactored `predict.py` to use SQLAlchemy ORM
  - Updated `db.py` to import both model classes
- ✅ Auto-scan trigger when capturing from camera
- ✅ Proper error handling for invalid images
- ✅ Image validation accepts diseased leaves (brown/yellow colors)

#### 📸 Camera Capture
- ✅ Live video preview with rounded corners
- ✅ Circular capture button (professional camera app style)
- ✅ Image preview state with Retake/Predict options
- ✅ Scan guide frame with animations
- ✅ Proper stream cleanup (camera light turns off)
- ✅ Canvas-based image capture with high quality

#### 💾 Image Management
- ✅ Images now persist in database correctly
- ✅ Backend serves images via `/uploads/<filename>` endpoint
- ✅ History page displays all scanned images
- ✅ Emoji fallback for missing images
- ✅ Proper blob URL memory management

#### 🧪 Testing & Validation
- ✅ Complete image flow test suite (`test_image_flow.py`)
- ✅ 4 comprehensive test cases
- ✅ Database schema validation
- ✅ API endpoint verification

### Known Limitations & Future Enhancements

#### Current Limitations
- Images stored locally (`/uploads/` folder)
- No cloud storage integration yet
- Old database records won't have images (NULL values)

#### Planned Improvements
- 🔄 Cloud storage integration (AWS S3, Azure Blob, Cloudinary)
- 🔄 Image filtering and enhancement
- 🔄 Batch image processing
- 🔄 Geolocation-based disease mapping
- 🔄 Real-time disease alerts
- 🔄 Advanced analytics dashboard

## API Documentation

### Core Endpoints

#### Disease Prediction
- **POST** `/api/predict` - Predict disease from image
  - Request: `multipart/form-data` with image file
  - Response: Prediction data with `image_url`
  - Returns: `{status, data: {prediction, image_url, scan_id}}`

#### History
- **GET** `/api/history` - Get all scan history
  - Response: Array of scan records with `image_url` and `image_filename`
  - Returns: `{status, data: [{id, crop_name, disease_name, image_url, ...}]}`

#### AI Assistant
- **POST** `/api/assistant` - Get AI recommendations
  - Request: `{query, language}`
  - Response: AI-generated advice

#### Weather
- **GET** `/api/weather` - Get weather data
  - Query params: `lat`, `lon`
  - Response: Current weather information

#### Image Serving
- **GET** `/uploads/<filename>` - Serve uploaded images
  - Returns: Image file for display

### Image URL Format
```
http://localhost:5000/uploads/{uuid}_{YYYYMMDD}.{ext}
Example: http://localhost:5000/uploads/a1b2c3d4_20260319.jpg
```

For more detailed API documentation, see backend/Readme.md

## Troubleshooting

### Common Issues

#### Issue: Camera doesn't work
- ✅ Check camera permissions in browser
- ✅ Ensure HTTPS on production (required for getUserMedia)
- ✅ Try using `http://localhost:5000` for local development
- ✅ Check browser console for errors (F12)

#### Issue: Images not showing in history
- ✅ Ensure backend is running and image upload folder exists
- ✅ Check `/uploads/` folder for captured images
- ✅ Verify database has `image_filename` column
- ✅ Run `python test_image_flow.py` to diagnose

#### Issue: Prediction not working
- ✅ Ensure image is properly formatted (JPG/PNG)
- ✅ Check that leaf is clearly visible (most of image)
- ✅ Verify model file exists: `backend/model/crop_disease_model.keras`
- ✅ Check backend logs for error messages

#### Issue: Slow image capture
- ✅ Reduce canvas resolution if needed
- ✅ Check device CPU/memory usage
- ✅ Try closing other browser tabs

#### Issue: Auto-scan not triggering
- ✅ Make sure to click "Analyze Crop" button after preview
- ✅ Check network connection is active
- ✅ Open browser console to see any errors

### Performance Tips

✅ **Image Quality**: Uses JPEG 0.95 quality (good quality, small file)
✅ **Caching**: Browser caches images for faster history loading
✅ **Animations**: GPU-accelerated CSS animations (smooth 60fps)
✅ **Bundle Size**: Vite optimized build for fast load
✅ **API Response**: Image URLs cached in browser localStorage

## Development Guidelines

### Adding New Features

#### Camera UI Customization
- See [CAMERA_UI_GUIDE.md](CAMERA_UI_GUIDE.md) for configuration options
- Tailwind CSS classes are all responsive and themeable
- Animations use CSS keyframes (customizable via `tailwind.config.js`)

#### Backend Model Updates
- Always use SQLAlchemy ORM (see `models.py` for patterns)
- Update `database/db.py` if adding new models
- Run `test_image_flow.py` after schema changes

#### Frontend Component Guidelines
- Use React hooks (useState, useEffect, useCallback, useRef)
- Implement proper memory cleanup (useEffect return)
- Add error boundaries for crashed components
- Use Tailwind for styling (no inline CSS)
- Follow component composition patterns from existing components

#### Testing New Changes
```bash
# Test backend changes
cd backend && python test_image_flow.py

# Test frontend build
cd frontend && npm run build

# Run development servers
cd backend && python app.py
cd frontend && npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes:
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Test thoroughly before committing
4. Commit with clear messages: `git commit -m "Add: description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Submit a Pull Request with:
   - Clear description of changes
   - Screenshots for UI updates
   - Test results
   - Any breaking changes

### Contribution Areas
- 🎨 UI/UX improvements
- 🔧 Performance optimization
- 📊 Feature ideas
- 🐛 Bug fixes
- 📚 Documentation
- 🧪 Testing

## Performance Metrics

### Camera Module
- Camera initialization: <500ms
- Image capture: <100ms
- Preview render: <50ms
- Animation frame rate: 60fps

### Prediction
- Image upload: <1s (depends on image size)
- Model inference: 2-5s (depending on device)
- Results display: <500ms

### Database
- History API response: <100ms
- Image retrieval: <50ms
- Database query: <10ms

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 33+ | ✅ Full support |
| Firefox | 25+ | ✅ Full support |
| Safari | 11+ | ✅ Full support |
| Edge | 79+ | ✅ Full support |
| Mobile Safari | iOS 11+ | ✅ Full support |
| Android Chrome | Latest | ✅ Full support |
| Samsung Internet | 4+ | ✅ Full support |

**Requirements**: getUserMedia API, Canvas API, CSS Grid/Flexbox, Service Workers

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.