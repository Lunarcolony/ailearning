import tensorflow as tf
import numpy as np
import os
import argparse
import logging
from PIL import Image
import matplotlib.pyplot as plt

from src.models.mri_iq_model import create_simplified_2d_model, create_model
from src.data.preprocessing import MRIPreprocessor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MRIIQPredictor:
    """
    Class for making IQ predictions from MRI images using a trained model.
    """
    
    def __init__(self, model_path, model_type='2d', input_shape=None):
        """
        Initialize the predictor.
        
        Args:
            model_path: Path to the trained model
            model_type: Type of model ('2d' or '3d')
            input_shape: Input shape expected by the model
        """
        self.model_path = model_path
        self.model_type = model_type
        self.input_shape = input_shape or ((224, 224, 1) if model_type == '2d' else (128, 128, 128, 1))
        self.model = None
        self.preprocessor = MRIPreprocessor(
            target_size=self.input_shape[:-1],
            normalize=True
        )
        
        self.load_model()
    
    def load_model(self):
        """
        Load the trained model.
        """
        try:
            if os.path.exists(self.model_path):
                self.model = tf.keras.models.load_model(self.model_path)
                logger.info(f"Model loaded successfully from {self.model_path}")
            else:
                # Try with .keras extension if .h5 fails
                keras_path = self.model_path.replace('.h5', '.keras')
                if os.path.exists(keras_path):
                    self.model = tf.keras.models.load_model(keras_path)
                    logger.info(f"Model loaded successfully from {keras_path}")
                else:
                    logger.error(f"Model file not found: {self.model_path}")
                    # Create a default model for demonstration
                    logger.info("Creating a default model for demonstration...")
                    if self.model_type == '2d':
                        self.model = create_simplified_2d_model(input_shape=self.input_shape)
                    else:
                        self.model = create_model(input_shape=self.input_shape)
                    logger.warning("Using untrained model - predictions will be random!")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            logger.info("Creating a default model for demonstration...")
            if self.model_type == '2d':
                self.model = create_simplified_2d_model(input_shape=self.input_shape)
            else:
                self.model = create_model(input_shape=self.input_shape)
            logger.warning("Using untrained model - predictions will be random!")
    
    def predict_single(self, image_path):
        """
        Predict IQ from a single MRI image.
        
        Args:
            image_path: Path to the MRI image
            
        Returns:
            Predicted IQ score
        """
        if self.model is None:
            logger.error("Model not loaded!")
            return None
        
        # Preprocess the image
        processed_image = self.preprocessor.preprocess_single(image_path)
        if processed_image is None:
            logger.error(f"Failed to preprocess image: {image_path}")
            return None
        
        # Add batch dimension
        processed_image = np.expand_dims(processed_image, axis=0)
        
        # Make prediction
        try:
            prediction = self.model.predict(processed_image, verbose=0)
            iq_score = float(prediction[0][0])
            
            logger.info(f"Predicted IQ for {image_path}: {iq_score:.1f}")
            return iq_score
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return None
    
    def predict_batch(self, image_paths):
        """
        Predict IQ from multiple MRI images.
        
        Args:
            image_paths: List of paths to MRI images
            
        Returns:
            List of predicted IQ scores
        """
        if self.model is None:
            logger.error("Model not loaded!")
            return None
        
        # Preprocess all images
        processed_images = []
        valid_paths = []
        
        for image_path in image_paths:
            processed_image = self.preprocessor.preprocess_single(image_path)
            if processed_image is not None:
                processed_images.append(processed_image)
                valid_paths.append(image_path)
            else:
                logger.warning(f"Failed to preprocess image: {image_path}")
        
        if not processed_images:
            logger.error("No valid images to process!")
            return None
        
        # Convert to numpy array
        processed_images = np.array(processed_images)
        
        # Make predictions
        try:
            predictions = self.model.predict(processed_images, verbose=0)
            iq_scores = [float(pred[0]) for pred in predictions]
            
            for path, iq in zip(valid_paths, iq_scores):
                logger.info(f"Predicted IQ for {os.path.basename(path)}: {iq:.1f}")
            
            return iq_scores
        except Exception as e:
            logger.error(f"Error during batch prediction: {e}")
            return None
    
    def visualize_prediction(self, image_path, save_path=None):
        """
        Visualize an MRI image with its predicted IQ.
        
        Args:
            image_path: Path to the MRI image
            save_path: Path to save the visualization
        """
        # Load and preprocess the image
        processed_image = self.preprocessor.preprocess_single(image_path)
        if processed_image is None:
            logger.error(f"Failed to load image: {image_path}")
            return
        
        # Make prediction
        iq_score = self.predict_single(image_path)
        if iq_score is None:
            return
        
        # Create visualization
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
        
        # Show original image (load again for display)
        try:
            original_img = self.preprocessor.load_image(image_path)
            if len(original_img.shape) == 3:
                # Take middle slice for 3D volumes
                original_img = original_img[:, :, original_img.shape[2] // 2]
            
            ax1.imshow(original_img, cmap='gray')
            ax1.set_title(f'Original MRI\n{os.path.basename(image_path)}')
            ax1.axis('off')
        except Exception as e:
            logger.warning(f"Could not display original image: {e}")
            ax1.text(0.5, 0.5, 'Original Image\nNot Available', 
                    ha='center', va='center', transform=ax1.transAxes)
        
        # Show processed image
        if len(processed_image.shape) == 3:
            processed_display = processed_image[:, :, 0]
        else:
            processed_display = processed_image
        
        ax2.imshow(processed_display, cmap='gray')
        ax2.set_title(f'Processed MRI\nPredicted IQ: {iq_score:.1f}')
        ax2.axis('off')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=150, bbox_inches='tight')
            logger.info(f"Visualization saved to {save_path}")
        
        plt.show()


def main():
    """
    Main function for command-line usage.
    """
    parser = argparse.ArgumentParser(description='Predict IQ from MRI images')
    parser.add_argument('--model', type=str, default='models/saved/mri_iq_model.keras',
                       help='Path to the trained model')
    parser.add_argument('--image', type=str, required=True,
                       help='Path to MRI image or directory of images')
    parser.add_argument('--model_type', type=str, default='2d', choices=['2d', '3d'],
                       help='Type of model (2d or 3d)')
    parser.add_argument('--visualize', action='store_true',
                       help='Create visualization of prediction')
    parser.add_argument('--output', type=str, default=None,
                       help='Output directory for visualizations')
    
    args = parser.parse_args()
    
    # Initialize predictor
    predictor = MRIIQPredictor(
        model_path=args.model,
        model_type=args.model_type
    )
    
    # Check if input is a file or directory
    if os.path.isfile(args.image):
        # Single image prediction
        iq_score = predictor.predict_single(args.image)
        
        if iq_score is not None:
            print(f"\nPredicted IQ: {iq_score:.1f}")
            
            if args.visualize:
                output_path = None
                if args.output:
                    os.makedirs(args.output, exist_ok=True)
                    filename = os.path.splitext(os.path.basename(args.image))[0]
                    output_path = os.path.join(args.output, f"{filename}_prediction.png")
                
                predictor.visualize_prediction(args.image, output_path)
        
    elif os.path.isdir(args.image):
        # Batch prediction
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.nii', '*.nii.gz']:
            image_files.extend(tf.io.gfile.glob(os.path.join(args.image, ext)))
        
        if image_files:
            logger.info(f"Found {len(image_files)} images in directory")
            iq_scores = predictor.predict_batch(image_files)
            
            if iq_scores:
                print(f"\nBatch Prediction Results:")
                print("-" * 50)
                for img_path, iq in zip(image_files, iq_scores):
                    print(f"{os.path.basename(img_path)}: {iq:.1f}")
                
                avg_iq = np.mean(iq_scores)
                print(f"\nAverage predicted IQ: {avg_iq:.1f}")
        else:
            logger.error(f"No image files found in directory: {args.image}")
    
    else:
        logger.error(f"Invalid input path: {args.image}")


def demo_prediction():
    """
    Demonstration function using sample data.
    """
    logger.info("Running MRI IQ Prediction Demo...")
    
    # Create sample data if it doesn't exist
    sample_dir = "data/sample"
    if not os.path.exists(sample_dir):
        from src.data.preprocessing import create_sample_data
        logger.info("Creating sample data for demonstration...")
        create_sample_data(num_samples=10, output_dir=sample_dir)
    
    # Initialize predictor (will use default model if trained model doesn't exist)
    model_path = "models/saved/mri_iq_model.keras"
    predictor = MRIIQPredictor(model_path=model_path, model_type='2d')
    
    # Get sample images
    import glob
    sample_images = glob.glob(os.path.join(sample_dir, "*.jpg"))
    
    if sample_images:
        logger.info(f"Found {len(sample_images)} sample images")
        
        # Predict on first few images
        for i, img_path in enumerate(sample_images[:3]):
            logger.info(f"\nProcessing image {i+1}: {os.path.basename(img_path)}")
            iq_score = predictor.predict_single(img_path)
            
            if iq_score:
                print(f"Predicted IQ: {iq_score:.1f}")
                
                # Create visualization
                output_dir = "examples/predictions"
                os.makedirs(output_dir, exist_ok=True)
                
                output_path = os.path.join(output_dir, f"prediction_{i+1}.png")
                predictor.visualize_prediction(img_path, output_path)
    
    else:
        logger.error("No sample images found!")


if __name__ == "__main__":
    if len(os.sys.argv) == 1:
        # Run demo if no arguments provided
        demo_prediction()
    else:
        # Run main function with command line arguments
        main()