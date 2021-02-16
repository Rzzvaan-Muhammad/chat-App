import { combineReducers } from "redux";
import AuthReducer from "./Auth2reducers";

export default combineReducers({
  Auth: AuthReducer,
});
