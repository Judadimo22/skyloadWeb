import { post } from "../../utils/funciones";

export function registerUser(email, password, name, lastName, vehicle, vehicleDimension, unitNumber) {
  return async function (dispatch) {
    const response = await post('/user', { email, password, name, lastName, vehicle, vehicleDimension, unitNumber });
    const token = response.data.token;
    return response.data;
  };
}