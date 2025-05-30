import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white py-2 rounded-xl shadow transition"
          >
            Login
          </button>

          <div className="text-center mt-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Don't have an account?</span>
            <Link to="/register" className="ml-2 text-primary hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
