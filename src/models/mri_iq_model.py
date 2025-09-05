import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np


class MRIIQPredictor(keras.Model):
    """
    Convolutional Neural Network for predicting IQ from MRI brain scans.
    
    This model uses a CNN architecture optimized for 3D brain image analysis
    to predict IQ scores from structural MRI data.
    """
    
    def __init__(self, input_shape=(128, 128, 128, 1), dropout_rate=0.3):
        """
        Initialize the MRI IQ Prediction model.
        
        Args:
            input_shape: Shape of input MRI images (height, width, depth, channels)
            dropout_rate: Dropout rate for regularization
        """
        super(MRIIQPredictor, self).__init__()
        
        # 3D Convolutional layers for feature extraction
        self.conv3d_1 = layers.Conv3D(32, (3, 3, 3), activation='relu', padding='same')
        self.pool3d_1 = layers.MaxPooling3D((2, 2, 2))
        self.batch_norm_1 = layers.BatchNormalization()
        
        self.conv3d_2 = layers.Conv3D(64, (3, 3, 3), activation='relu', padding='same')
        self.pool3d_2 = layers.MaxPooling3D((2, 2, 2))
        self.batch_norm_2 = layers.BatchNormalization()
        
        self.conv3d_3 = layers.Conv3D(128, (3, 3, 3), activation='relu', padding='same')
        self.pool3d_3 = layers.MaxPooling3D((2, 2, 2))
        self.batch_norm_3 = layers.BatchNormalization()
        
        self.conv3d_4 = layers.Conv3D(256, (3, 3, 3), activation='relu', padding='same')
        self.pool3d_4 = layers.MaxPooling3D((2, 2, 2))
        self.batch_norm_4 = layers.BatchNormalization()
        
        # Global average pooling to reduce dimensionality
        self.global_avg_pool = layers.GlobalAveragePooling3D()
        
        # Dense layers for regression
        self.dropout_1 = layers.Dropout(dropout_rate)
        self.dense_1 = layers.Dense(512, activation='relu')
        self.dropout_2 = layers.Dropout(dropout_rate)
        self.dense_2 = layers.Dense(256, activation='relu')
        self.dropout_3 = layers.Dropout(dropout_rate)
        self.dense_3 = layers.Dense(128, activation='relu')
        
        # Output layer for IQ prediction (single continuous value)
        self.output_layer = layers.Dense(1, activation='linear', name='iq_prediction')
        
    def call(self, inputs, training=False):
        """
        Forward pass through the network.
        
        Args:
            inputs: Input MRI images
            training: Whether the model is in training mode
            
        Returns:
            Predicted IQ scores
        """
        x = self.conv3d_1(inputs)
        x = self.pool3d_1(x)
        x = self.batch_norm_1(x, training=training)
        
        x = self.conv3d_2(x)
        x = self.pool3d_2(x)
        x = self.batch_norm_2(x, training=training)
        
        x = self.conv3d_3(x)
        x = self.pool3d_3(x)
        x = self.batch_norm_3(x, training=training)
        
        x = self.conv3d_4(x)
        x = self.pool3d_4(x)
        x = self.batch_norm_4(x, training=training)
        
        x = self.global_avg_pool(x)
        
        x = self.dropout_1(x, training=training)
        x = self.dense_1(x)
        x = self.dropout_2(x, training=training)
        x = self.dense_2(x)
        x = self.dropout_3(x, training=training)
        x = self.dense_3(x)
        
        return self.output_layer(x)


def create_model(input_shape=(128, 128, 128, 1), dropout_rate=0.3, learning_rate=0.001):
    """
    Create and compile the MRI IQ prediction model.
    
    Args:
        input_shape: Shape of input MRI images
        dropout_rate: Dropout rate for regularization
        learning_rate: Learning rate for optimizer
        
    Returns:
        Compiled Keras model
    """
    model = MRIIQPredictor(input_shape=input_shape, dropout_rate=dropout_rate)
    
    # Compile with appropriate loss function and metrics for regression
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss='mse',  # Mean Squared Error for regression
        metrics=['mae']  # Mean Absolute Error only (avoid MSE duplication)
    )
    
    return model


def create_simplified_2d_model(input_shape=(224, 224, 1), dropout_rate=0.3, learning_rate=0.001):
    """
    Create a simplified 2D CNN model for when 3D data is not available.
    This can work with 2D slices of MRI scans.
    
    Args:
        input_shape: Shape of input 2D MRI images
        dropout_rate: Dropout rate for regularization
        learning_rate: Learning rate for optimizer
        
    Returns:
        Compiled Keras model
    """
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=input_shape),
        
        # Convolutional blocks
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        
        layers.Conv2D(512, (3, 3), activation='relu', padding='same'),
        layers.GlobalAveragePooling2D(),
        
        # Dense layers
        layers.Dropout(dropout_rate),
        layers.Dense(512, activation='relu'),
        layers.Dropout(dropout_rate),
        layers.Dense(256, activation='relu'),
        layers.Dropout(dropout_rate),
        layers.Dense(128, activation='relu'),
        
        # Output layer
        layers.Dense(1, activation='linear', name='iq_prediction')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss='mse',
        metrics=['mae']  # Only MAE to avoid metric loading issues
    )
    
    return model