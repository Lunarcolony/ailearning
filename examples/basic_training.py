#!/usr/bin/env python3
"""
Basic Training Example for MRI IQ Prediction

This script demonstrates a simple training workflow using synthetic data.
Perfect for getting started with the system.
"""

import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.train import MRIIQTrainer
from src.data.preprocessing import create_sample_data
from src.utils.evaluation import analyze_model_performance
from sklearn.model_selection import train_test_split
import numpy as np


def main():
    """
    Basic training example with synthetic data.
    """
    print("=" * 60)
    print("MRI IQ Prediction - Basic Training Example")
    print("=" * 60)
    
    # Step 1: Create sample data
    sample_dir = "data/sample"
    if not os.path.exists(sample_dir):
        print("Creating synthetic MRI data...")
        create_sample_data(num_samples=200, output_dir=sample_dir)
        print(f"✓ Created sample data in {sample_dir}")
    
    # Step 2: Initialize trainer
    print("\nInitializing trainer...")
    trainer = MRIIQTrainer(
        model_type='2d',
        input_shape=(224, 224, 1),
        model_save_path='models/saved'
    )
    print("✓ Trainer initialized")
    
    # Step 3: Load data
    print("\nLoading data...")
    labels_file = os.path.join(sample_dir, "iq_labels.txt")
    X, y, filenames = trainer.load_data(sample_dir, labels_file)
    
    if X is None or y is None:
        print("❌ Failed to load data!")
        return
    
    print(f"✓ Loaded {len(X)} samples")
    print(f"  - Image shape: {X[0].shape}")
    print(f"  - IQ range: {y.min():.1f} - {y.max():.1f}")
    print(f"  - Mean IQ: {y.mean():.1f} ± {y.std():.1f}")
    
    # Step 4: Split data
    print("\nSplitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"✓ Training samples: {len(X_train)}")
    print(f"✓ Testing samples: {len(X_test)}")
    
    # Step 5: Train model
    print("\nTraining model...")
    print("This may take a few minutes...")
    
    history = trainer.train(
        X_train, y_train,
        epochs=30,  # Reduced for quick demo
        batch_size=8,
        validation_split=0.2
    )
    
    print("✓ Training completed!")
    
    # Step 6: Evaluate model
    print("\nEvaluating model...")
    metrics = trainer.evaluate(X_test, y_test)
    
    print(f"✓ Model Performance:")
    print(f"  - MAE: {metrics['mae']:.2f} IQ points")
    print(f"  - RMSE: {metrics['rmse']:.2f} IQ points")
    print(f"  - R²: {metrics['r2']:.3f}")
    
    # Step 7: Save model and results
    print("\nSaving results...")
    model_path = "models/saved/basic_example_model.h5"
    trainer.save_model(model_path)
    print(f"✓ Model saved to {model_path}")
    
    # Plot training history
    history_plot = "examples/basic_training_history.png"
    trainer.plot_training_history(history_plot)
    print(f"✓ Training history saved to {history_plot}")
    
    # Step 8: Detailed analysis
    print("\nPerforming detailed analysis...")
    y_pred = trainer.model.predict(X_test).flatten()
    
    analysis_dir = "examples/basic_analysis"
    analyze_model_performance(y_test, y_pred, output_dir=analysis_dir)
    print(f"✓ Detailed analysis saved to {analysis_dir}")
    
    print("\n" + "=" * 60)
    print("Basic training example completed successfully!")
    print("=" * 60)
    
    print("\nNext steps:")
    print("1. Check the training history plot")
    print("2. Review the detailed analysis results")
    print("3. Try predicting on new images with the trained model")
    print("4. Experiment with different hyperparameters")


if __name__ == "__main__":
    main()