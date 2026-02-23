# 🏠 Bangalore House Price Predictor

A full-stack machine learning web application that predicts house prices in Bangalore based on various features like location, size, number of bedrooms, and bathrooms.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Model Details](#model-details)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project implements a machine learning model to predict house prices in Bangalore, India. It uses historical housing data to train a regression model that considers factors such as location, square footage, number of bedrooms, and bathrooms to provide accurate price estimates.

The application consists of:
- **Backend**: Flask REST API serving the ML model
- **Frontend**: Modern web interface for user interaction
- **ML Model**: Trained regression model for price prediction

## ✨ Features

- 🔍 **Intelligent Price Prediction**: Accurate house price estimates based on multiple features
- 📍 **Location-Based Analysis**: Considers various localities in Bangalore
- 🏡 **Flexible Input Options**: Support for different property configurations
- 📊 **Data-Driven Insights**: Built on comprehensive real estate data
- 🚀 **Fast Response Time**: Optimized API for quick predictions
- 💻 **User-Friendly Interface**: Clean and intuitive web UI
- 📱 **Responsive Design**: Works seamlessly across devices

## 🛠 Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework for API
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Pickle**: Model serialization

### Frontend
- **TypeScript**: Type-safe JavaScript
- **React/Next.js**: UI framework
- **CSS3**: Styling
- **HTML5**: Structure

### Database
- **PostgreSQL**: Data storage (PL/pgSQL functions)

### DevOps
- **Bash/Batch Scripts**: Automation
- **Git**: Version control

## 📁 Project Structure

```
Bangalore-House-Price-Predictor/
├── Bengluru_house_price_prediction/    # ML model and notebooks
│   ├── model/                           # Trained model files
│   ├── data/                            # Dataset
│   └── notebooks/                       # Jupyter notebooks
├── bengaluru-house-backend/             # Flask backend API
│   ├── app.py                           # Main application file
│   ├── server.py                        # Server configuration
│   ├── util.py                          # Utility functions
│   ├── requirements.txt                 # Python dependencies
│   └── artifacts/                       # Model artifacts
├── frontend/                            # React/TypeScript frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── run-all.sh                           # Linux/Mac startup script
├── run-all.bat                          # Windows startup script
├── DEPLOYMENT.md                        # Deployment guide
└── README.md                            # Project documentation
```

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14+ and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/manavkonde/Bangalore-House-Price-Predictor-.git
cd Bangalore-House-Price-Predictor-
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd bengaluru-house-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Linux/Mac**: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 💻 Usage

### Quick Start (All Services)

**Linux/Mac:**
```bash
chmod +x run-all.sh
./run-all.sh
```

**Windows:**
```bash
run-all.bat
```

### Manual Start

**Backend:**
```bash
cd bengaluru-house-backend
python server.py
```
The API will be available at `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
The web app will be available at `http://localhost:3000`

### Making Predictions

1. Open your browser and navigate to `http://localhost:3000`
2. Enter the property details:
   - Location
   - Total square feet
   - Number of bedrooms (BHK)
   - Number of bathrooms
3. Click "Predict Price"
4. View the estimated price

## 🤖 Model Details

### Dataset
The model is trained on Bangalore house price data containing:
- Location/Area
- Size (BHK)
- Total Square Feet
- Number of Bathrooms
- Price

### Preprocessing Steps
1. **Data Cleaning**: Handling missing values and outliers
2. **Feature Engineering**: Creating relevant features from raw data
3. **Dimensionality Reduction**: Grouping rare locations
4. **Outlier Detection**: Removing anomalous data points
5. **Encoding**: Converting categorical variables to numerical

### Model Algorithm
- **Algorithm**: Linear Regression / Ridge Regression / Lasso Regression
- **Evaluation Metrics**: 
  - Mean Absolute Error (MAE)
  - Mean Squared Error (MSE)
  - R² Score
- **Cross-Validation**: K-fold cross-validation for robust evaluation

### Performance
The model achieves competitive performance with:
- Training Score: ~85-90% R²
- Test Score: ~80-85% R²
- Low prediction error on validation set

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get Locations
```http
GET /get_location_names
```
Returns list of all available locations in Bangalore.

**Response:**
```json
{
  "locations": ["Electronic City", "Whitefield", "HSR Layout", ...]
}
```

#### 2. Predict Price
```http
POST /predict_home_price
```

**Request Body:**
```json
{
  "location": "Electronic City",
  "total_sqft": 1500,
  "bhk": 3,
  "bath": 2
}
```

**Response:**
```json
{
  "estimated_price": 85.5
}
```

## 🌐 Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions on:
- Cloud platforms (AWS, GCP, Azure)
- Docker containerization
- Production best practices

### Quick Deploy Options

**Docker:**
```bash
docker build -t bangalore-house-predictor .
docker run -p 5000:5000 bangalore-house-predictor
```

**Heroku:**
```bash
heroku create bangalore-house-predictor
git push heroku main
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines
- Follow PEP 8 for Python code
- Use ESLint for TypeScript/JavaScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Known Issues & TODO

See [TODO.md](TODO.md) for current tasks and known issues.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manav Konde**
- GitHub: [@manavkonde](https://github.com/manavkonde)

## 🙏 Acknowledgments

- Dataset sourced from Kaggle's Bangalore House Price dataset
- Inspired by real estate analysis projects
- Built with modern ML and web development best practices

## 📧 Contact

For questions or feedback, please open an issue on GitHub or reach out via email.

---

**Note**: This is an educational project for learning machine learning and full-stack development. Price predictions should not be used for actual real estate transactions without proper validation.

## 🔮 Future Enhancements

- [ ] Add more ML models (Random Forest, XGBoost)
- [ ] Implement model comparison dashboard
- [ ] Add price trend visualization
- [ ] Include more features (amenities, age of property)
- [ ] Mobile application (React Native)
- [ ] Real-time data updates
- [ ] User authentication and saved searches
- [ ] Advanced analytics and insights

---

⭐ If you find this project helpful, please give it a star!
