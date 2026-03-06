import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Link } from "react-router";

export const UsersList =() =>  {

  const [usuarios] = useState([
    {
      id: 1,
      name: "Juan David",
      email: "juan@email.com",
      role: "Administrador"
    },
    {
      id: 2,
      name: "Laura Gómez",
      email: "laura@email.com",
      role: "Operador"
    }
  ]);

  const handleNuevoUsuario = () => {
    console.log("Registrar nuevo usuario");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold text-gray-800">
          Usuarios
        </h2>

        <Link to='/registerUser'>
        <button
          onClick={handleNuevoUsuario}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={18} />
          Registrar usuario
        </button>
        </Link>

      </div>

      {/* TABLA */}
      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-left text-sm text-gray-600">

              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Rol</th>

            </tr>

          </thead>

          <tbody>

            {usuarios.map((usuario) => (

              <tr
                key={usuario.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4 text-gray-800">
                  {usuario.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {usuario.email}
                </td>

                <td className="px-6 py-4">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {usuario.role}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}