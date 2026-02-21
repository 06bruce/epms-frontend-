import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axios";
import { toast } from "sonner";
import Logo from "../../common/Logo";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await api.post("/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      toast.success("Account created successfully! Redirecting to Department page...");
      navigate("/department");
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500">Join EPMS for streamlined payroll management.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">Work Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" required />
              <label htmlFor="terms" className="text-sm text-slate-500">
                I agree to the <Link to="#" className="text-slate-900 font-semibold hover:underline">Terms of Service</Link> and <Link to="#" className="text-slate-900 font-semibold hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-900 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
