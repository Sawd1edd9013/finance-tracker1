import {
  combineReducers,
  applyMiddleware,
  legacy_createStore as createStore,
} from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./auth/reducer";
import accountsReducer from "./accounts/reducer";
import categoriesReducer from "./categories/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
