import re
from rest_framework import serializers
from .models import Employee, Attendance

class EmployeeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    department = serializers.CharField()

    def validate_employee_id(self, value):
        if Employee.objects(employee_id=value).first():
            raise serializers.ValidationError("Employee ID already exists.")
        return value

    def validate_email(self, value):
        if Employee.objects(email=value).first():
            raise serializers.ValidationError("Email already exists.")
        return value

class AttendanceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=["Present", "Absent"])

    def validate(self, attrs):
        emp = Employee.objects(employee_id=attrs["employee_id"]).first()
        if not emp:
            raise serializers.ValidationError({"employee_id": "Employee not found."})
        attrs["employee"] = emp
        return attrs
