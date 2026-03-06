import { post } from "../../utils/funciones";

export function registerUser(email, password, name, lastName) {
  return async function (dispatch) {
    const response = await post('/user', { email, password, name, lastName });
    const token = response.data.token;
    return response.data;
  };
}