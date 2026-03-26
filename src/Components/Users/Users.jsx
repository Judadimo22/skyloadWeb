import { useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/actions/adminActions";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";

export const UsersList = () => {

  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {

    const fetchData = async () => {
      try {
        await dispatch(getUsers());
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchData();

  }, [dispatch]);

  const handleAssignLoad = async (user) => {

    const { value: formValues } = await Swal.fire({
        title: `<span style="font-size:22px;font-weight:600">Assign Load</span>`,
        width: 700,
        showCancelButton: true,
        confirmButtonText: "Create Load",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",

        didOpen: () => {

          const rateInput = document.getElementById("rate");

          rateInput.addEventListener("input", (e) => {

            let value = e.target.value.replace(/\D/g, "");

            if (!value) {
              e.target.value = "";
              return;
            }

            value = Number(value).toLocaleString("en-US");

            e.target.value = `$${value}`;

          });

        },

        customClass: {
          popup: "rounded-xl",
          confirmButton: "px-6 py-2 rounded-lg",
          cancelButton: "px-6 py-2 rounded-lg"
        },

        html: `
        <div class="load-modal">

          <div class="user-row">
            <span class="user-label">User:</span>
            <span class="user-name">${user.name} ${user.lastName}</span>
          </div>

          <div class="form-grid">

            <div class="form-group">
              <label>Pickup Date</label>
              <input id="datePickUp" type="date">
            </div>

            <div class="form-group">
              <label>Pickup Company</label>
              <input id="companyNamePickUp" placeholder="Company name">
            </div>

            <div class="form-group">
              <label>Pickup Address</label>
              <input id="addressPickup" placeholder="Address">
            </div>

            <div class="form-group">
              <label>Pickup City</label>
              <input id="cityPickUp" placeholder="City">
            </div>

            <div class="form-group">
              <label>Delivery Date</label>
              <input id="dateDelivery" type="date">
            </div>

            <div class="form-group">
              <label>Delivery Company</label>
              <input id="companyDelivery" placeholder="Company name">
            </div>

            <div class="form-group">
              <label>Delivery Address</label>
              <input id="addressDelivery" placeholder="Address">
            </div>

            <div class="form-group">
              <label>Rate Price</label>
              <input id="rate" placeholder="$0">
            </div>

            <div class="form-group">
              <label>Delivery City</label>
              <input id="cityDelivery" placeholder="City">
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
        const rate = document.getElementById("rate").value.replace(/\D/g, "");

        if (
          !datePickUp ||
          !companyNamePickUp ||
          !addressPickup ||
          !cityPickUp ||
          !dateDelivery ||
          !companyDelivery ||
          !addressDelivery ||
          !cityDelivery || !rate
        ) {
          Swal.showValidationMessage("All fields are required");
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
          user: user._id,
          rate: rate
        };
      }

    });

    if (!formValues) return;

    try {

      Swal.fire({
        title: "Creating load...",
        text: "Please wait",
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

      Swal.close();

      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Load created",
          text: "The load was assigned successfully",
          confirmButtonColor: "#2563eb"
        }).then(() => {

          window.location.reload();

        });

      } else {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "The load could not be created"
        });

      }

    } catch (error) {

      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Please try again"
      });

    }

  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 pt-5">

        <h2 className="text-xl font-semibold text-gray-800">
          Users
        </h2>

        <Link to="/registerUser">

          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transitio cursor-pointer"
          >
            <UserPlus size={18} />
            Register User
          </button>

        </Link>

      </div>


      {/* USERS TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-left text-sm text-gray-600">

              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3"></th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4 text-gray-800">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.lastName}
                </td>

                <td className="px-6 py-4">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {user.email}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <button
                    onClick={() => handleAssignLoad(user)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    Assign Load
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};