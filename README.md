# AI Learning - MRI-based IQ Prediction

An AI system that predicts IQ scores from MRI brain scan images using deep learning. This project demonstrates the application of convolutional neural networks (CNNs) to neuroimaging data for cognitive assessment.

## ⚠️ Important Disclaimer

**This project is for educational and research purposes only.** 

- IQ prediction from brain scans is a complex and controversial topic in neuroscience
- The relationship between brain structure and intelligence is not fully understood
- This model should NOT be used for any clinical, diagnostic, or decision-making purposes
- Results should be interpreted with extreme caution and scientific skepticism
- The project serves as a demonstration of AI/ML techniques applied to neuroimaging data

## Features

- **Deep Learning Models**: Supports both 2D and 3D CNN architectures
- **Multiple Image Formats**: Handles standard images (JPG, PNG) and medical formats (NIfTI)
- **Comprehensive Preprocessing**: Advanced image preprocessing pipeline for MRI data
- **Training Infrastructure**: Complete training pipeline with validation and monitoring
- **Prediction Interface**: Easy-to-use prediction system with visualization
- **Performance Analysis**: Detailed evaluation metrics and visualizations
- **Sample Data Generation**: Built-in synthetic data generation for testing

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Lunarcolony/ailearning.git
cd ailearning
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create necessary directories:**
```bash
mkdir -p data/raw data/processed models/saved examples/predictions
```

## Quick Start

### Run Demo
The easiest way to get started is with the built-in demo:

```bash
python main.py demo
```

This will:
- Generate synthetic MRI-like sample data
- Train a simple model
- Make predictions and create visualizations

### Train Your Own Model

1. **Prepare your data:**
   - Place MRI images in a directory (e.g., `data/mri_scans/`)
   - Create a labels file with format: `filename,iq_score`

2. **Train the model:**
```bash
python main.py train --data_dir data/mri_scans --labels data/iq_labels.csv --epochs 100
```

### Make Predictions

**Single image:**
```bash
python main.py predict --image path/to/mri_scan.jpg --model models/saved/mri_iq_model.h5 --visualize
```

**Batch prediction:**
```bash
python main.py predict --image data/test_images/ --model models/saved/mri_iq_model.h5
```

## Project Structure

```
ailearning/
├── main.py                    # Main command-line interface
├── requirements.txt           # Python dependencies
├── README.md                 # This file
├── src/                      # Source code
│   ├── models/              
│   │   └── mri_iq_model.py   # CNN model architectures
│   ├── data/
│   │   └── preprocessing.py  # Data preprocessing pipeline
│   ├── utils/
│   │   └── evaluation.py     # Model evaluation utilities
│   ├── train.py             # Training script
│   └── predict.py           # Prediction script
├── data/                    # Data directory
│   ├── raw/                 # Raw MRI data
│   ├── processed/           # Processed data
│   └── sample/              # Sample/demo data
├── models/                  # Model directory
│   └── saved/               # Trained models
└── examples/                # Example outputs
    └── predictions/         # Prediction visualizations
```

## Model Architecture

### 2D CNN Model (Default)
- **Input**: 224x224 grayscale images
- **Architecture**: 5 convolutional blocks with batch normalization
- **Features**: Global average pooling, dropout regularization
- **Output**: Single continuous value (IQ score)

### 3D CNN Model
- **Input**: 128x128x128 volumetric data
- **Architecture**: 4 3D convolutional blocks
- **Features**: Designed for full 3D MRI volumes
- **Use case**: When full 3D brain data is available

## Data Formats Supported

- **Standard Images**: JPG, JPEG, PNG
- **Medical Images**: NIfTI (.nii, .nii.gz)
- **Input Requirements**: Grayscale MRI brain scans
- **Preprocessing**: Automatic resizing, normalization, and augmentation

## Usage Examples

### Training with Custom Data

```python
from src.train import MRIIQTrainer

# Initialize trainer
trainer = MRIIQTrainer(model_type='2d', input_shape=(224, 224, 1))

# Load your data
X, y, filenames = trainer.load_data('path/to/images', 'path/to/labels.csv')

# Train model
trainer.train(X, y, epochs=100, batch_size=16)

# Save model
trainer.save_model('my_trained_model.h5')
```

### Making Predictions

```python
from src.predict import MRIIQPredictor

# Load trained model
predictor = MRIIQPredictor('models/saved/mri_iq_model.h5')

# Predict single image
iq_score = predictor.predict_single('path/to/mri_image.jpg')
print(f"Predicted IQ: {iq_score:.1f}")

# Visualize prediction
predictor.visualize_prediction('path/to/mri_image.jpg', 'output.png')
```

### Model Evaluation

```python
from src.utils.evaluation import analyze_model_performance

# Analyze model performance
analyze_model_performance(y_true, y_predicted, output_dir='analysis_results')
```

## Command Line Options

### Training Options
- `--data_dir`: Directory containing MRI images
- `--labels`: CSV file with image filenames and IQ scores
- `--model_type`: Choose between '2d' or '3d' models
- `--epochs`: Number of training epochs
- `--batch_size`: Training batch size
- `--validation_split`: Fraction of data for validation

### Prediction Options
- `--image`: Path to single image or directory of images
- `--model`: Path to trained model file
- `--visualize`: Create prediction visualizations
- `--output`: Output directory for results

## Performance Metrics

The system provides comprehensive evaluation metrics:

- **Mean Absolute Error (MAE)**: Average prediction error in IQ points
- **Root Mean Square Error (RMSE)**: RMS of prediction errors
- **R-squared (R²)**: Coefficient of determination
- **Mean Absolute Percentage Error (MAPE)**: Percentage-based error metric

## Sample Data

The project includes functionality to generate synthetic MRI-like data for testing:

```python
from src.data.preprocessing import create_sample_data

# Generate 100 sample images with labels
create_sample_data(num_samples=100, output_dir='data/sample')
```

## Ethical Considerations

This project raises important ethical and scientific considerations:

1. **Scientific Validity**: The relationship between brain structure and IQ is complex and not fully understood
2. **Bias and Fairness**: AI models can perpetuate existing biases in data
3. **Privacy**: MRI data is highly sensitive medical information
4. **Misuse Prevention**: Results should not be used for discrimination or clinical decisions
5. **Transparency**: Model limitations and uncertainties should be clearly communicated

## Limitations

- **Limited Training Data**: Performance depends heavily on dataset quality and size
- **Generalization**: Models may not generalize across different populations or scanner types
- **Correlation vs Causation**: The model identifies correlations, not causal relationships
- **IQ Measurement**: IQ itself is a limited measure of human intelligence
- **Technical Constraints**: Simplified model architecture for demonstration purposes

## Contributing

Contributions are welcome! Please consider:

1. **Ethical Guidelines**: Ensure contributions align with responsible AI principles
2. **Scientific Rigor**: Include proper validation and statistical analysis
3. **Documentation**: Maintain clear documentation of methods and limitations
4. **Testing**: Add comprehensive tests for new features

## Future Improvements

- [ ] Support for additional neuroimaging modalities (fMRI, DTI)
- [ ] Advanced 3D CNN architectures (ResNet3D, DenseNet3D)
- [ ] Multi-modal input support (combining different brain imaging types)
- [ ] Uncertainty quantification in predictions
- [ ] Attention mechanisms to identify important brain regions
- [ ] Cross-validation and robust evaluation frameworks

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The neuroimaging and AI/ML communities for foundational research
- Open-source libraries: TensorFlow, scikit-learn, OpenCV, and others
- Medical imaging standards (NIfTI, DICOM) for data interoperability

## Contact

For questions, suggestions, or discussions about this project, please:
- Open an issue on GitHub
- Ensure all discussions maintain scientific and ethical standards
- Consider the broader implications of neuroimaging AI research

---

**Remember**: This is a research/educational tool. Always consult with qualified professionals for any medical or psychological assessments.