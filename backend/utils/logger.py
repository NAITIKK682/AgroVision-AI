"""
Application Logger Configuration
"""

import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logger(name, log_file=None, level=logging.INFO):
    """
    Setup logger with file and console handlers
    
    Args:
        name: Logger name
        log_file: Log file path
        level: Logging level
    
    Returns:
        Logger: Configured logger
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # File handler (rotating)
    if log_file is None:
        log_file = os.getenv('LOG_FILE', 'logs/agroviz.log')
    
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(detailed_formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    console_handler.setFormatter(simple_formatter)
    
    # Add handlers
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger


# Create application logger
app_logger = setup_logger(
    'agroviz',
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO'))
)