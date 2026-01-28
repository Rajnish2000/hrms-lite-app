import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Present");

    const [loading, setLoading] = useState(true);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);

    async function loadEmployees() {
        setLoading(true);
        try {
            const res = await api.get("/employees/");
            setEmployees(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEmployees();
    }, []);

    async function markAttendance(e) {
        e.preventDefault();
        await api.post("/attendance/mark/", {
            employee_id: employeeId,
            date,
            status,
        });
        fetchAttendance(employeeId);
    }

    async function fetchAttendance(id) {
        if (!id) return;
        setRecordsLoading(true);
        try {
            const res = await api.get(`/attendance/${id}/`);
            setAttendanceData(res.data);
        } finally {
            setRecordsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Attendance Management</h1>
                    </div>
                    <p className="text-gray-600 text-xl">Track and manage employee attendance effortlessly</p>
                </div>

                {loading ? (
                    <Loader/>
                ) : employees.length === 0 ? (
                    <EmptyState title="No employees available. Add employees first." />
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
                            <form onSubmit={markAttendance} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <select
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition bg-gray-50"
                                    value={employeeId}
                                    onChange={(e) => {
                                        setEmployeeId(e.target.value);
                                        fetchAttendance(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((e) => (
                                        <option key={e.employee_id} value={e.employee_id}>
                                            {e.full_name} ({e.employee_id})
                                        </option>
                                    ))}
                                </select>

                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                                />

                                <select
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition bg-gray-50"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Present">✓ Present</option>
                                    <option value="Absent">✗ Absent</option>
                                </select>

                                <Button className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
                                    Mark Attendance
                                </Button>
                            </form>
                        </div>

                        {recordsLoading ? (
                            <Loader label="Loading attendance..." />
                        ) : !attendanceData ? (
                            <EmptyState title="Select an employee to view attendance records." />
                        ) : attendanceData.records.length === 0 ? (
                            <EmptyState title="No attendance records found for this employee." />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                {/* Employee Info Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-90">Employee</p>
                                                <p className="text-2xl font-bold">{attendanceData.employee.full_name}</p>
                                                <p className="text-sm opacity-75">
                                                    {attendanceData.employee.employee_id} • {attendanceData.employee.department}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right bg-white/10 px-6 py-3 rounded-xl">
                                            <p className="text-sm opacity-90">Total Present Days</p>
                                            <p className="text-4xl font-bold">{attendanceData.present_days}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Records Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceData.records.map((r) => (
                                                <tr key={r.id} className="border-b border-gray-100 hover:bg-indigo-50 transition">
                                                    <td className="px-6 py-4 text-gray-900 font-medium">{r.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                                r.status === "Present"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >
                                                            {r.status === "Present" ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4" />
                                                            )}
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
