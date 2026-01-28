from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from datetime import date as today_date

# ------------------ Employees ------------------

@api_view(["POST"])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        emp = Employee(
            employee_id=serializer.validated_data["employee_id"],
            full_name=serializer.validated_data["full_name"],
            email=serializer.validated_data["email"],
            department=serializer.validated_data["department"],
        )
        emp.save()
        return Response({"message": "Employee created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_employees(request):
    employees = Employee.objects().order_by("-id")
    data = [
        {
            "id": str(e.id),
            "employee_id": e.employee_id,
            "full_name": e.full_name,
            "email": e.email,
            "department": e.department,
        }
        for e in employees
    ]
    return Response(data)


@api_view(["DELETE"])
def delete_employee(request, employee_id):
    emp = Employee.objects(employee_id=employee_id).first()
    if not emp:
        return Response({"message": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

    emp.delete()
    return Response({"message": "Employee deleted successfully"}, status=status.HTTP_200_OK)


# ------------------ Attendance ------------------

@api_view(["POST"])
def mark_attendance(request):
    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        emp = serializer.validated_data["employee"]
        date = serializer.validated_data["date"]
        status_value = serializer.validated_data["status"]

        existing = Attendance.objects(employee=emp, date=date).first()
        if existing:
            existing.status = status_value
            existing.save()
            return Response({"message": "Attendance updated successfully"}, status=status.HTTP_200_OK)

        Attendance(employee=emp, date=date, status=status_value).save()
        return Response({"message": "Attendance marked successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def employee_attendance(request, employee_id):
    emp = Employee.objects(employee_id=employee_id).first()
    if not emp:
        return Response({"message": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

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

    return Response({
        "employee": {
            "employee_id": emp.employee_id,
            "full_name": emp.full_name,
            "department": emp.department,
        },
        "present_days": present_count,
        "records": data
    })

@api_view(["GET"])
def dashboard_summary(request):
    today = today_date.today()

    total_employees = Employee.objects().count()

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
    })