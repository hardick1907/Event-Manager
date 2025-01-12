import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error('Name is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
    if (!formData.password.trim()) return toast.error('Password is required');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      await register(formData);
      navigate('/');
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="card w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
          <p className="text-sm text-gray-600 mt-2">
            Or{' '}
            <Link
              to="/login"
              className="text-primary hover:underline"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Full name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email address</span>
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-control relative">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-12 text-gray-600"
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
                  <Loader className="animate-spin mr-2" /> Signing up
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
