import os
import mongoengine as me
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv()

def connect_mongo():
    """
    Connect to MongoDB instance with comprehensive error handling.
    
    Raises:
        ConnectionError: If MongoDB connection fails
        ValueError: If MONGO_URI environment variable is not set
    """
    try:
        mongo_uri = os.getenv("MONGO_URI")
        
        if not mongo_uri:
            error_msg = "MONGO_URI environment variable is not set"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        logger.info('Attempting to connect to MongoDB')
        me.connect(host=mongo_uri)
        logger.info('Successfully connected to MongoDB database')
        
    except ValueError as ve:
        logger.error(f"Configuration error: {str(ve)}")
        raise
        
    except me.ConnectionError as ce:
        error_msg = f"Failed to connect to MongoDB: {str(ce)}"
        logger.error(error_msg)
        raise ConnectionError(error_msg) from ce
        
    except me.ServerSelectionTimeoutError as ste:
        error_msg = f"MongoDB connection timeout: {str(ste)}"
        logger.error(error_msg)
        raise ConnectionError(error_msg) from ste
        
    except Exception as e:
        error_msg = f"Unexpected error connecting to MongoDB: {str(e)}"
        logger.error(error_msg)
        raise ConnectionError(error_msg) from e

