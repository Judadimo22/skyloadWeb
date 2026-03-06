import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/actions/usersActions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export const RegisterUser = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: ""
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
      alert("Todos los campos son obligatorios");
      return;
    }

    try {

      setLoading(true);

      console.log("Usuario a registrar:", form);

      const result = await dispatch(
        registerUser(form.email, form.password, form.name, form.lastName)
      );

      if (result.status) {

        await Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario fue creado correctamente",
          confirmButtonText: "Aceptar"
        });

        navigate("/home");
      }

      setLoading(false);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Registrar Usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="text-sm text-gray-600">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="text-sm text-gray-600">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="text-sm text-gray-600">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}