import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-bold">
            S
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">SymptoScan</p>
            <p className="text-xs text-slate-500">Healthcare Web App</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/doctors" className="hover:text-blue-600">Doctors</Link>
          <Link to="/predict" className="hover:text-blue-600">Predict</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : !isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-sm text-slate-600">
                Hi, {user?.name || user?.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}