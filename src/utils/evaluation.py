import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pandas as pd
import os


def calculate_regression_metrics(y_true, y_pred):
    """
    Calculate regression metrics for IQ prediction.
    
    Args:
        y_true: True IQ values
        y_pred: Predicted IQ values
        
    Returns:
        Dictionary of metrics
    """
    metrics = {
        'mae': mean_absolute_error(y_true, y_pred),
        'mse': mean_squared_error(y_true, y_pred),
        'rmse': np.sqrt(mean_squared_error(y_true, y_pred)),
        'r2': r2_score(y_true, y_pred),
        'mape': np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    }
    return metrics


def plot_prediction_results(y_true, y_pred, save_path=None, title="IQ Prediction Results"):
    """
    Create comprehensive plots for prediction results.
    
    Args:
        y_true: True IQ values
        y_pred: Predicted IQ values
        save_path: Path to save the plot
        title: Title for the plot
    """
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # Scatter plot: True vs Predicted
    axes[0, 0].scatter(y_true, y_pred, alpha=0.6, edgecolors='k', linewidth=0.5)
    axes[0, 0].plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', lw=2)
    axes[0, 0].set_xlabel('True IQ')
    axes[0, 0].set_ylabel('Predicted IQ')
    axes[0, 0].set_title('True vs Predicted IQ')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Add R² to the plot
    r2 = r2_score(y_true, y_pred)
    axes[0, 0].text(0.05, 0.95, f'R² = {r2:.3f}', transform=axes[0, 0].transAxes, 
                   bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    # Residual plot
    residuals = y_true - y_pred
    axes[0, 1].scatter(y_pred, residuals, alpha=0.6, edgecolors='k', linewidth=0.5)
    axes[0, 1].axhline(y=0, color='r', linestyle='--', lw=2)
    axes[0, 1].set_xlabel('Predicted IQ')
    axes[0, 1].set_ylabel('Residuals (True - Predicted)')
    axes[0, 1].set_title('Residual Plot')
    axes[0, 1].grid(True, alpha=0.3)
    
    # Histogram of residuals
    axes[1, 0].hist(residuals, bins=30, alpha=0.7, edgecolor='black')
    axes[1, 0].axvline(residuals.mean(), color='r', linestyle='--', linewidth=2, 
                      label=f'Mean: {residuals.mean():.2f}')
    axes[1, 0].set_xlabel('Residuals')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title('Distribution of Residuals')
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)
    
    # Error distribution
    abs_errors = np.abs(residuals)
    axes[1, 1].hist(abs_errors, bins=30, alpha=0.7, edgecolor='black', color='orange')
    axes[1, 1].axvline(abs_errors.mean(), color='r', linestyle='--', linewidth=2,
                      label=f'MAE: {abs_errors.mean():.2f}')
    axes[1, 1].set_xlabel('Absolute Error')
    axes[1, 1].set_ylabel('Frequency')
    axes[1, 1].set_title('Distribution of Absolute Errors')
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)
    
    plt.suptitle(title, fontsize=16)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Plot saved to {save_path}")
    
    plt.show()


def plot_iq_distribution(iq_scores, title="IQ Score Distribution", save_path=None):
    """
    Plot distribution of IQ scores.
    
    Args:
        iq_scores: Array of IQ scores
        title: Title for the plot
        save_path: Path to save the plot
    """
    plt.figure(figsize=(10, 6))
    
    # Histogram
    plt.hist(iq_scores, bins=30, alpha=0.7, edgecolor='black', density=True)
    
    # Add normal distribution overlay
    mu, sigma = np.mean(iq_scores), np.std(iq_scores)
    x = np.linspace(iq_scores.min(), iq_scores.max(), 100)
    normal_dist = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)
    plt.plot(x, normal_dist, 'r-', linewidth=2, label=f'Normal (μ={mu:.1f}, σ={sigma:.1f})')
    
    # Add statistics
    plt.axvline(mu, color='red', linestyle='--', alpha=0.8, label=f'Mean: {mu:.1f}')
    plt.axvline(np.median(iq_scores), color='green', linestyle='--', alpha=0.8, 
               label=f'Median: {np.median(iq_scores):.1f}')
    
    plt.xlabel('IQ Score')
    plt.ylabel('Density')
    plt.title(title)
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Plot saved to {save_path}")
    
    plt.show()


def create_performance_report(y_true, y_pred, save_path=None):
    """
    Create a comprehensive performance report.
    
    Args:
        y_true: True IQ values
        y_pred: Predicted IQ values
        save_path: Path to save the report
        
    Returns:
        Dictionary containing all metrics and statistics
    """
    # Calculate metrics
    metrics = calculate_regression_metrics(y_true, y_pred)
    
    # Additional statistics
    residuals = y_true - y_pred
    abs_errors = np.abs(residuals)
    
    stats = {
        'n_samples': len(y_true),
        'true_iq_mean': np.mean(y_true),
        'true_iq_std': np.std(y_true),
        'pred_iq_mean': np.mean(y_pred),
        'pred_iq_std': np.std(y_pred),
        'residual_mean': np.mean(residuals),
        'residual_std': np.std(residuals),
        'max_error': np.max(abs_errors),
        'min_error': np.min(abs_errors),
        'error_percentile_95': np.percentile(abs_errors, 95),
        'error_percentile_75': np.percentile(abs_errors, 75),
        'error_percentile_50': np.percentile(abs_errors, 50),
        'error_percentile_25': np.percentile(abs_errors, 25)
    }
    
    # Combine metrics and stats
    report = {**metrics, **stats}
    
    # Create report text
    report_text = f"""
MRI IQ Prediction Performance Report
====================================

Dataset Statistics:
- Number of samples: {stats['n_samples']}
- True IQ Mean ± Std: {stats['true_iq_mean']:.2f} ± {stats['true_iq_std']:.2f}
- Predicted IQ Mean ± Std: {stats['pred_iq_mean']:.2f} ± {stats['pred_iq_std']:.2f}

Prediction Metrics:
- Mean Absolute Error (MAE): {metrics['mae']:.2f} IQ points
- Root Mean Square Error (RMSE): {metrics['rmse']:.2f} IQ points
- R-squared (R²): {metrics['r2']:.3f}
- Mean Absolute Percentage Error (MAPE): {metrics['mape']:.2f}%

Error Analysis:
- Residual Mean ± Std: {stats['residual_mean']:.2f} ± {stats['residual_std']:.2f}
- Maximum Error: {stats['max_error']:.2f} IQ points
- Minimum Error: {stats['min_error']:.2f} IQ points

Error Percentiles:
- 95th percentile: {stats['error_percentile_95']:.2f} IQ points
- 75th percentile: {stats['error_percentile_75']:.2f} IQ points
- 50th percentile (median): {stats['error_percentile_50']:.2f} IQ points
- 25th percentile: {stats['error_percentile_25']:.2f} IQ points

Interpretation:
- An MAE of {metrics['mae']:.1f} means predictions are typically off by ±{metrics['mae']:.1f} IQ points
- An R² of {metrics['r2']:.3f} means the model explains {metrics['r2']*100:.1f}% of the variance
- 95% of predictions have errors ≤ {stats['error_percentile_95']:.1f} IQ points
"""
    
    print(report_text)
    
    if save_path:
        with open(save_path, 'w') as f:
            f.write(report_text)
        print(f"Report saved to {save_path}")
    
    return report


def analyze_model_performance(y_true, y_pred, output_dir="analysis_results"):
    """
    Complete analysis of model performance with visualizations and report.
    
    Args:
        y_true: True IQ values
        y_pred: Predicted IQ values
        output_dir: Directory to save analysis results
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate comprehensive plots
    plot_prediction_results(
        y_true, y_pred, 
        save_path=os.path.join(output_dir, "prediction_analysis.png"),
        title="MRI IQ Prediction Analysis"
    )
    
    # Plot IQ distributions
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # True IQ distribution
    plt.subplot(1, 2, 1)
    plot_iq_distribution(
        y_true, 
        title="True IQ Distribution",
        save_path=None
    )
    
    # Predicted IQ distribution
    plt.subplot(1, 2, 2)
    plot_iq_distribution(
        y_pred, 
        title="Predicted IQ Distribution",
        save_path=None
    )
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "iq_distributions.png"), dpi=300, bbox_inches='tight')
    plt.show()
    
    # Create performance report
    report = create_performance_report(
        y_true, y_pred,
        save_path=os.path.join(output_dir, "performance_report.txt")
    )
    
    # Save detailed results as CSV
    results_df = pd.DataFrame({
        'true_iq': y_true,
        'predicted_iq': y_pred,
        'residual': y_true - y_pred,
        'absolute_error': np.abs(y_true - y_pred)
    })
    
    results_csv_path = os.path.join(output_dir, "detailed_results.csv")
    results_df.to_csv(results_csv_path, index=False)
    print(f"Detailed results saved to {results_csv_path}")
    
    return report


def compare_models(results_dict, save_path=None):
    """
    Compare performance of multiple models.
    
    Args:
        results_dict: Dictionary with model names as keys and (y_true, y_pred) tuples as values
        save_path: Path to save comparison plot
    """
    metrics_df = []
    
    for model_name, (y_true, y_pred) in results_dict.items():
        metrics = calculate_regression_metrics(y_true, y_pred)
        metrics['model'] = model_name
        metrics_df.append(metrics)
    
    metrics_df = pd.DataFrame(metrics_df)
    
    # Create comparison plot
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    metrics_to_plot = ['mae', 'rmse', 'r2', 'mape']
    titles = ['Mean Absolute Error', 'Root Mean Square Error', 'R-squared', 'Mean Absolute Percentage Error']
    
    for i, (metric, title) in enumerate(zip(metrics_to_plot, titles)):
        row, col = i // 2, i % 2
        
        bars = axes[row, col].bar(metrics_df['model'], metrics_df[metric])
        axes[row, col].set_title(title)
        axes[row, col].set_ylabel(metric.upper())
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            axes[row, col].text(bar.get_x() + bar.get_width()/2., height,
                               f'{height:.3f}', ha='center', va='bottom')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Comparison plot saved to {save_path}")
    
    plt.show()
    
    return metrics_df