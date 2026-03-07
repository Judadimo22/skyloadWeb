
import { jwtDecode } from 'jwt-decode'; 
import { post, get } from "../../utils/funciones";
export const GET_USERS = 'GET_USERS';
export const GET_LOADS = 'GET_LOADS';

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

export function getUsers() {
  return async function (dispatch) {
    let json = await get('/users')
    dispatch({
      type: GET_USERS,
      payload: json.data
    })
  }
}

export function getLoads() {
  return async function (dispatch) {
    let json = await get('/loads')
    dispatch({
      type: GET_LOADS,
      payload: json.data
    })
  }
}