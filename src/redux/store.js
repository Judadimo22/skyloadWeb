import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { devToolsEnhancer } from "@redux-devtools/extension";
import rootReducer from "./reducer";

const composedEnhancers = compose(
  applyMiddleware(thunk),
  devToolsEnhancer()
);

export const store = createStore(
  rootReducer,
  composedEnhancers
);