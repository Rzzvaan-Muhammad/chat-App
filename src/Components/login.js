import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Jumbotron,
  Spinner,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import firebase from "../firebase-configuration/firebase";

import { signedIn, signedOut } from "../actions";
import { connect } from "react-redux";
function Login(props) {
  const history = useHistory();
  const [creds, setCreds] = useState({ nickname: "" });
  const [showLoading, setShowLoading] = useState(false);
  const ref = firebase.database().ref("users/");

  const login = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref
      .orderByChild("nickname")
      .equalTo(creds.nickname)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("nickname", creds.nickname);
          history.push("/roomlist");
          setShowLoading(false);
        } else {
          const newUser = firebase.database().ref("users/").push();
          newUser.set(creds);
          localStorage.setItem("nickname", creds.nickname);
          history.replace("/roomlist");
          setShowLoading(false);
        }
      });
  };

  const onChange = (e) => {
    e.persist();
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  return (
    <div>
      {showLoading && <Spinner color="primary" />}
      <Jumbotron>
        {props.auth && (
          <Form onSubmit={login}>
            <FormGroup>
              <Label>Nickname</Label>
              <Input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="Enter Your Nickname"
                value={creds.nickname}
                onChange={onChange}
                required
              />
            </FormGroup>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        )}
      </Jumbotron>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.Auth.isSignedIn,
    userName: state.Auth.userName,
  };
};
export default connect(mapStateToProps, { signedIn, signedOut })(Login);
