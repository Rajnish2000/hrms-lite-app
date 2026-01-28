import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { Trash2, Users } from "lucide-react";

export default function Employees() {
    const [form, setForm] = useState({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
    });

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    async function fetchEmployees() {
        setLoading(true);
        try {
            const res = await api.get("/employees/"); 
            setEmployees(res.data);
        } catch (err) {
            setError("Failed to load employees.", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function createEmployee(e) {
        e.preventDefault();
        setCreating(true);
        setError("");
        try {
            await api.post("/employees/create/", form);
            setForm({ employee_id: "", full_name: "", email: "", department: "" });
            fetchEmployees();
        } catch (err) {
            setError(
                err?.response?.data?.email ||
                    err?.response?.data?.employee_id ||
                    "Something went wrong"
            );
        } finally {
            setCreating(false);
        }
    }

    async function deleteEmployee(employee_id) {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            await api.delete(`/employees/${employee_id}/delete/`);
            fetchEmployees();
        } catch {
            alert("Failed to delete employee");
        }
    }

    const [searchTerm, setSearchTerm] = useState("");

    const filteredEmployees = employees.filter((emp) =>
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-indigo-600 p-3 rounded-lg">
                        <Users className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Employees</h2>
                </div>

                <form
                    onSubmit={createEmployee}
                    className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-4 gap-4 mb-8 border border-gray-200"
                >
                    <Input
                        placeholder="Employee ID"
                        value={form.employee_id}
                        onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Department"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        required
                    />
                    <div className="md:col-span-4">
                        <Button disabled={creating} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {creating ? "Creating..." : "Add Employee"}
                        </Button>
                    </div>
                </form>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search employees by ID, name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 pl-12 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 shadow-md transition placeholder-gray-500 text-gray-700"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Loader />
                ) : filteredEmployees.length === 0 ? (
                    <EmptyState title="No employees found. Add your first employee." />
                ) : (
                    <div className="bg-white shadow-lg rounded-2xl overflow-x-auto border border-gray-200">
                        <table className="w-full text-base">
                            <thead className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white sticky top-0">
                                <tr>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Employee ID</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Full Name</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Email</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Department</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Present</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Absent</th>
                                    <th className="p-4 text-left font-semibold whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, idx) => (
                                    <tr key={emp.employee_id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="p-4 font-medium text-gray-900">{emp.employee_id}</td>
                                        <td className="p-4 text-gray-700">{emp.full_name}</td>
                                        <td className="p-4 text-gray-700 break-all">{emp.email}</td>
                                        <td className="p-4 text-gray-700">{emp.department}</td>
                                        <td className="p-4 text-gray-700">{emp.present_count}</td>
                                        <td className="p-4 text-gray-700">{emp.absent_count}</td>
                                        <td className="p-4">
                                            <button
                                                className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition whitespace-nowrap"
                                                onClick={() => deleteEmployee(emp.employee_id)}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
