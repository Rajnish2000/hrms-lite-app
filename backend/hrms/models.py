import mongoengine as me

class Employee(me.Document):
    employee_id = me.StringField(required=True, unique=True)
    full_name = me.StringField(required=True)
    email = me.EmailField(required=True, unique=True)
    department = me.StringField(required=True)

    created_at = me.DateTimeField()

    meta = {"collection": "employees"}

class Attendance(me.Document):
    employee = me.ReferenceField(Employee, required=True, reverse_delete_rule=me.CASCADE)
    date = me.DateField(required=True)
    status = me.StringField(required=True, choices=["Present", "Absent"])

    meta = {
        "collection": "attendance",
        "indexes": [
            {"fields": ["employee", "date"], "unique": True}
        ]
    }
