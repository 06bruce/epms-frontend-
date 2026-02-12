import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Logo from "../common/Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/employee"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Employees
                </Link>
                <Link
                  to="/department"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Departments
                </Link>
                <Link
                  to="/salaryform"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Payroll
                </Link>
                <Link
                  to="/report"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Reports
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm !py-1.5">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {user?.username || "User"}
                  </span>
                  <span className="text-xs text-slate-500">Administrator</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

