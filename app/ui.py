"""
Streamlit UI Module - Enhanced F1-themed interface
"""
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import os
import time
import base64
from PIL import Image
import io

from src.data_fetching import DataFetcher
from src.preprocess import DataProcessor
from src.model import QualifyingModel
from src.predictors import HybridPredictor

# Define F1 team colors for consistent visualization
TEAM_COLORS = {
    'Red Bull Racing': '#0600EF',
    'Ferrari': '#DC0000',
    'Mercedes': '#00D2BE',
    'McLaren': '#FF8700',
    'Aston Martin': '#006F62',
    'RB': '#0090FF',
    'Williams': '#005AFF',
    'Haas F1 Team': '#FFFFFF',
    'Kick Sauber': '#900000',
    'Alpine': '#0090FF'
}

# F1 color palette
F1_COLORS = {
    'red': '#E10600',
    'black': '#121212',
    'white': '#FFFFFF',
    'gray': '#38383F',
    'light_gray': '#949498',
    'yellow': '#FFF200',
    'blue': '#0090FF'
}

def add_bg_from_url(url):
    """Add background image from URL"""
    st.markdown(
        f"""
        <style>
        .stApp {{
            background-image: url("{url}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }}
        .block-container {{
            background-color: rgba(18, 18, 18, 0.85);
            padding: 2rem;
            border-radius: 10px;
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

def set_custom_theme():
    """Set custom F1-themed styling"""
    st.markdown(
        f"""
        <style>
        /* Main theme colors */
        :root {{
            --primary-color: {F1_COLORS['red']};
            --background-color: {F1_COLORS['black']};
            --secondary-background-color: {F1_COLORS['gray']};
            --text-color: {F1_COLORS['white']};
            --font: 'Formula1', sans-serif;
        }}
        
        /* Headers */
        h1, h2, h3, h4, h5, h6 {{
            color: {F1_COLORS['red']} !important;
            font-family: var(--font);
            font-weight: 700 !important;
        }}
        
        /* Buttons */
        .stButton > button {{
            background-color: {F1_COLORS['red']};
            color: {F1_COLORS['white']};
            border: none;
            border-radius: 5px;
            padding: 0.5rem 1rem;
            font-weight: bold;
            transition: all 0.3s;
        }}
        
        .stButton > button:hover {{
            background-color: #FF0000;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(225, 6, 0, 0.3);
        }}
        
        /* Sidebar */
        .css-1d391kg {{
            background-color: {F1_COLORS['gray']};
        }}
        
        /* Tabs */
        .stTabs [data-baseweb="tab-list"] {{
            gap: 1px;
        }}
        
        .stTabs [data-baseweb="tab"] {{
            background-color: {F1_COLORS['gray']};
            color: {F1_COLORS['white']};
            border-radius: 5px 5px 0 0;
            padding: 10px 20px;
            font-weight: bold;
        }}
        
        .stTabs [aria-selected="true"] {{
            background-color: {F1_COLORS['red']};
            color: {F1_COLORS['white']};
        }}
        
        /* Dataframes */
        .dataframe {{
            font-family: var(--font);
        }}
        
        /* Metric containers */
        [data-testid="stMetricValue"] {{
            font-size: 2rem !important;
            color: {F1_COLORS['red']} !important;
            font-weight: bold !important;
        }}
        
        /* Card-like containers */
        .prediction-card {{
            background-color: {F1_COLORS['gray']};
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 5px solid {F1_COLORS['red']};
        }}
        
        /* Loader */
        .stSpinner > div > div {{
            border-top-color: {F1_COLORS['red']} !important;
        }}
        
        /* Scrollbar */
        ::-webkit-scrollbar {{
            width: 10px;
            background-color: {F1_COLORS['black']};
        }}
        
        ::-webkit-scrollbar-thumb {{
            background-color: {F1_COLORS['red']};
            border-radius: 5px;
        }}
        
        /* Tooltip */
        div[data-baseweb="tooltip"] {{
            background-color: {F1_COLORS['black']};
            border: 1px solid {F1_COLORS['red']};
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

def create_f1_logo():
    """Create F1 logo header"""
    st.markdown(
        f"""
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="
                background-color: {F1_COLORS['red']}; 
                color: white; 
                font-weight: bold; 
                padding: 5px 15px; 
                border-radius: 5px;
                font-size: 24px;
                margin-right: 10px;
            ">F1</div>
            <h1 style="margin: 0; color: white !important;">Qualifying Predictor</h1>
        </div>
        """,
        unsafe_allow_html=True
    )

def run_app():
    """Main function to run the Streamlit app"""
    # Set page config
    st.set_page_config(
        page_title="F1 Qualifying Predictor",
        page_icon="🏎️",
        layout="wide",
        initial_sidebar_state="expanded",
        menu_items={
            'About': "# F1 Qualifying Predictor\nPredicting F1 qualifying results using ML and heuristics"
        }
    )
    
    # Add F1 background and styling
    add_bg_from_url("https://wallpapercave.com/wp/wp8753873.jpg")
    set_custom_theme()
    
    # Create F1-style header
    create_f1_logo()
    
    # Set up the sidebar
    setup_sidebar()
    
    # Create tabs for different sections
    tab1, tab2, tab3 = st.tabs(["🏁 Predictions", "📊 Data Analysis", "ℹ️ About"])
    
    with tab1:
        show_predictions_tab()
    
    with tab2:
        show_data_analysis_tab()
    
    with tab3:
        show_about_tab()

def setup_sidebar():
    """Set up the sidebar with controls"""
    st.sidebar.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['red']}; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 20px;
            text-align: center;
        ">
            <h3 style="margin: 0; color: white !important;">Control Panel</h3>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Circuit selection
    circuits = [
        "Bahrain", "Saudi Arabia", "Australia", "Japan", "China", 
        "Miami", "Emilia Romagna", "Monaco", "Canada", "Spain", 
        "Austria", "Great Britain", "Hungary", "Belgium", "Netherlands", 
        "Italy", "Azerbaijan", "Singapore", "United States", "Mexico", 
        "Brazil", "Las Vegas", "Qatar", "Abu Dhabi"
    ]
    
    st.sidebar.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 10px;
        ">
            <h4 style="margin: 0; color: white !important;">Circuit</h4>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    selected_circuit = st.sidebar.selectbox(
        "Select Circuit",
        circuits,
        index=circuits.index("Japan"),
        key="circuit_selector"
    )
    
    # Model settings
    st.sidebar.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 10px;
            margin-top: 20px;
        ">
            <h4 style="margin: 0; color: white !important;">Model Settings</h4>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    model_type = st.sidebar.selectbox(
        "Prediction Model",
        ["Hybrid (ML + Performance)", "ML Only", "Performance Factors Only"],
        index=0,
        key="model_type"
    )
    
    ml_model_type = st.sidebar.selectbox(
        "ML Algorithm",
        ["Linear Regression", "Ridge Regression", "Random Forest", "Gradient Boosting"],
        index=0,
        key="ml_model"
    )
    
    # Performance factor controls
    st.sidebar.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 10px;
            margin-top: 20px;
        ">
            <h4 style="margin: 0; color: white !important;">Performance Factors</h4>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    use_performance = st.sidebar.checkbox("Use Performance Factors", value=True, key="use_performance")
    
    if use_performance:
        ml_weight = st.sidebar.slider(
            "ML Model Weight",
            min_value=0.0,
            max_value=1.0,
            value=0.7,
            step=0.1,
            help="Weight given to ML predictions vs. performance factors",
            key="ml_weight"
        )
    else:
        ml_weight = 1.0
    
    # Weather conditions
    st.sidebar.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 10px;
            margin-top: 20px;
        ">
            <h4 style="margin: 0; color: white !important;">Track Conditions</h4>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    weather = st.sidebar.selectbox(
        "Weather",
        ["Dry", "Damp", "Wet"],
        index=0,
        key="weather"
    )
    
    # Generate button
    st.sidebar.markdown("<br>", unsafe_allow_html=True)
    generate_button = st.sidebar.button(
        "GENERATE PREDICTIONS",
        use_container_width=True,
        key="generate_button"
    )
    
    # Data refresh button
    st.sidebar.markdown("<br>", unsafe_allow_html=True)
    if st.sidebar.button("Refresh Data", use_container_width=True, key="refresh_button"):
        st.session_state['data_refreshed'] = True
        st.sidebar.success("Data refreshed!")
    
    # Save settings to session state
    st.session_state['selected_circuit'] = selected_circuit
    st.session_state['model_type'] = model_type
    st.session_state['ml_model_type'] = ml_model_type
    st.session_state['use_performance'] = use_performance
    st.session_state['ml_weight'] = ml_weight
    st.session_state['weather'] = weather.lower()
    st.session_state['generate_predictions'] = generate_button

def show_predictions_tab():
    """Show the predictions tab content"""
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            border-left: 5px solid {F1_COLORS['red']};
        ">
            <h2 style="margin: 0; color: white !important;">Qualifying Predictions</h2>
            <p style="color: {F1_COLORS['light_gray']};">
                Predict Q3 qualifying results for the {st.session_state.get('selected_circuit', 'selected')} Grand Prix
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Check if generate button was clicked
    if st.session_state.get('generate_predictions', False):
        with st.spinner("🏎️ Generating predictions..."):
            # Add a small delay for visual effect
            time.sleep(1)
            
            # Initialize components
            data_fetcher = DataFetcher()
            data_processor = DataProcessor()
            
            # Map ML model type to internal name
            ml_model_map = {
                "Linear Regression": "linear",
                "Ridge Regression": "ridge",
                "Random Forest": "rf",
                "Gradient Boosting": "gbm"
            }
            
            ml_model_name = ml_model_map.get(st.session_state['ml_model_type'], "linear")
            model = QualifyingModel(model_type=ml_model_name)
            
            # Fetch historical data
            historical_data = data_fetcher.fetch_recent_seasons(verbose=False)
            
            if historical_data is not None:
                # Clean and process data
                cleaned_data = data_processor.clean_data(historical_data)
                engineered_data = data_processor.engineer_features(cleaned_data)
                
                # Prepare features for training
                X, y, metadata = data_processor.prepare_features(engineered_data)
                
                # Train the model
                model.train(X, y)
                
                # Initialize predictor
                predictor = HybridPredictor(ml_model=model)
                
                # Make predictions based on selected model type
                if st.session_state['model_type'] == "ML Only":
                    # For ML-only, we need Q1 and Q2 times which we don't have for future races
                    # So we'll use performance factors but with 100% ML weight
                    predictions = predictor.predict_future_race(
                        st.session_state['selected_circuit'], 
                        weather=st.session_state['weather']
                    )
                elif st.session_state['model_type'] == "Performance Factors Only":
                    predictions = predictor.predict_future_race(
                        st.session_state['selected_circuit'], 
                        weather=st.session_state['weather']
                    )
                else:  # Hybrid
                    predictions = predictor.predict_future_race(
                        st.session_state['selected_circuit'], 
                        weather=st.session_state['weather']
                    )
                
                # Display predictions
                display_predictions(predictions, st.session_state['selected_circuit'])
            else:
                st.error("Failed to fetch historical data. Please try again.")
    else:
        # Show placeholder content when no predictions have been generated
        col1, col2 = st.columns([3, 2])
        
        with col1:
            st.markdown(
                f"""
                <div style="
                    background-color: {F1_COLORS['gray']}; 
                    padding: 20px; 
                    border-radius: 10px; 
                    height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                ">
                    <h3 style="color: white !important;">Ready to predict qualifying results?</h3>
                    <p style="color: {F1_COLORS['light_gray']};">
                        Select a circuit and model settings in the sidebar, then click "GENERATE PREDICTIONS"
                    </p>
                    <div style="
                        background-color: {F1_COLORS['red']}; 
                        color: white; 
                        padding: 10px 20px; 
                        border-radius: 5px;
                        margin-top: 20px;
                        font-weight: bold;
                    ">
                        Waiting for input...
                    </div>
                </div>
                """,
                unsafe_allow_html=True
            )
        
        with col2:
            st.markdown(
                f"""
                <div style="
                    background-color: {F1_COLORS['gray']}; 
                    padding: 20px; 
                    border-radius: 10px; 
                    height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                ">
                    <h4 style="color: white !important;">Current Settings</h4>
                    <ul style="color: {F1_COLORS['light_gray']}; text-align: left;">
                        <li>Circuit: {st.session_state.get('selected_circuit', 'Japan')}</li>
                        <li>Model: {st.session_state.get('model_type', 'Hybrid')}</li>
                        <li>Algorithm: {st.session_state.get('ml_model_type', 'Linear Regression')}</li>
                        <li>Weather: {st.session_state.get('weather', 'dry').capitalize()}</li>
                    </ul>
                </div>
                """,
                unsafe_allow_html=True
            )

def display_predictions(predictions, circuit):
    """Display the qualifying predictions with F1 styling"""
    if predictions is None or predictions.empty:
        st.error("No predictions available.")
        return
    
    # Format the predictions for display
    display_df = predictions[['Position', 'Driver', 'Team', 'Predicted_Q3']].copy()
    
    # Format the predicted time
    display_df['Predicted Time'] = display_df['Predicted_Q3'].apply(
        lambda x: f"{int(x // 60):01d}:{x % 60:06.3f}" if pd.notnull(x) else "N/A"
    )
    
    # Calculate gaps
    pole_time = display_df['Predicted_Q3'].min()
    display_df['Gap to Pole'] = display_df['Predicted_Q3'] - pole_time
    display_df['Gap to Pole'] = display_df['Gap to Pole'].apply(
        lambda x: f"+{x:.3f}s" if x > 0 else "POLE"
    )
    
    # Drop the raw predicted time
    display_df = display_df.drop('Predicted_Q3', axis=1)
    
    # Create a header for the results
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['red']}; 
            padding: 10px 20px; 
            border-radius: 5px; 
            margin-bottom: 20px;
            text-align: center;
        ">
            <h2 style="margin: 0; color: white !important;">{circuit} Grand Prix Qualifying Prediction</h2>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Display top 3 in a special way
    col1, col2, col3 = st.columns(3)
    
    # Get top 3 drivers
    top3 = display_df.head(3).copy()
    
    # P1 - Pole Position
    with col1:
        driver = top3.iloc[0]
        team_color = TEAM_COLORS.get(driver['Team'], '#FFFFFF')
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px;
                border-top: 5px solid gold;
                text-align: center;
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            ">
                <div style="
                    background-color: gold; 
                    color: black; 
                    width: 40px; 
                    height: 40px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    margin: 0 auto 10px auto;
                    font-weight: bold;
                    font-size: 20px;
                ">P1</div>
                <h3 style="margin: 0; color: white !important;">{driver['Driver']}</h3>
                <div style="
                    background-color: {team_color}; 
                    padding: 5px; 
                    border-radius: 5px;
                    margin: 10px 0;
                    color: {'black' if team_color == '#FFFFFF' else 'white'};
                ">{driver['Team']}</div>
                <p style="font-size: 24px; font-weight: bold; margin: 0;">{driver['Predicted Time']}</p>
                <p style="color: gold; font-weight: bold;">{driver['Gap to Pole']}</p>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    # P2
    with col2:
        if len(top3) > 1:
            driver = top3.iloc[1]
            team_color = TEAM_COLORS.get(driver['Team'], '#FFFFFF')
            st.markdown(
                f"""
                <div style="
                    background-color: {F1_COLORS['gray']}; 
                    padding: 15px; 
                    border-radius: 10px;
                    border-top: 5px solid silver;
                    text-align: center;
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                ">
                    <div style="
                        background-color: silver; 
                        color: black; 
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        margin: 0 auto 10px auto;
                        font-weight: bold;
                        font-size: 20px;
                    ">P2</div>
                    <h3 style="margin: 0; color: white !important;">{driver['Driver']}</h3>
                    <div style="
                        background-color: {team_color}; 
                        padding: 5px; 
                        border-radius: 5px;
                        margin: 10px 0;
                        color: {'black' if team_color == '#FFFFFF' else 'white'};
                    ">{driver['Team']}</div>
                    <p style="font-size: 24px; font-weight: bold; margin: 0;">{driver['Predicted Time']}</p>
                    <p style="color: silver; font-weight: bold;">{driver['Gap to Pole']}</p>
                </div>
                """,
                unsafe_allow_html=True
            )
    
    # P3
    with col3:
        if len(top3) > 2:
            driver = top3.iloc[2]
            team_color = TEAM_COLORS.get(driver['Team'], '#FFFFFF')
            st.markdown(
                f"""
                <div style="
                    background-color: {F1_COLORS['gray']}; 
                    padding: 15px; 
                    border-radius: 10px;
                    border-top: 5px solid #CD7F32;
                    text-align: center;
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                ">
                    <div style="
                        background-color: #CD7F32; 
                        color: black; 
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        margin: 0 auto 10px auto;
                        font-weight: bold;
                        font-size: 20px;
                    ">P3</div>
                    <h3 style="margin: 0; color: white !important;">{driver['Driver']}</h3>
                    <div style="
                        background-color: {team_color}; 
                        padding: 5px; 
                        border-radius: 5px;
                        margin: 10px 0;
                        color: {'black' if team_color == '#FFFFFF' else 'white'};
                    ">{driver['Team']}</div>
                    <p style="font-size: 24px; font-weight: bold; margin: 0;">{driver['Predicted Time']}</p>
                    <p style="color: #CD7F32; font-weight: bold;">{driver['Gap to Pole']}</p>
                </div>
                """,
                unsafe_allow_html=True
            )
    
    # Display the rest of the grid
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
        ">
            <h3 style="margin: 0 0 15px 0; color: white !important;">Full Grid</h3>
        """,
        unsafe_allow_html=True
    )
    
    # Display the full grid as a styled table
    rest_of_grid = display_df.copy()
    
    # Create a custom styled table
    table_html = f"""
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
            <tr style="background-color: {F1_COLORS['red']}; color: white;">
                <th style="padding: 10px; text-align: center;">Position</th>
                <th style="padding: 10px; text-align: left;">Driver</th>
                <th style="padding: 10px; text-align: left;">Team</th>
                <th style="padding: 10px; text-align: center;">Predicted Time</th>
                <th style="padding: 10px; text-align: center;">Gap to Pole</th>
            </tr>
        </thead>
        <tbody>
    """
    
    for idx, row in rest_of_grid.iterrows():
        team_color = TEAM_COLORS.get(row['Team'], '#FFFFFF')
        position = int(row['Position'])
        
        # Alternate row colors and highlight top 3
        if position == 1:
            bg_color = "rgba(255, 215, 0, 0.2)"  # Gold tint
        elif position == 2:
            bg_color = "rgba(192, 192, 192, 0.2)"  # Silver tint
        elif position == 3:
            bg_color = "rgba(205, 127, 50, 0.2)"  # Bronze tint
        elif position % 2 == 0:
            bg_color = "rgba(56, 56, 63, 0.7)"  # Darker gray
        else:
            bg_color = "rgba(56, 56, 63, 0.5)"  # Lighter gray
        
        table_html += f"""
        <tr style="background-color: {bg_color};">
            <td style="padding: 10px; text-align: center; font-weight: bold; color: white;">{position}</td>
            <td style="padding: 10px; text-align: left; color: white;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 5px; height: 20px; background-color: {team_color}; margin-right: 10px;"></div>
                    {row['Driver']}
                </div>
            </td>
            <td style="padding: 10px; text-align: left; color: white;">{row['Team']}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; color: white;">{row['Predicted Time']}</td>
            <td style="padding: 10px; text-align: center; color: {'gold' if position == 1 else 'white'}; font-weight: {'bold' if position == 1 else 'normal'};">
                {row['Gap to Pole']}
            </td>
        </tr>
        """
    
    table_html += """
        </tbody>
    </table>
    """
    
    st.markdown(table_html, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Create visualizations
    create_prediction_visualizations(predictions, circuit)

def create_prediction_visualizations(predictions, circuit):
    """Create visualizations for the predictions with F1 styling"""
    if predictions is None or predictions.empty:
        return
    
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
        ">
            <h3 style="margin: 0 0 15px 0; color: white !important;">Visualization</h3>
        """,
        unsafe_allow_html=True
    )
    
    # Calculate pole time and gaps
    pole_time = predictions['Predicted_Q3'].min()
    predictions['Gap_to_Pole'] = predictions['Predicted_Q3'] - pole_time
    
    # Create a bar chart of gaps to pole
    fig = px.bar(
        predictions,
        x='Driver',
        y='Gap_to_Pole',
        color='Team',
        title=f'Predicted Gap to Pole - {circuit} GP',
        labels={'Gap_to_Pole': 'Gap to Pole (seconds)', 'Driver': 'Driver'},
        color_discrete_map=TEAM_COLORS
    )
    
    # Update layout
    fig.update_layout(
        xaxis_title='Driver',
        yaxis_title='Gap to Pole (seconds)',
        xaxis={'categoryorder': 'array', 'categoryarray': predictions.sort_values('Predicted_Q3')['Driver']},
        plot_bgcolor='#121212',
        paper_bgcolor='#121212',
        font=dict(color='white'),
        title_font_color='white',
        legend_title_font_color='white',
        title_x=0.5,
        title_font_size=20,
        margin=dict(t=50, b=50, l=50, r=50)
    )
    
    # Add a horizontal line at zero (pole position)
    fig.add_shape(
        type="line",
        x0=-0.5,
        y0=0,
        x1=len(predictions) - 0.5,
        y1=0,
        line=dict(color="red", width=2, dash="dash"),
    )
    
    # Add annotations for the top 3
    top3 = predictions.sort_values('Predicted_Q3').head(3)
    for i, (_, row) in enumerate(top3.iterrows()):
        medal_colors = ['gold', 'silver', '#CD7F32']
        fig.add_annotation(
            x=row['Driver'],
            y=row['Gap_to_Pole'],
            text=f"P{i+1}",
            showarrow=True,
            arrowhead=2,
            arrowsize=1,
            arrowwidth=2,
            arrowcolor=medal_colors[i],
            font=dict(color=medal_colors[i], size=14),
            bgcolor="#121212",
            bordercolor=medal_colors[i],
            borderwidth=2,
            borderpad=4,
            opacity=0.8
        )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Create a track position visualization
    create_track_visualization(predictions, circuit)
    
    st.markdown("</div>", unsafe_allow_html=True)

def create_track_visualization(predictions, circuit):
    """Create a track position visualization"""
    if predictions is None or predictions.empty:
        return
    
    # Sort by position
    grid_data = predictions.sort_values('Predicted_Q3').copy()
    
    # Create a track-like visualization
    st.markdown(
        f"""
        <h4 style="margin: 20px 0 10px 0; color: white !important;">Track Position Visualization</h4>
        <div style="
            background-color: #1E1E1E; 
            padding: 20px; 
            border-radius: 10px;
            border: 2px solid {F1_COLORS['red']};
            position: relative;
            height: 300px;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: {F1_COLORS['red']};
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-weight: bold;
            ">{circuit} GP</div>
            
            <!-- Track outline -->
            <div style="
                position: absolute;
                top: 50px;
                left: 50px;
                right: 50px;
                bottom: 50px;
                border: 5px dashed white;
                border-radius: 100px;
                opacity: 0.3;
            "></div>
            
            <!-- Start/Finish line -->
            <div style="
                position: absolute;
                top: 50px;
                left: 50%;
                width: 10px;
                height: 30px;
                background: repeating-linear-gradient(
                    45deg,
                    black,
                    black 5px,
                    white 5px,
                    white 10px
                );
                transform: translateX(-50%);
            "></div>
        """,
        unsafe_allow_html=True
    )
    
    # Place cars on the track
    for i, (_, row) in enumerate(grid_data.iterrows()):
        position = int(row['Position'])
        team_color = TEAM_COLORS.get(row['Team'], '#FFFFFF')
        
        # Calculate position on the track (circular path)
        angle = (i / len(grid_data)) * 360
        radius = 100
        center_x = 50  # % from left
        center_y = 50  # % from top
        
        # Convert to cartesian coordinates
        x = center_x + radius * np.cos(np.radians(angle))
        y = center_y + radius * np.sin(np.radians(angle))
        
        # Add car representation
        st.markdown(
            f"""
            <div style="
                position: absolute;
                top: {y}%;
                left: {x}%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 15px;
                background-color: {team_color};
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: {'black' if team_color == '#FFFFFF' else 'white'};
                font-weight: bold;
                font-size: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            ">{position}</div>
            
            <!-- Driver label -->
            <div style="
                position: absolute;
                top: {y + 5}%;
                left: {x}%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 10px;
                text-shadow: 1px 1px 2px black;
                white-space: nowrap;
            ">{row['Driver'].split(' ')[-1]}</div>
            """,
            unsafe_allow_html=True
        )
    
    st.markdown("</div>", unsafe_allow_html=True)

def show_data_analysis_tab():
    """Show the data analysis tab content"""
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            border-left: 5px solid {F1_COLORS['blue']};
        ">
            <h2 style="margin: 0; color: white !important;">Data Analysis</h2>
            <p style="color: {F1_COLORS['light_gray']};">
                Explore historical qualifying data and model performance
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Create subtabs
    data_tab1, data_tab2 = st.tabs(["Historical Data", "Model Performance"])
    
    with data_tab1:
        show_historical_data_subtab()
    
    with data_tab2:
        show_model_performance_subtab()

def show_historical_data_subtab():
    """Show historical data analysis"""
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
        ">
            <h3 style="margin: 0; color: white !important;">Historical Qualifying Data</h3>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Fetch data button
    if st.button("Fetch Historical Data", key="fetch_historical"):
        with st.spinner("🏎️ Fetching data from FastF1 API..."):
            # Add a small delay for visual effect
            time.sleep(1)
            
            data_fetcher = DataFetcher()
            historical_data = data_fetcher.fetch_recent_seasons()
            
            if historical_data is not None:
                # Store in session state
                st.session_state['historical_data'] = historical_data
                
                # Display data summary
                st.success(f"Successfully fetched data for {len(historical_data)} qualifying sessions.")
                
                # Process and display the data
                data_processor = DataProcessor()
                cleaned_data = data_processor.clean_data(historical_data)
                
                # Display summary statistics
                display_historical_data_summary(cleaned_data)
            else:
                st.error("Failed to fetch historical data. Please try again.")
    else:
        # Show placeholder content
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 20px; 
                border-radius: 10px; 
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            ">
                <h4 style="color: white !important;">Click "Fetch Historical Data" to load qualifying data</h4>
                <p style="color: {F1_COLORS['light_gray']};">
                    This will fetch qualifying data from recent F1 seasons using the FastF1 API
                </p>
            </div>
            """,
            unsafe_allow_html=True
        )

def display_historical_data_summary(data):
    """Display summary of historical data with F1 styling"""
    if data is None or data.empty:
        st.warning("No historical data available.")
        return
    
    # Display basic info
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px;
                text-align: center;
            ">
                <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                    {data['Circuit'].nunique()}
                </h1>
                <p style="color: white; margin: 0;">Qualifying Sessions</p>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    with col2:
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px;
                text-align: center;
            ">
                <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                    {data['Driver'].nunique()}
                </h1>
                <p style="color: white; margin: 0;">Drivers</p>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    with col3:
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px;
                text-align: center;
            ">
                <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                    {data['Team'].nunique()}
                </h1>
                <p style="color: white; margin: 0;">Teams</p>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    # Create tabs for different views
    st.markdown("<br>", unsafe_allow_html=True)
    data_tab1, data_tab2, data_tab3 = st.tabs(["By Circuit", "By Driver", "By Team"])
    
    with data_tab1:
        # Circuit performance
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px; 
                margin-bottom: 20px;
            ">
                <h4 style="margin: 0; color: white !important;">Circuit Performance</h4>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        # Group by circuit
        circuit_data = data.groupby('Circuit')['Q3_sec'].mean().reset_index()
        circuit_data = circuit_data.sort_values('Q3_sec')
        
        # Create bar chart
        fig = px.bar(
            circuit_data,
            x='Circuit',
            y='Q3_sec',
            title='Average Q3 Time by Circuit',
            labels={'Q3_sec': 'Average Q3 Time (seconds)', 'Circuit': 'Circuit'},
            color_discrete_sequence=[F1_COLORS['blue']]
        )
        
        # Update layout
        fig.update_layout(
            xaxis_title='Circuit',
            yaxis_title='Average Q3 Time (seconds)',
            plot_bgcolor='#121212',
            paper_bgcolor='#121212',
            font=dict(color='white'),
            title_font_color='white',
            title_x=0.5
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with data_tab2:
        # Driver performance
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px; 
                margin-bottom: 20px;
            ">
                <h4 style="margin: 0; color: white !important;">Driver Performance</h4>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        # Filter for drivers with at least 3 Q3 appearances
        driver_counts = data.groupby('Driver')['Q3_sec'].count()
        valid_drivers = driver_counts[driver_counts >= 3].index
        
        driver_data = data[data['Driver'].isin(valid_drivers)]
        driver_avg = driver_data.groupby('Driver')['Q3_sec'].mean().reset_index()
        driver_avg = driver_avg.sort_values('Q3_sec')
        
        # Create bar chart
        fig = px.bar(
            driver_avg,
            x='Driver',
            y='Q3_sec',
            title='Average Q3 Time by Driver (min. 3 appearances)',
            labels={'Q3_sec': 'Average Q3 Time (seconds)', 'Driver': 'Driver'},
            color_discrete_sequence=[F1_COLORS['red']]
        )
        
        # Update layout
        fig.update_layout(
            xaxis_title='Driver',
            yaxis_title='Average Q3 Time (seconds)',
            plot_bgcolor='#121212',
            paper_bgcolor='#121212',
            font=dict(color='white'),
            title_font_color='white',
            title_x=0.5
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with data_tab3:
        # Team performance
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 15px; 
                border-radius: 10px; 
                margin-bottom: 20px;
            ">
                <h4 style="margin: 0; color: white !important;">Team Performance</h4>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        team_data = data.groupby('Team')['Q3_sec'].mean().reset_index()
        team_data = team_data.sort_values('Q3_sec')
        
        # Create bar chart with team colors
        fig = px.bar(
            team_data,
            x='Team',
            y='Q3_sec',
            title='Average Q3 Time by Team',
            labels={'Q3_sec': 'Average Q3 Time (seconds)', 'Team': 'Team'},
            color='Team',
            color_discrete_map=TEAM_COLORS
        )
        
        # Update layout
        fig.update_layout(
            xaxis_title='Team',
            yaxis_title='Average Q3 Time (seconds)',
            plot_bgcolor='#121212',
            paper_bgcolor='#121212',
            font=dict(color='white'),
            title_font_color='white',
            title_x=0.5
        )
        
        st.plotly_chart(fig, use_container_width=True)

def show_model_performance_subtab():
    """Show model performance analysis"""
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
        ">
            <h3 style="margin: 0; color: white !important;">Model Performance</h3>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Train and evaluate button
    if st.button("Train and Evaluate Model", key="train_model"):
        with st.spinner("🏎️ Training and evaluating model..."):
            # Add a small delay for visual effect
            time.sleep(1)
            
            # Initialize components
            data_fetcher = DataFetcher()
            data_processor = DataProcessor()
            
            # Map ML model type to internal name
            ml_model_map = {
                "Linear Regression": "linear",
                "Ridge Regression": "ridge",
                "Random Forest": "rf",
                "Gradient Boosting": "gbm"
            }
            
            ml_model_name = ml_model_map.get(
                st.session_state.get('ml_model_type', "Linear Regression"), 
                "linear"
            )
            
            model = QualifyingModel(model_type=ml_model_name)
            
            # Fetch historical data
            historical_data = data_fetcher.fetch_recent_seasons(verbose=False)
            
            if historical_data is not None:
                # Clean and process data
                cleaned_data = data_processor.clean_data(historical_data)
                engineered_data = data_processor.engineer_features(cleaned_data)
                
                # Prepare features for training
                X, y, metadata = data_processor.prepare_features(engineered_data)
                
                # Split data for training and testing
                from sklearn.model_selection import train_test_split
                X_train, X_test, y_train, y_test, meta_train, meta_test = train_test_split(
                    X, y, metadata, test_size=0.2, random_state=42
                )
                
                # Train the model
                model.train(X_train, y_train)
                
                # Evaluate the model
                metrics = model.evaluate(X_test, y_test)
                
                # Display metrics
                st.markdown(
                    f"""
                    <div style="
                        background-color: {F1_COLORS['gray']}; 
                        padding: 15px; 
                        border-radius: 10px; 
                        margin-bottom: 20px;
                    ">
                        <h4 style="margin: 0 0 15px 0; color: white !important;">Model Metrics</h4>
                    """,
                    unsafe_allow_html=True
                )
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: rgba(225, 6, 0, 0.1); 
                            padding: 15px; 
                            border-radius: 10px;
                            text-align: center;
                            border-left: 5px solid {F1_COLORS['red']};
                        ">
                            <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                                {metrics['mae']:.3f}s
                            </h1>
                            <p style="color: white; margin: 0;">Mean Absolute Error</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                
                with col2:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: rgba(225, 6, 0, 0.1); 
                            padding: 15px; 
                            border-radius: 10px;
                            text-align: center;
                            border-left: 5px solid {F1_COLORS['red']};
                        ">
                            <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                                {metrics['rmse']:.3f}s
                            </h1>
                            <p style="color: white; margin: 0;">Root Mean Squared Error</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                
                with col3:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: rgba(225, 6, 0, 0.1); 
                            padding: 15px; 
                            border-radius: 10px;
                            text-align: center;
                            border-left: 5px solid {F1_COLORS['red']};
                        ">
                            <h1 style="color: {F1_COLORS['red']} !important; font-size: 36px; margin: 0;">
                                {metrics['r2']:.3f}
                            </h1>
                            <p style="color: white; margin: 0;">R² Score</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                
                st.markdown("</div>", unsafe_allow_html=True)
                
                # Cross-validation
                cv_metrics = model.cross_validate(X, y)
                
                st.markdown(
                    f"""
                    <div style="
                        background-color: {F1_COLORS['gray']}; 
                        padding: 15px; 
                        border-radius: 10px; 
                        margin-bottom: 20px;
                    ">
                        <h4 style="margin: 0 0 15px 0; color: white !important;">Cross-Validation Results</h4>
                    """,
                    unsafe_allow_html=True
                )
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: rgba(0, 144, 255, 0.1); 
                            padding: 15px; 
                            border-radius: 10px;
                            text-align: center;
                            border-left: 5px solid {F1_COLORS['blue']};
                        ">
                            <h1 style="color: {F1_COLORS['blue']} !important; font-size: 28px; margin: 0;">
                                {cv_metrics['mae_mean']:.3f}s ± {cv_metrics['mae_std']:.3f}
                            </h1>
                            <p style="color: white; margin: 0;">CV Mean Absolute Error</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                
                with col2:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: rgba(0, 144, 255, 0.1); 
                            padding: 15px; 
                            border-radius: 10px;
                            text-align: center;
                            border-left: 5px solid {F1_COLORS['blue']};
                        ">
                            <h1 style="color: {F1_COLORS['blue']} !important; font-size: 28px; margin: 0;">
                                {cv_metrics['r2_mean']:.3f} ± {cv_metrics['r2_std']:.3f}
                            </h1>
                            <p style="color: white; margin: 0;">CV R² Score</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                
                st.markdown("</div>", unsafe_allow_html=True)
                
                # Plot predictions
                st.markdown(
                    f"""
                    <div style="
                        background-color: {F1_COLORS['gray']}; 
                        padding: 15px; 
                        border-radius: 10px; 
                        margin-bottom: 20px;
                    ">
                        <h4 style="margin: 0 0 15px 0; color: white !important;">Prediction Analysis</h4>
                    """,
                    unsafe_allow_html=True
                )
                
                fig = model.plot_predictions(X_test, y_test, meta_test)
                
                # Update figure styling
                fig.set_facecolor('#121212')
                for ax in fig.axes:
                    ax.set_facecolor('#121212')
                    ax.tick_params(colors='white')
                    ax.xaxis.label.set_color('white')
                    ax.yaxis.label.set_color('white')
                    ax.title.set_color('white')
                    for spine in ax.spines.values():
                        spine.set_color('#333333')
                
                st.pyplot(fig)
                
                st.markdown("</div>", unsafe_allow_html=True)
                
                # Feature importance (if applicable)
                if ml_model_name in ['rf', 'gbm']:
                    st.markdown(
                        f"""
                        <div style="
                            background-color: {F1_COLORS['gray']}; 
                            padding: 15px; 
                            border-radius: 10px; 
                            margin-bottom: 20px;
                        ">
                            <h4 style="margin: 0 0 15px 0; color: white !important;">Feature Importance</h4>
                        """,
                        unsafe_allow_html=True
                    )
                    
                    # Get feature importance
                    importance = model.model.feature_importances_
                    feature_names = X.columns
                    
                    # Create DataFrame
                    importance_df = pd.DataFrame({
                        'Feature': feature_names,
                        'Importance': importance
                    }).sort_values('Importance', ascending=False)
                    
                    # Create bar chart
                    fig = px.bar(
                        importance_df,
                        x='Feature',
                        y='Importance',
                        title='Feature Importance',
                        labels={'Importance': 'Importance', 'Feature': 'Feature'},
                        color_discrete_sequence=[F1_COLORS['yellow']]
                    )
                    
                    # Update layout
                    fig.update_layout(
                        xaxis_title='Feature',
                        yaxis_title='Importance',
                        plot_bgcolor='#121212',
                        paper_bgcolor='#121212',
                        font=dict(color='white'),
                        title_font_color='white',
                        title_x=0.5
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    st.markdown("</div>", unsafe_allow_html=True)
            else:
                st.error("Failed to fetch historical data. Please try again.")
    else:
        # Show placeholder content
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 20px; 
                border-radius: 10px; 
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            ">
                <h4 style="color: white !important;">Click "Train and Evaluate Model" to analyze model performance</h4>
                <p style="color: {F1_COLORS['light_gray']};">
                    This will train a {st.session_state.get('ml_model_type', 'Linear Regression')} model and evaluate its performance
                </p>
            </div>
            """,
            unsafe_allow_html=True
        )

def show_about_tab():
    """Show the about tab content with F1 styling"""
    st.markdown(
        f"""
        <div style="
            background-color: {F1_COLORS['gray']}; 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            border-left: 5px solid {F1_COLORS['yellow']};
        ">
            <h2 style="margin: 0; color: white !important;">About F1 Qualifying Predictor</h2>
            <p style="color: {F1_COLORS['light_gray']};">
                A machine learning application for predicting Formula 1 qualifying results
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Create a two-column layout
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 20px; 
                border-radius: 10px;
            ">
                <h3 style="color: {F1_COLORS['red']} !important;">Overview</h3>
                <p style="color: white;">
                    The F1 Qualifying Predictor is a machine learning application that predicts Formula 1 qualifying results 
                    using historical data and performance factors.
                </p>
                
                <h3 style="color: {F1_COLORS['red']} !important; margin-top: 20px;">Features</h3>
                <ul style="color: white;">
                    <li><strong>Data Collection:</strong> Uses the FastF1 API to fetch qualifying data from past F1 races</li>
                    <li><strong>Machine Learning:</strong> Trains regression models to predict Q3 times based on Q1 and Q2 performance</li>
                    <li><strong>Performance Factors:</strong> Incorporates driver and team-specific performance multipliers</li>
                    <li><strong>Hybrid Prediction:</strong> Combines ML predictions with performance-based adjustments</li>
                    <li><strong>Interactive Dashboard:</strong> Visualize predictions and historical data</li>
                </ul>
                
                <h3 style="color: {F1_COLORS['red']} !important; margin-top: 20px;">How It Works</h3>
                <ol style="color: white;">
                    <li><strong>Data Collection:</strong> The application fetches qualifying data from the FastF1 API</li>
                    <li><strong>Data Processing:</strong> Cleans and prepares the data for model training</li>
                    <li><strong>Model Training:</strong> Trains a regression model on historical qualifying data</li>
                    <li><strong>Performance Factors:</strong> Applies driver and team-specific adjustments</li>
                    <li><strong>Prediction:</strong> Combines ML predictions with performance factors to generate final predictions</li>
                </ol>
                
                <h3 style="color: {F1_COLORS['red']} !important; margin-top: 20px;">Technologies Used</h3>
                <ul style="color: white;">
                    <li><strong>Python:</strong> Core programming language</li>
                    <li><strong>FastF1:</strong> API for Formula 1 data</li>
                    <li><strong>pandas & numpy:</strong> Data processing</li>
                    <li><strong>scikit-learn:</strong> Machine learning modeling</li>
                    <li><strong>Streamlit:</strong> Interactive web interface</li>
                    <li><strong>Plotly & Matplotlib:</strong> Data visualization</li>
                </ul>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    with col2:
        st.markdown(
            f"""
            <div style="
                background-color: {F1_COLORS['gray']}; 
                padding: 20px; 
                border-radius: 10px;
                height: 100%;
            ">
                <h3 style="color: {F1_COLORS['red']} !important;">Quick Start</h3>
                <ol style="color: white;">
                    <li>Select a circuit in the sidebar</li>
                    <li>Choose your model settings</li>
                    <li>Set weather conditions</li>
                    <li>Click "GENERATE PREDICTIONS"</li>
                </ol>
                
                <h3 style="color: {F1_COLORS['red']} !important; margin-top: 20px;">Future Improvements</h3>
                <ul style="color: white;">
                    <li>Add real-time weather conditions</li>
                    <li>Incorporate track-specific modifiers</li>
                    <li>Enable simulated qualifying with user input</li>
                    <li>Deploy on Streamlit Cloud</li>
                </ul>
                
                <div style="
                    background-color: {F1_COLORS['red']}; 
                    padding: 15px; 
                    border-radius: 10px;
                    margin-top: 30px;
                    text-align: center;
                ">
                    <h4 style="margin: 0; color: white !important;">Ready to Race?</h4>
                    <p style="color: white; margin: 5px 0 0 0;">
                        Head to the Predictions tab and generate your first qualifying prediction!
                    </p>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

if __name__ == "__main__":
    run_app()
