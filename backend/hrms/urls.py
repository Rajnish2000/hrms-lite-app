from django.urls import path
from .views import (
    create_employee, list_employees, delete_employee,
    mark_attendance, employee_attendance,dashboard_summary
)

urlpatterns = [
    path('dashboard/summary/',dashboard_summary),
    path("employees/", list_employees),
    path("employees/create/", create_employee),
    path("employees/<str:employee_id>/delete/", delete_employee),

    path("attendance/mark/", mark_attendance),
    path("attendance/<str:employee_id>/", employee_attendance),
]
