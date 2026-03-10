import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/actions/usersActions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export const RegisterUser = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    vehicle: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name || !form.lastName || !form.email || !form.password) {

      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "All fields are required"
      });

      return;

    }

    try {

      setLoading(true);

      const result = await dispatch(
        registerUser(form.email, form.password, form.name, form.lastName, form.vehicle)
      );

      console.log(result)

      if (result.token) {

        await Swal.fire({
          icon: "success",
          title: "User created",
          text: "The user was created successfully",
          confirmButtonText: "OK"
        });

        navigate("/home");

      }

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the user"
      });

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Register User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FIRST NAME */}
          <div>
            <label className="text-sm text-gray-600">
              First Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-sm text-gray-600">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Vehicle
            </label>

            <input
              type="text"
              name="vehicle"
              value={form.vehicle}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>

            <div className="relative mt-1">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 pr-16 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};