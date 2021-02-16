import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import GoogleAuth from "./GoogleAuth";
import Logo from "../upwork-logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={`${classes.root}`}>
      <AppBar
        className="fixed-top navbar"
        position="static"
        style={{
          backgroundColor: "white",
          borderLeft: "0",
          borderRight: "0",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ color: "black" }}
          >
            <Link className="Link" to="/">
              <img src={Logo} alt="logo" style={{ width: "30%" }}></img>
            </Link>
          </Typography>

          <ul class="main-nav">
            <li>
              <a href="/">jobs</a>
            </li>
            <li>
              <a href="/">freelancers</a>
            </li>
            <li>
              <a href="/">reports</a>
            </li>
            <li>
              <a href="/">messages</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control mr-sm-2 pl-5"
              type="search"
              placeholder="Search"
              aria-label="Search"
            ></input>
          </form>
          <GoogleAuth />
        </Toolbar>
      </AppBar>
    </div>
  );
}
