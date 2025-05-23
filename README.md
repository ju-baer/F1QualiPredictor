# F1 Qualifying Predictor 🏎️

A Python-based machine learning application that predicts Formula 1 qualifying results using historical data from the FastF1 API, machine learning models, and performance heuristics.

![F1 Qualifying Predictor](https://i.imgur.com/XYZ123.png)

## 🏁 Features

- **Data Collection**: Fetches qualifying data from the FastF1 API
- **Machine Learning**: Predicts Q3 times using various regression models
- **Performance Factors**: Incorporates driver and team-specific adjustments
- **Interactive Dashboard**: Visualizes predictions and historical data with F1-inspired design
- **Hybrid Prediction**: Combines ML and heuristic approaches for accurate results

## 🚀 Quick Start

1. Install the required dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the Streamlit application:
\`\`\`bash
streamlit run main.py
\`\`\`

3. In the web interface:
   - Select a circuit from the sidebar
   - Choose your model settings
   - Set weather conditions
   - Click "GENERATE PREDICTIONS"

## 📊 Interface Features

The application provides a vibrant, F1-themed interface with:

- **Predictions Tab**: View qualifying predictions with team-colored visualizations
- **Data Analysis Tab**: Explore historical qualifying data and model performance
- **About Tab**: Learn about the application and how it works

## 🔧 Project Structure

\`\`\`
F1QualiPredictor/
├── data/
│   └── cache/               # FastF1 cache
├── src/
│   ├── data_fetching.py     # FastF1 API interactions
│   ├── preprocess.py        # Data cleaning and feature engineering
│   ├── model.py             # ML model training and evaluation
│   └── predictors.py        # Prediction logic with performance factors
├── app/
│   └── ui.py                # Streamlit interface with F1 styling
├── models/                  # Saved models
├── main.py                  # Entry point
├── requirements.txt         # Dependencies
└── README.md                # Documentation
\`\`\`

## 🏎️ Prediction Features

The application offers several prediction options:

- **Hybrid Model**: Combines machine learning predictions with performance factors
- **ML Only**: Uses only machine learning for predictions
- **Performance Factors Only**: Uses only team and driver performance factors

You can also adjust:
- ML algorithm (Linear Regression, Ridge, Random Forest, Gradient Boosting)
- Weather conditions (Dry, Damp, Wet)
- ML weight vs. performance factors

## 📈 Data Analysis

The application provides several data analysis features:
- Historical qualifying data visualization
- Circuit performance comparison
- Driver and team performance analysis
- Model performance metrics and visualizations

## 🛠️ Technical Details

### Data Collection

The application uses the FastF1 API to fetch qualifying data from past F1 races. The data includes:
- Driver name and team
- Q1, Q2, and Q3 lap times
- Circuit information
- Session timestamps

### Machine Learning Models

Several regression models are available:
- Linear Regression
- Ridge Regression
- Random Forest
- Gradient Boosting

### Performance Factors

The application incorporates driver and team-specific performance factors to adjust predictions:
- Team performance multipliers
- Driver performance multipliers
- Circuit-specific adjustments
- Weather condition factors

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [FastF1](https://github.com/theOehrly/Fast-F1) for providing access to F1 data
- [Streamlit](https://streamlit.io/) for the interactive web interface
- Formula 1 for the inspiration
