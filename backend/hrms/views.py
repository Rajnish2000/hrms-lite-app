from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from datetime import date as today_date
from .exceptions import (
    HRMSException, DatabaseException, ValidationException,
    NotFoundException, ConflictException, format_error_response
)
from mongoengine.connection import ConnectionFailure
import logging
import mongoengine as me

logger = logging.getLogger(__name__)

# Error response helper
def error_response(message, error_code, status_code):
    return Response({
        "error": error_code,
        "message": message
    }, status=status_code)

# ------------------ Employees ------------------

@api_view(["POST"])
def create_employee(request):
    try:
        serializer = EmployeeSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Validation failed for employee creation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            emp = Employee(
                employee_id=serializer.validated_data["employee_id"],
                full_name=serializer.validated_data["full_name"],
                email=serializer.validated_data["email"],
                department=serializer.validated_data["department"],
            )
            emp.save()
            logger.info(f"Employee created successfully: {emp.employee_id}")
            return Response(
                {"message": "Employee created successfully", "id": str(emp.id)},
                status=status.HTTP_201_CREATED
            )
        except me.NotUniqueError as e:
            logger.error(f"Duplicate employee record: {str(e)}")
            return error_response(
                "Employee ID or Email already exists",
                "DUPLICATE_ENTRY",
                status.HTTP_409_CONFLICT
            )
        except me.ValidationError as e:
            logger.error(f"MongoDB validation error: {str(e)}")
            return error_response(
                "Invalid data format",
                "VALIDATION_ERROR",
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error saving employee: {str(e)}")
            return error_response(
                "Error saving employee. Please try again.",
                "DB_ERROR",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        logger.error(f"Unexpected error in create_employee: {str(e)}")
        return error_response(
            "An unexpected error occurred",
            "INTERNAL_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def list_employees(request):
    try:
        employees = Employee.objects().order_by("-id")
        data = [
            {
                "id": str(e.id),
                "employee_id": e.employee_id,
                "full_name": e.full_name,
                "email": e.email,
                "department": e.department,
                "present_count": Attendance.objects(employee=e.id, status="Present").count(),
                "absent_count": Attendance.objects(employee=e.id, status="Absent").count()
            }
            for e in employees
        ]
        logger.info(f"Retrieved {len(data)} employees")
        return Response(data)
    except me.ConnectionFailure as e:
        logger.error(f"Database connection error: {str(e)}")
        return error_response(
            "Database connection error",
            "DB_CONNECTION_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.error(f"Error retrieving employees: {str(e)}")
        return error_response(
            "Error retrieving employees",
            "DB_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(["DELETE"])
def delete_employee(request, employee_id):
    try:
        emp = Employee.objects(employee_id=employee_id).first()
        if not emp:
            logger.warning(f"Employee not found: {employee_id}")
            return error_response(
                f"Employee with ID '{employee_id}' not found",
                "NOT_FOUND",
                status.HTTP_404_NOT_FOUND
            )
        
        try:
            emp.delete()
            logger.info(f"Employee deleted successfully: {employee_id}")
            return Response(
                {"message": "Employee deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error deleting employee {employee_id}: {str(e)}")
            return error_response(
                "Error deleting employee",
                "DB_ERROR",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        logger.error(f"Unexpected error in delete_employee: {str(e)}")
        return error_response(
            "An unexpected error occurred",
            "INTERNAL_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ------------------ Attendance ------------------

@api_view(["POST"])
def mark_attendance(request):
    try:
        serializer = AttendanceSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Validation failed for attendance: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            emp = serializer.validated_data["employee"]
            date = serializer.validated_data["date"]
            status_value = serializer.validated_data["status"]

            existing = Attendance.objects(employee=emp, date=date).first()
            
            try:
                if existing:
                    existing.status = status_value
                    existing.save()
                    logger.info(f"Attendance updated for {emp.employee_id} on {date}")
                    return Response(
                        {"message": "Attendance updated successfully"},
                        status=status.HTTP_200_OK
                    )

                Attendance(employee=emp, date=date, status=status_value).save()
                logger.info(f"Attendance marked for {emp.employee_id} on {date}")
                return Response(
                    {"message": "Attendance marked successfully"},
                    status=status.HTTP_201_CREATED
                )
            except me.NotUniqueError as e:
                logger.error(f"Duplicate attendance record: {str(e)}")
                return error_response(
                    "Attendance already marked for this employee on this date",
                    "DUPLICATE_ENTRY",
                    status.HTTP_409_CONFLICT
                )
            except me.ValidationError as e:
                logger.error(f"MongoDB validation error: {str(e)}")
                return error_response(
                    "Invalid attendance data",
                    "VALIDATION_ERROR",
                    status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Error saving attendance: {str(e)}")
                return error_response(
                    "Error marking attendance",
                    "DB_ERROR",
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            logger.error(f"Error processing attendance: {str(e)}")
            return error_response(
                "Error processing attendance",
                "PROCESSING_ERROR",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        logger.error(f"Unexpected error in mark_attendance: {str(e)}")
        return error_response(
            "An unexpected error occurred",
            "INTERNAL_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(["GET"])
def employee_attendance(request, employee_id):
    try:
        emp = Employee.objects(employee_id=employee_id).first()
        if not emp:
            logger.warning(f"Employee not found: {employee_id}")
            return error_response(
                f"Employee with ID '{employee_id}' not found",
                "NOT_FOUND",
                status.HTTP_404_NOT_FOUND
            )

        try:
            records = Attendance.objects(employee=emp).order_by("-date")
            data = [
                {
                    "id": str(r.id),
                    "date": str(r.date),
                    "status": r.status
                }
                for r in records
            ]

            present_count = Attendance.objects(employee=emp, status="Present").count()
            absent_count = Attendance.objects(employee=emp, status="Absent").count()
            
            logger.info(f"Retrieved attendance records for {employee_id}")
            return Response({
                "employee": {
                    "employee_id": emp.employee_id,
                    "full_name": emp.full_name,
                    "department": emp.department,
                },
                "present_days": present_count,
                "absent_days": absent_count,
                "records": data
            })
        except me.ConnectionFailure as e:
            logger.error(f"Database connection error: {str(e)}")
            return error_response(
                "Database connection error",
                "DB_CONNECTION_ERROR",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Error retrieving attendance for {employee_id}: {str(e)}")
            return error_response(
                "Error retrieving attendance records",
                "DB_ERROR",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        logger.error(f"Unexpected error in employee_attendance: {str(e)}")
        return error_response(
            "An unexpected error occurred",
            "INTERNAL_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def dashboard_summary(request):
    try:
        today = today_date.today()

        total_employees = Employee.objects.count()

        present_today = Attendance.objects(date=today, status="Present").count()
        absent_today = Attendance.objects(date=today, status="Absent").count()

        marked_today = Attendance.objects(date=today).count()
        not_marked_today = max(total_employees - marked_today, 0)

        return Response({
            "date": str(today),
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": absent_today,
            "not_marked_today": not_marked_today
        }, status=status.HTTP_200_OK)

    except ConnectionFailure as e:
        logger.error(f"MongoDB connection failure: {e}")
        return Response({"message": "Database connection failed."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Unexpected error in dashboard_summary: {e}")
        return Response({"message": "Internal Server Error"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)