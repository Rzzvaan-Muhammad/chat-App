import { signedInKey, signedOutKey } from "./types";

export const signedIn = (userId, userName) => {
  return {
    type: signedInKey,
    payload: {
      userId,
      userName,
    },
  };
};

export const signedOut = () => {
  return {
    type: signedOutKey,
  };
};
