import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { signedIn, signedOut } from "../actions";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
const GoogleAuth = (props) => {
  const history = useHistory();

  useEffect(() => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "1036408886636-21cfbclejj72evh1bk3gu6tne0te0vks.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          let auth = window.gapi.auth2.getAuthInstance();
          auth.isSignedIn.get()
            ? props.signedIn(
                auth.currentUser.get().getId(),
                auth.currentUser.get().getBasicProfile().getName()
              )
            : props.signedOut();

          auth.isSignedIn.listen((isSignedIn) => {
            if (isSignedIn) {
              props.signedIn(
                auth.currentUser.get().getId(),
                auth.currentUser.get().getBasicProfile().getName()
              );
            } else {
              props.signedOut();
            }
          });
        });
    });
  }, []);

  return (
    <>
      {props.auth === true ? (
        <Button
          style={{ color: "#4caf50", width: "35%" }}
          onClick={() => {
            window.gapi.auth2.getAuthInstance().signOut();
            history.push("/login");
          }}
        >
          <AccountCircleIcon />
          {props.userName}
        </Button>
      ) : (
        <Button
          color="secondary"
          onClick={() => window.gapi.auth2.getAuthInstance().signIn()}
        >
          Login
        </Button>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    auth: state.Auth.isSignedIn,
    userName: state.Auth.userName,
  };
};
export default connect(mapStateToProps, { signedIn, signedOut })(GoogleAuth);
