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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Loader />
                ) : employees.length === 0 ? (
                    <EmptyState title="No employees found. Add your first employee." />
                ) : (
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                <tr>
                                    <th className="p-4 text-left font-semibold">Employee ID</th>
                                    <th className="p-4 text-left font-semibold">Full Name</th>
                                    <th className="p-4 text-left font-semibold">Email</th>
                                    <th className="p-4 text-left font-semibold">Department</th>
                                    <th className="p-4 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, idx) => (
                                    <tr key={emp.employee_id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="p-4 font-medium text-gray-900">{emp.employee_id}</td>
                                        <td className="p-4 text-gray-700">{emp.full_name}</td>
                                        <td className="p-4 text-gray-700">{emp.email}</td>
                                        <td className="p-4 text-gray-700">{emp.department}</td>
                                        <td className="p-4">
                                            <button
                                                className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition"
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
