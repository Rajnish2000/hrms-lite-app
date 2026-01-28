import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const linkClass = ({ isActive }) =>
        "px-4 py-2 rounded-lg text-sm transition duration-300 " +
        (isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-500 hover:text-white");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="border-b bg-white shadow-md sticky top-0 z-10 font-sans">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap">
                <h1 className="font-bold text-2xl text-blue-600">HRMS Lite</h1>
                <button className="md:hidden p-2 text-gray-700 hover:bg-blue-500 rounded-lg" onClick={toggleMenu}>
                    Menu
                </button>
                <div className={`fixed inset-0 bg-white transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden font-sans`}>
                    <div className="flex flex-col p-4">
                        <NavLink className={linkClass} to="/" onClick={toggleMenu}>Dashboard</NavLink>
                        <NavLink className={linkClass} to="/employees" onClick={toggleMenu}>Employees</NavLink>
                        <NavLink className={linkClass} to="/attendance" onClick={toggleMenu}>Attendance</NavLink>
                    </div>
                </div>
                <div className="hidden md:flex gap-4 font-sans">
                    <NavLink className={linkClass} to="/">Dashboard</NavLink>
                    <NavLink className={linkClass} to="/employees">Employees</NavLink>
                    <NavLink className={linkClass} to="/attendance">Attendance</NavLink>
                </div>
            </div>
        </div>
    );
}
