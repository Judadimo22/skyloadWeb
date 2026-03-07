import { GET_LOADS, GET_USERS } from "./actions/adminActions";

  const initialState = {
    users:[],
    loads: []
  };
  
  function rootReducer(state = initialState, action) {
    switch (action.type) {
      case GET_USERS: return {
        ...state,
        users: action.payload,
      }
      case GET_LOADS : return {
        ...state,
        loads: action.payload
      }
      default: {
        return state;
      }
    }
  }
  
  export default rootReducer;