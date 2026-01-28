"""
Custom exception classes and error handlers for the HRMS application.
"""

class HRMSException(Exception):
    """Base exception class for HRMS application"""
    def __init__(self, message, status_code=400, error_code=None):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "GENERIC_ERROR"
        super().__init__(self.message)


class DatabaseException(HRMSException):
    """Exception for database-related errors"""
    def __init__(self, message, status_code=500, error_code="DB_ERROR"):
        super().__init__(message, status_code, error_code)


class ValidationException(HRMSException):
    """Exception for validation-related errors"""
    def __init__(self, message, status_code=400, error_code="VALIDATION_ERROR"):
        super().__init__(message, status_code, error_code)


class NotFoundException(HRMSException):
    """Exception for resource not found errors"""
    def __init__(self, message, status_code=404, error_code="NOT_FOUND"):
        super().__init__(message, status_code, error_code)


class ConflictException(HRMSException):
    """Exception for conflict errors (duplicate entries, etc.)"""
    def __init__(self, message, status_code=409, error_code="CONFLICT"):
        super().__init__(message, status_code, error_code)


class UnauthorizedException(HRMSException):
    """Exception for unauthorized access"""
    def __init__(self, message, status_code=401, error_code="UNAUTHORIZED"):
        super().__init__(message, status_code, error_code)


def format_error_response(exc):
    """
    Format exception into a standardized error response.
    
    Args:
        exc: Exception instance
        
    Returns:
        Dictionary with error information
    """
    if isinstance(exc, HRMSException):
        return {
            "error": exc.error_code,
            "message": exc.message,
            "status_code": exc.status_code
        }
    
    return {
        "error": "INTERNAL_SERVER_ERROR",
        "message": "An unexpected error occurred. Please try again later.",
        "status_code": 500
    }
