import re
from rest_framework import serializers
from .models import Employee, Attendance
import mongoengine as me
import logging

logger = logging.getLogger(__name__)

class EmployeeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    department = serializers.CharField()

    def validate_employee_id(self, value):
        """
        Validate that employee_id is unique.
        
        Args:
            value: The employee_id value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If employee_id already exists
        """
        try:
            if not value or not isinstance(value, str):
                raise serializers.ValidationError("Employee ID must be a non-empty string.")
            
            if Employee.objects(employee_id=value).first():
                logger.warning(f"Duplicate employee ID attempted: {value}")
                raise serializers.ValidationError("Employee ID already exists.")
            
            return value
        except me.ConnectionFailure as e:
            logger.error(f"Database connection error during employee_id validation: {str(e)}")
            raise serializers.ValidationError("Database error occurred. Please try again.")
        except Exception as e:
            logger.error(f"Unexpected error validating employee_id: {str(e)}")
            raise serializers.ValidationError("An error occurred during validation.")

    def validate_email(self, value):
        """
        Validate that email is unique.
        
        Args:
            value: The email value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If email already exists
        """
        try:
            if not value or not isinstance(value, str):
                raise serializers.ValidationError("Email must be a non-empty string.")
            
            if Employee.objects(email=value).first():
                logger.warning(f"Duplicate email attempted: {value}")
                raise serializers.ValidationError("Email already exists.")
            
            return value
        except me.ConnectionFailure as e:
            logger.error(f"Database connection error during email validation: {str(e)}")
            raise serializers.ValidationError("Database error occurred. Please try again.")
        except Exception as e:
            logger.error(f"Unexpected error validating email: {str(e)}")
            raise serializers.ValidationError("An error occurred during validation.")

    def validate_full_name(self, value):
        """
        Validate that full_name is not empty.
        
        Args:
            value: The full_name value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If full_name is empty
        """
        if not value or not isinstance(value, str) or not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        return value.strip()

    def validate_department(self, value):
        """
        Validate that department is not empty.
        
        Args:
            value: The department value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If department is empty
        """
        if not value or not isinstance(value, str) or not value.strip():
            raise serializers.ValidationError("Department cannot be empty.")
        return value.strip()


class AttendanceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=["Present", "Absent"])

    def validate_date(self, value):
        """
        Validate that date is valid.
        
        Args:
            value: The date value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If date is invalid
        """
        try:
            if not value:
                raise serializers.ValidationError("Date cannot be empty.")
            return value
        except Exception as e:
            logger.error(f"Error validating date: {str(e)}")
            raise serializers.ValidationError("Invalid date format.")

    def validate_status(self, value):
        """
        Validate that status is valid.
        
        Args:
            value: The status value to validate
            
        Returns:
            The validated value
            
        Raises:
            serializers.ValidationError: If status is invalid
        """
        if value not in ["Present", "Absent"]:
            logger.warning(f"Invalid attendance status attempted: {value}")
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")
        return value

    def validate(self, attrs):
        """
        Validate the entire attendance record.
        
        Args:
            attrs: The attributes dictionary
            
        Returns:
            The validated attributes dictionary
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        try:
            employee_id = attrs.get("employee_id")
            
            if not employee_id:
                raise serializers.ValidationError({"employee_id": "Employee ID is required."})
            
            try:
                emp = Employee.objects(employee_id=employee_id).first()
                if not emp:
                    logger.warning(f"Employee not found during attendance validation: {employee_id}")
                    raise serializers.ValidationError({"employee_id": "Employee not found."})
                attrs["employee"] = emp
            except me.ConnectionFailure as e:
                logger.error(f"Database connection error during employee lookup: {str(e)}")
                raise serializers.ValidationError("Database error occurred. Please try again.")
            
            return attrs
        except serializers.ValidationError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during attendance validation: {str(e)}")
            raise serializers.ValidationError("An error occurred during validation.")
