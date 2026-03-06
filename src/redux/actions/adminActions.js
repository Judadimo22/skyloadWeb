// loginAdmin.js
import { jwtDecode } from 'jwt-decode'; // ← Agregar
import { post } from "../../utils/funciones";

export function loginAdmin(email, password) {
  return async function (dispatch) {
    const response = await post('/loginAdmin', { email, password });
    const token = response.data.token;

    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    localStorage.setItem('loginToken', token);
    localStorage.setItem('roles', JSON.stringify(roles));

    return response.data;
  };
}