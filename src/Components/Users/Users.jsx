import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/actions/adminActions";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";

export const UsersList =() =>  {
  const users= useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getUsers());
      } catch (error) {
        console.log('Error al obtener los productos:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleNuevoUsuario = () => {
    console.log("Registrar nuevo usuario");
  };

  const handleAsignarCarga = async (usuario) => {
    const { value: formValues } = await Swal.fire({
      title: `<span style="font-size:22px;font-weight:600">Asignar carga</span>`,
      width: 700,
      showCancelButton: true,
      confirmButtonText: "Crear carga",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-6 py-2 rounded-lg",
        cancelButton: "px-6 py-2 rounded-lg"
      },

      html: `
      <div class="load-modal">

        <div class="user-row">
          <span class="user-label">Usuario:</span>
          <span class="user-name">${usuario.name} ${usuario.lastName}</span>
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label>Fecha recogida</label>
            <input id="datePickUp" type="date">
          </div>

          <div class="form-group">
            <label>Empresa recogida</label>
            <input id="companyNamePickUp" placeholder="Empresa">
          </div>

          <div class="form-group">
            <label>Dirección recogida</label>
            <input id="addressPickup" placeholder="Dirección">
          </div>

          <div class="form-group">
            <label>Ciudad recogida</label>
            <input id="cityPickUp" placeholder="Ciudad">
          </div>

          <div class="form-group">
            <label>Fecha entrega</label>
            <input id="dateDelivery" type="date">
          </div>

          <div class="form-group">
            <label>Empresa entrega</label>
            <input id="companyDelivery" placeholder="Empresa">
          </div>

          <div class="form-group">
            <label>Dirección entrega</label>
            <input id="addressDelivery" placeholder="Dirección">
          </div>

          <div class="form-group">
            <label>Ciudad entrega</label>
            <input id="cityDelivery" placeholder="Ciudad">
          </div>

        </div>
      </div>
      `,
      focusConfirm: false,

      preConfirm: () => {

        const datePickUp = document.getElementById("datePickUp").value;
        const companyNamePickUp = document.getElementById("companyNamePickUp").value;
        const addressPickup = document.getElementById("addressPickup").value;
        const cityPickUp = document.getElementById("cityPickUp").value;

        const dateDelivery = document.getElementById("dateDelivery").value;
        const companyDelivery = document.getElementById("companyDelivery").value;
        const addressDelivery = document.getElementById("addressDelivery").value;
        const cityDelivery = document.getElementById("cityDelivery").value;

        if (
          !datePickUp ||
          !companyNamePickUp ||
          !addressPickup ||
          !cityPickUp ||
          !dateDelivery ||
          !companyDelivery ||
          !addressDelivery ||
          !cityDelivery
        ) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return {
          datePickUp,
          companyNamePickUp,
          addressPickup,
          cityPickUp,
          dateDelivery,
          companyDelivery,
          addressDelivery,
          cityDelivery,
          user: usuario._id
        };
      }
    });

    if (!formValues) return;

try {

  // ALERTA DE CARGANDO
  Swal.fire({
    title: "Creando carga...",
    text: "Por favor espere",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const response = await fetch(`${backendBaseUrl}/asignLoad`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues)
  });

  const data = await response.json();

  Swal.close(); // cerrar loading

  if (response.ok) {

    Swal.fire({
      icon: "success",
      title: "Carga creada",
      text: "La carga fue asignada correctamente",
      confirmButtonColor: "#2563eb"
    }).then(() => {

      // RECARGAR PÁGINA
      window.location.reload();

    });

  } else {

    Swal.fire({
      icon: "error",
      title: "Error",
      text: data.message || "No se pudo crear la carga"
    });

  }

} catch (error) {

  Swal.close();

  Swal.fire({
    icon: "error",
    title: "Error del servidor",
    text: "Intenta nuevamente"
  });

}
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

              <th className="px-6 py-3">Nombres</th>
              <th className="px-6 py-3">Apellidos</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3"></th>

            </tr>

          </thead>

          <tbody>

            {users.map((usuario) => (

              <tr
                key={usuario.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4 text-gray-800">
                  {usuario.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {usuario.lastName}
                </td>

                <td className="px-6 py-4">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {usuario.email}
                  </span>

                </td>
                <td className="px-6 py-4">

                  <button
                    onClick={() => handleAsignarCarga(usuario)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                  >
                    Asignar carga
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}