import tensorflow as tf
import numpy as np
import pandas as pd
import os
import logging
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
from tqdm import tqdm

from src.models.mri_iq_model import create_model, create_simplified_2d_model
from src.data.preprocessing import MRIPreprocessor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MRIIQTrainer:
    """
    Trainer class for the MRI IQ prediction model.
    """
    
    def __init__(self, model_type='2d', input_shape=None, model_save_path='models/saved'):
        """
        Initialize the trainer.
        
        Args:
            model_type: Type of model ('2d' or '3d')
            input_shape: Input shape for the model
            model_save_path: Path to save trained models
        """
        self.model_type = model_type
        self.input_shape = input_shape or ((224, 224, 1) if model_type == '2d' else (128, 128, 128, 1))
        self.model_save_path = model_save_path
        self.model = None
        self.history = None
        self.preprocessor = MRIPreprocessor(
            target_size=self.input_shape[:-1] if model_type == '2d' else self.input_shape[:-1],
            normalize=True
        )
        
        os.makedirs(model_save_path, exist_ok=True)
    
    def load_data(self, data_dir, labels_file=None):
        """
        Load MRI data and corresponding IQ labels.
        
        Args:
            data_dir: Directory containing MRI images
            labels_file: CSV file with image filenames and IQ scores
            
        Returns:
            Tuple of (images, labels, filenames)
        """
        # Get list of image files
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.nii', '*.nii.gz']:
            image_files.extend(tf.io.gfile.glob(os.path.join(data_dir, ext)))
        
        logger.info(f"Found {len(image_files)} image files in {data_dir}")
        
        # Load labels if provided
        labels = None
        if labels_file and os.path.exists(labels_file):
            df = pd.read_csv(labels_file, header=None, names=['filename', 'iq'])
            label_dict = dict(zip(df['filename'], df['iq']))
            
            # Match labels with image files
            labels = []
            matched_files = []
            for img_file in image_files:
                filename = os.path.basename(img_file)
                if filename in label_dict:
                    labels.append(label_dict[filename])
                    matched_files.append(img_file)
            
            image_files = matched_files
            labels = np.array(labels)
            logger.info(f"Matched {len(labels)} images with labels")
        
        # Load and preprocess images
        images = []
        valid_labels = []
        valid_files = []
        
        for i, img_file in enumerate(tqdm(image_files, desc="Loading images")):
            processed_img = self.preprocessor.preprocess_single(img_file)
            if processed_img is not None:
                images.append(processed_img)
                if labels is not None:
                    valid_labels.append(labels[i])
                valid_files.append(img_file)
        
        images = np.array(images)
        if labels is not None:
            valid_labels = np.array(valid_labels)
        
        logger.info(f"Successfully loaded {len(images)} images")
        return images, valid_labels, valid_files
    
    def create_model(self, learning_rate=0.001, dropout_rate=0.3):
        """
        Create the model for training.
        
        Args:
            learning_rate: Learning rate for optimizer
            dropout_rate: Dropout rate for regularization
        """
        if self.model_type == '2d':
            self.model = create_simplified_2d_model(
                input_shape=self.input_shape,
                dropout_rate=dropout_rate,
                learning_rate=learning_rate
            )
        else:
            self.model = create_model(
                input_shape=self.input_shape,
                dropout_rate=dropout_rate,
                learning_rate=learning_rate
            )
        
        logger.info(f"Created {self.model_type} model with input shape {self.input_shape}")
        return self.model
    
    def train(self, X_train, y_train, X_val=None, y_val=None, 
              epochs=100, batch_size=16, validation_split=0.2):
        """
        Train the model.
        
        Args:
            X_train: Training images
            y_train: Training IQ labels
            X_val: Validation images (optional)
            y_val: Validation IQ labels (optional)
            epochs: Number of training epochs
            batch_size: Batch size for training
            validation_split: Fraction of training data to use for validation
        """
        if self.model is None:
            self.create_model()
        
        # Prepare validation data
        if X_val is None and y_train is not None:
            X_train, X_val, y_train, y_val = train_test_split(
                X_train, y_train, test_size=validation_split, random_state=42
            )
        
        # Define callbacks
        callbacks = [
            tf.keras.callbacks.ModelCheckpoint(
                os.path.join(self.model_save_path, 'best_model.keras'),
                monitor='val_loss' if X_val is not None else 'loss',
                save_best_only=True,
                save_weights_only=False,
                mode='min'
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss' if X_val is not None else 'loss',
                factor=0.5,
                patience=10,
                min_lr=1e-7,
                verbose=1
            ),
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss' if X_val is not None else 'loss',
                patience=20,
                restore_best_weights=True,
                verbose=1
            )
        ]
        
        # Train the model
        logger.info(f"Starting training for {epochs} epochs...")
        
        validation_data = (X_val, y_val) if X_val is not None and y_val is not None else None
        
        self.history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=validation_data,
            callbacks=callbacks,
            verbose=1
        )
        
        logger.info("Training completed!")
        return self.history
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate the model on test data.
        
        Args:
            X_test: Test images
            y_test: Test IQ labels
            
        Returns:
            Dictionary of evaluation metrics
        """
        if self.model is None:
            logger.error("Model not trained or loaded!")
            return None
        
        # Get predictions
        y_pred = self.model.predict(X_test)
        y_pred = y_pred.flatten()
        
        # Calculate metrics
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        metrics = {
            'mae': mae,
            'mse': mse,
            'rmse': rmse,
            'r2': r2
        }
        
        logger.info(f"Evaluation Metrics:")
        logger.info(f"MAE: {mae:.2f}")
        logger.info(f"MSE: {mse:.2f}")
        logger.info(f"RMSE: {rmse:.2f}")
        logger.info(f"R²: {r2:.3f}")
        
        return metrics
    
    def plot_training_history(self, save_path=None):
        """
        Plot training history.
        
        Args:
            save_path: Path to save the plot
        """
        if self.history is None:
            logger.warning("No training history available!")
            return
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
        
        # Plot loss
        ax1.plot(self.history.history['loss'], label='Training Loss')
        if 'val_loss' in self.history.history:
            ax1.plot(self.history.history['val_loss'], label='Validation Loss')
        ax1.set_title('Model Loss')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Loss')
        ax1.legend()
        
        # Plot MAE
        ax2.plot(self.history.history['mae'], label='Training MAE')
        if 'val_mae' in self.history.history:
            ax2.plot(self.history.history['val_mae'], label='Validation MAE')
        ax2.set_title('Model MAE')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('MAE')
        ax2.legend()
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
            logger.info(f"Training history plot saved to {save_path}")
        
        plt.show()
    
    def save_model(self, filepath=None):
        """
        Save the trained model.
        
        Args:
            filepath: Path to save the model
        """
        if self.model is None:
            logger.error("No model to save!")
            return
        
        if filepath is None:
            filepath = os.path.join(self.model_save_path, 'mri_iq_model.keras')
        
        # Use the new Keras format
        if filepath.endswith('.h5'):
            filepath = filepath.replace('.h5', '.keras')
            
        self.model.save(filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """
        Load a saved model.
        
        Args:
            filepath: Path to the saved model
        """
        if os.path.exists(filepath):
            self.model = tf.keras.models.load_model(filepath)
            logger.info(f"Model loaded from {filepath}")
        else:
            logger.error(f"Model file not found: {filepath}")


def main():
    """
    Main training function with example usage.
    """
    # Create sample data if it doesn't exist
    from src.data.preprocessing import create_sample_data
    
    sample_dir = "data/sample"
    if not os.path.exists(sample_dir):
        logger.info("Creating sample data for demonstration...")
        create_sample_data(num_samples=200, output_dir=sample_dir)
    
    # Initialize trainer
    trainer = MRIIQTrainer(model_type='2d', input_shape=(224, 224, 1))
    
    # Load data
    labels_file = os.path.join(sample_dir, "iq_labels.txt")
    X, y, filenames = trainer.load_data(sample_dir, labels_file)
    
    if X is not None and y is not None:
        logger.info(f"Loaded {len(X)} samples")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        trainer.train(X_train, y_train, epochs=50, batch_size=8)
        
        # Evaluate
        metrics = trainer.evaluate(X_test, y_test)
        
        # Save model
        trainer.save_model()
        
        # Plot training history
        trainer.plot_training_history(
            save_path=os.path.join(trainer.model_save_path, 'training_history.png')
        )
    
    else:
        logger.error("Failed to load data!")


if __name__ == "__main__":
    main()