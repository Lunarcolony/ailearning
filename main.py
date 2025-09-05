#!/usr/bin/env python3
"""
MRI-based IQ Prediction System

This script provides a simple interface to train a model or make predictions
on MRI brain scan images to estimate IQ scores.

Usage:
    python main.py train --data_dir data/mri_images --labels data/iq_labels.csv
    python main.py predict --image path/to/mri_image.jpg --model models/trained_model.h5
    python main.py demo  # Run demonstration with sample data
"""

import argparse
import os
import sys
import logging

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.train import MRIIQTrainer
from src.predict import MRIIQPredictor, demo_prediction
from src.data.preprocessing import create_sample_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def train_model(args):
    """
    Train the MRI IQ prediction model.
    
    Args:
        args: Command line arguments
    """
    logger.info("Starting model training...")
    
    # Initialize trainer
    trainer = MRIIQTrainer(
        model_type=args.model_type,
        input_shape=args.input_shape,
        model_save_path=args.model_save_path
    )
    
    # Load data
    if not os.path.exists(args.data_dir):
        logger.error(f"Data directory not found: {args.data_dir}")
        logger.info("Creating sample data for demonstration...")
        create_sample_data(num_samples=200, output_dir=args.data_dir)
        args.labels = os.path.join(args.data_dir, "iq_labels.txt")
    
    X, y, filenames = trainer.load_data(args.data_dir, args.labels)
    
    if X is None or y is None:
        logger.error("Failed to load training data!")
        return
    
    logger.info(f"Loaded {len(X)} training samples")
    
    # Train model
    history = trainer.train(
        X, y,
        epochs=args.epochs,
        batch_size=args.batch_size,
        validation_split=args.validation_split
    )
    
    # Save model
    model_path = os.path.join(args.model_save_path, "mri_iq_model.keras")
    trainer.save_model(model_path)
    
    # Plot training history
    history_plot_path = os.path.join(args.model_save_path, "training_history.png")
    trainer.plot_training_history(history_plot_path)
    
    logger.info(f"Training completed! Model saved to {model_path}")


def predict_iq(args):
    """
    Make IQ predictions on MRI images.
    
    Args:
        args: Command line arguments
    """
    logger.info("Making IQ predictions...")
    
    # Initialize predictor
    predictor = MRIIQPredictor(
        model_path=args.model,
        model_type=args.model_type
    )
    
    if not os.path.exists(args.image):
        logger.error(f"Image path not found: {args.image}")
        return
    
    if os.path.isfile(args.image):
        # Single image prediction
        iq_score = predictor.predict_single(args.image)
        if iq_score:
            print(f"\nPredicted IQ: {iq_score:.1f}")
            
            if args.visualize:
                output_dir = args.output or "predictions"
                os.makedirs(output_dir, exist_ok=True)
                
                filename = os.path.splitext(os.path.basename(args.image))[0]
                output_path = os.path.join(output_dir, f"{filename}_prediction.png")
                predictor.visualize_prediction(args.image, output_path)
    
    elif os.path.isdir(args.image):
        # Batch prediction
        import glob
        
        image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.nii', '*.nii.gz']
        image_files = []
        for ext in image_extensions:
            image_files.extend(glob.glob(os.path.join(args.image, ext)))
        
        if image_files:
            logger.info(f"Found {len(image_files)} images for prediction")
            iq_scores = predictor.predict_batch(image_files)
            
            if iq_scores:
                print(f"\nBatch Prediction Results:")
                print("-" * 50)
                for img_path, iq in zip(image_files, iq_scores):
                    print(f"{os.path.basename(img_path)}: {iq:.1f}")
                
                import numpy as np
                avg_iq = np.mean(iq_scores)
                print(f"\nAverage predicted IQ: {avg_iq:.1f}")
        else:
            logger.error(f"No image files found in directory: {args.image}")


def run_demo():
    """
    Run demonstration with sample data.
    """
    logger.info("Running MRI IQ Prediction Demo...")
    
    # Create sample data
    sample_dir = "data/sample"
    if not os.path.exists(sample_dir):
        logger.info("Creating sample data...")
        create_sample_data(num_samples=50, output_dir=sample_dir)
    
    # Train a quick model if it doesn't exist
    model_path = "models/saved/mri_iq_model.keras"
    if not os.path.exists(model_path):
        logger.info("Training a demonstration model...")
        
        trainer = MRIIQTrainer(model_type='2d')
        labels_file = os.path.join(sample_dir, "iq_labels.txt")
        X, y, _ = trainer.load_data(sample_dir, labels_file)
        
        if X is not None and y is not None:
            trainer.train(X, y, epochs=20, batch_size=8)
            trainer.save_model(model_path)
    
    # Run prediction demo
    demo_prediction()


def main():
    """
    Main function with command line interface.
    """
    parser = argparse.ArgumentParser(
        description="MRI-based IQ Prediction System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  Train a model:
    python main.py train --data_dir data/mri_scans --labels data/iq_scores.csv --epochs 100
  
  Make predictions:
    python main.py predict --image mri_scan.jpg --model models/trained_model.h5 --visualize
  
  Run demo:
    python main.py demo
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Training parser
    train_parser = subparsers.add_parser('train', help='Train the MRI IQ prediction model')
    train_parser.add_argument('--data_dir', type=str, default='data/sample',
                             help='Directory containing MRI images')
    train_parser.add_argument('--labels', type=str, default=None,
                             help='File containing image filenames and IQ labels')
    train_parser.add_argument('--model_type', type=str, default='2d', choices=['2d', '3d'],
                             help='Type of model to train')
    train_parser.add_argument('--input_shape', type=str, default=None,
                             help='Input shape for the model (e.g., "224,224,1")')
    train_parser.add_argument('--epochs', type=int, default=50,
                             help='Number of training epochs')
    train_parser.add_argument('--batch_size', type=int, default=16,
                             help='Batch size for training')
    train_parser.add_argument('--validation_split', type=float, default=0.2,
                             help='Fraction of data to use for validation')
    train_parser.add_argument('--model_save_path', type=str, default='models/saved',
                             help='Directory to save the trained model')
    
    # Prediction parser
    predict_parser = subparsers.add_parser('predict', help='Predict IQ from MRI images')
    predict_parser.add_argument('--image', type=str, required=True,
                               help='Path to MRI image or directory of images')
    predict_parser.add_argument('--model', type=str, default='models/saved/mri_iq_model.keras',
                               help='Path to the trained model')
    predict_parser.add_argument('--model_type', type=str, default='2d', choices=['2d', '3d'],
                               help='Type of model')
    predict_parser.add_argument('--visualize', action='store_true',
                               help='Create visualization of predictions')
    predict_parser.add_argument('--output', type=str, default=None,
                               help='Output directory for visualizations')
    
    # Demo parser
    demo_parser = subparsers.add_parser('demo', help='Run demonstration with sample data')
    
    args = parser.parse_args()
    
    if args.command == 'train':
        # Parse input shape if provided
        if args.input_shape:
            args.input_shape = tuple(map(int, args.input_shape.split(',')))
        else:
            args.input_shape = (224, 224, 1) if args.model_type == '2d' else (128, 128, 128, 1)
        
        train_model(args)
    
    elif args.command == 'predict':
        predict_iq(args)
    
    elif args.command == 'demo':
        run_demo()
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()