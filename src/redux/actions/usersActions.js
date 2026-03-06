export function registerUSER(email, password, name, lastName) {
  return async function (dispatch) {
    const response = await post('/user', { email, password, name, lastName });
    const token = response.data.token;
    return response.data;
  };
}