import { signedInKey, signedOutKey } from "../actions/types";

const initalState = {
  isSignedIn: null,
};

const AuthReducer = (state = initalState, action) => {
  switch (action.type) {
    case signedInKey:
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.userId,
        userName: action.payload.userName,
      };
    case signedOutKey:
      return { ...state, isSignedIn: false, userId: null, userName: null };

    default:
      return state;
  }
};

export default AuthReducer;
