#!/usr/bin/env python3
"""
Simple example showing how to make a single prediction
"""
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predict import MRIIQPredictor

def main():
    print("=" * 60)
    print("MRI IQ Prediction - Single Image Example")
    print("=" * 60)
    
    # Initialize predictor
    model_path = "models/saved/mri_iq_model.keras"
    predictor = MRIIQPredictor(model_path=model_path, model_type='2d')
    
    # Test with sample image
    image_path = "data/sample/sample_mri_001.jpg"
    
    if os.path.exists(image_path):
        print(f"Processing: {image_path}")
        
        # Make prediction
        iq_score = predictor.predict_single(image_path)
        
        if iq_score:
            print(f"Predicted IQ: {iq_score:.1f}")
            
            # Create visualization
            output_path = "examples/single_prediction_example.png"
            predictor.visualize_prediction(image_path, output_path)
            print(f"Visualization saved to: {output_path}")
        else:
            print("Prediction failed!")
    else:
        print(f"Image not found: {image_path}")
        print("Run 'python main.py demo' first to generate sample data")

if __name__ == "__main__":
    main()