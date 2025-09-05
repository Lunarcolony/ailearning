# AI Learning - MRI IQ Prediction Examples

This directory contains example scripts and notebooks demonstrating various aspects of the MRI IQ prediction system.

## Contents

### Training Examples
- `basic_training.py` - Simple training example with synthetic data
- `advanced_training.py` - Advanced training with custom preprocessing and evaluation

### Prediction Examples  
- `single_prediction.py` - Predict IQ from a single MRI image
- `batch_prediction.py` - Process multiple images at once

### Analysis Examples
- `model_evaluation.py` - Comprehensive model performance analysis
- `data_exploration.py` - Explore and visualize MRI datasets

### Notebooks (Jupyter)
- `mri_iq_tutorial.ipynb` - Complete tutorial from data to prediction
- `model_comparison.ipynb` - Compare different model architectures

## Usage

Run any example script from the main project directory:

```bash
cd /path/to/ailearning
python examples/basic_training.py
```

Or open the Jupyter notebooks:

```bash
jupyter notebook examples/mri_iq_tutorial.ipynb
```

## Requirements

All examples require the main project dependencies. Install them first:

```bash
pip install -r requirements.txt
```

For Jupyter notebooks, also install:

```bash
pip install jupyter matplotlib seaborn
```