import numpy as np
import cv2
from PIL import Image
import nibabel as nib
from sklearn.preprocessing import StandardScaler
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MRIPreprocessor:
    """
    Class for preprocessing MRI images for IQ prediction.
    
    Handles various MRI formats including NIfTI (.nii) and standard image formats.
    """
    
    def __init__(self, target_size=(128, 128, 128), normalize=True):
        """
        Initialize the MRI preprocessor.
        
        Args:
            target_size: Target size for resizing MRI volumes (3D) or images (2D)
            normalize: Whether to normalize pixel values
        """
        self.target_size = target_size
        self.normalize = normalize
        self.scaler = StandardScaler() if normalize else None
        
    def load_nifti(self, filepath):
        """
        Load a NIfTI (.nii or .nii.gz) MRI file.
        
        Args:
            filepath: Path to the NIfTI file
            
        Returns:
            3D numpy array of the MRI volume
        """
        try:
            img = nib.load(filepath)
            data = img.get_fdata()
            logger.info(f"Loaded NIfTI file: {filepath}, shape: {data.shape}")
            return data
        except Exception as e:
            logger.error(f"Error loading NIfTI file {filepath}: {e}")
            return None
    
    def load_image(self, filepath):
        """
        Load a standard image file (JPG, PNG, etc.).
        
        Args:
            filepath: Path to the image file
            
        Returns:
            2D or 3D numpy array of the image
        """
        try:
            if filepath.lower().endswith(('.nii', '.nii.gz')):
                return self.load_nifti(filepath)
            
            # Load standard image formats
            img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
            if img is None:
                # Try with PIL as fallback
                img = Image.open(filepath).convert('L')
                img = np.array(img)
            
            logger.info(f"Loaded image file: {filepath}, shape: {img.shape}")
            return img
        except Exception as e:
            logger.error(f"Error loading image file {filepath}: {e}")
            return None
    
    def resize_3d(self, volume, target_size):
        """
        Resize a 3D MRI volume to target size.
        
        Args:
            volume: 3D numpy array
            target_size: Target size tuple (height, width, depth)
            
        Returns:
            Resized 3D volume
        """
        # Use scipy's zoom for 3D resizing
        from scipy.ndimage import zoom
        
        current_shape = volume.shape
        zoom_factors = [t/c for t, c in zip(target_size, current_shape)]
        
        resized = zoom(volume, zoom_factors, order=1)  # Linear interpolation
        return resized
    
    def resize_2d(self, image, target_size):
        """
        Resize a 2D image to target size.
        
        Args:
            image: 2D numpy array
            target_size: Target size tuple (height, width)
            
        Returns:
            Resized 2D image
        """
        if len(target_size) == 3:
            target_size = target_size[:2]  # Take only height and width
            
        resized = cv2.resize(image, (target_size[1], target_size[0]))
        return resized
    
    def normalize_image(self, image):
        """
        Normalize image pixel values.
        
        Args:
            image: Input image array
            
        Returns:
            Normalized image array
        """
        # Remove outliers by clipping to 5th and 95th percentiles
        p5, p95 = np.percentile(image, [5, 95])
        image = np.clip(image, p5, p95)
        
        # Normalize to [0, 1] range
        image = (image - image.min()) / (image.max() - image.min() + 1e-8)
        
        return image
    
    def augment_image(self, image, rotation_range=10, zoom_range=0.1, flip_horizontal=True):
        """
        Apply data augmentation to an image.
        
        Args:
            image: Input image
            rotation_range: Range for random rotation (degrees)
            zoom_range: Range for random zoom
            flip_horizontal: Whether to apply random horizontal flip
            
        Returns:
            Augmented image
        """
        if len(image.shape) == 2:  # 2D image
            # Random rotation
            if rotation_range > 0:
                angle = np.random.uniform(-rotation_range, rotation_range)
                center = (image.shape[1] // 2, image.shape[0] // 2)
                rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
                image = cv2.warpAffine(image, rotation_matrix, (image.shape[1], image.shape[0]))
            
            # Random zoom
            if zoom_range > 0:
                zoom_factor = np.random.uniform(1 - zoom_range, 1 + zoom_range)
                h, w = image.shape
                new_h, new_w = int(h * zoom_factor), int(w * zoom_factor)
                resized = cv2.resize(image, (new_w, new_h))
                
                # Center crop or pad
                if zoom_factor > 1:  # Crop
                    start_h = (new_h - h) // 2
                    start_w = (new_w - w) // 2
                    image = resized[start_h:start_h + h, start_w:start_w + w]
                else:  # Pad
                    pad_h = (h - new_h) // 2
                    pad_w = (w - new_w) // 2
                    image = np.pad(resized, ((pad_h, h - new_h - pad_h), (pad_w, w - new_w - pad_w)), mode='constant')
            
            # Random horizontal flip
            if flip_horizontal and np.random.rand() > 0.5:
                image = cv2.flip(image, 1)
        
        return image
    
    def preprocess_single(self, filepath, augment=False):
        """
        Preprocess a single MRI file.
        
        Args:
            filepath: Path to the MRI file
            augment: Whether to apply data augmentation
            
        Returns:
            Preprocessed image array ready for model input
        """
        # Load the image
        image = self.load_image(filepath)
        if image is None:
            return None
        
        # Handle different dimensionalities
        if len(image.shape) == 3:  # 3D volume
            if len(self.target_size) == 3:
                image = self.resize_3d(image, self.target_size)
            else:
                # Take middle slice for 2D processing
                middle_slice = image.shape[2] // 2
                image = image[:, :, middle_slice]
                image = self.resize_2d(image, self.target_size)
        
        elif len(image.shape) == 2:  # 2D image
            if len(self.target_size) == 3:
                # For 3D target, we can't convert 2D to 3D meaningfully
                logger.warning("Cannot convert 2D image to 3D. Using 2D processing.")
                image = self.resize_2d(image, self.target_size[:2])
            else:
                image = self.resize_2d(image, self.target_size)
        
        # Normalize
        if self.normalize:
            image = self.normalize_image(image)
        
        # Apply augmentation if requested
        if augment:
            image = self.augment_image(image)
        
        # Add channel dimension if needed
        if len(image.shape) == 2:
            image = np.expand_dims(image, axis=-1)
        elif len(image.shape) == 3 and len(self.target_size) == 3:
            image = np.expand_dims(image, axis=-1)
        
        return image
    
    def preprocess_batch(self, filepaths, augment=False):
        """
        Preprocess a batch of MRI files.
        
        Args:
            filepaths: List of file paths
            augment: Whether to apply data augmentation
            
        Returns:
            Numpy array of preprocessed images
        """
        processed_images = []
        
        for filepath in filepaths:
            processed = self.preprocess_single(filepath, augment=augment)
            if processed is not None:
                processed_images.append(processed)
            else:
                logger.warning(f"Failed to process {filepath}")
        
        if processed_images:
            return np.array(processed_images)
        else:
            return None


def create_sample_data(num_samples=100, output_dir="data/sample"):
    """
    Create sample synthetic MRI data for testing purposes.
    
    Args:
        num_samples: Number of sample images to create
        output_dir: Directory to save sample data
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Create synthetic MRI-like images with some structure
    for i in range(num_samples):
        # Create a brain-like structure with random variations
        img = np.zeros((224, 224), dtype=np.uint8)
        
        # Add brain outline (elliptical shape)
        center = (112, 112)
        axes = (80 + np.random.randint(-10, 10), 100 + np.random.randint(-10, 10))
        angle = np.random.randint(0, 180)
        cv2.ellipse(img, center, axes, angle, 0, 360, 128, -1)
        
        # Add some internal structures
        for _ in range(np.random.randint(3, 8)):
            center = (np.random.randint(50, 174), np.random.randint(50, 174))
            radius = np.random.randint(5, 20)
            intensity = np.random.randint(64, 255)
            cv2.circle(img, center, radius, intensity, -1)
        
        # Add noise
        noise = np.random.normal(0, 10, img.shape)
        img = np.clip(img + noise, 0, 255).astype(np.uint8)
        
        # Save the image
        filename = f"sample_mri_{i:03d}.jpg"
        cv2.imwrite(os.path.join(output_dir, filename), img)
    
    # Create corresponding IQ labels (synthetic)
    iq_scores = np.random.normal(100, 15, num_samples)  # Normal distribution around 100
    iq_scores = np.clip(iq_scores, 70, 150)  # Clip to reasonable range
    
    # Save labels
    labels_file = os.path.join(output_dir, "iq_labels.txt")
    with open(labels_file, 'w') as f:
        for i, iq in enumerate(iq_scores):
            f.write(f"sample_mri_{i:03d}.jpg,{iq:.1f}\n")
    
    logger.info(f"Created {num_samples} sample images and labels in {output_dir}")