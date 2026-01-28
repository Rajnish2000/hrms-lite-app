import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Loader from "../components/Loader";

export default function Dashboard() {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
      const res = await api.get("/dashboard/summary/");
      console.log(res.data);
      setSummary(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    }

    useEffect(() => { load(); }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-gray-600 mt-2">Welcome back! Here's your HR overview</p>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Employees</p>
                                    <p className="text-5xl font-bold text-gray-900 mt-2">{summary.total_employees}</p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Present</p>
                                    <p className="text-5xl font-bold text-gray-900 mt-2">{summary.present_today}</p>
                                    <p className="text-sm text-gray-500 mt-2">Today</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Absent</p>
                                    <p className="text-5xl font-bold text-gray-900 mt-2">{summary.absent_today}</p>
                                    <p className="text-sm text-gray-500 mt-2">Today</p>
                                </div>
                                <div className="bg-red-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total UnMarked Attendance</p>
                                    <p className="text-5xl font-bold text-gray-900 mt-2">{summary.not_marked_today}</p>
                                    <p className="text-sm text-gray-500 mt-2">Today</p>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
