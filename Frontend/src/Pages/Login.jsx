import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader } from 'lucide-react';

function Login() {
  const { isLoading, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password.trim()) return toast.error("Password is required");
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      await login(formData);
      navigate('/');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="card w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-content">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="text-primary hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <label htmlFor="email" className="label">
            </label>
            <input
              type="text"
              name="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-control w-full relative">
            <label htmlFor="password" className="label">
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-7 text-gray-600"
              onClick={togglePassword}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading && 'btn-disabled'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 animate-spin" /> Logging in
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
