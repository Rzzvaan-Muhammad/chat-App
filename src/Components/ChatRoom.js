import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Form, InputGroup, InputGroupAddon } from "reactstrap";
import Moment from "moment";
import firebase from "../firebase-configuration/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

function ChatRoom() {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [roomname, setRoomname] = useState("");
  const [newchat, setNewchat] = useState({
    roomname: "",
    nickname: "",
    message: null,
    file: null,
    date: "",
    type: "",
  });
  const history = useHistory();
  const { room } = useParams();
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: "100%",
      height: "80vh",
    },
    headBG: {
      backgroundColor: "#e0e0e0",
    },
    borderRight500: {
      borderRight: "1px solid #e0e0e0",
    },
    messageArea: {
      height: "70vh",
      overflowY: "auto",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      setNickname(localStorage.getItem("nickname"));
      setRoomname(room);
      firebase
        .database()
        .ref("chats/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp) => {
          setChats([]);
          setChats(snapshotToArray(resp));
        });
    };

    fetchData();
  }, [room, roomname]);

  useEffect(() => {
    const fetchData = async () => {
      setNickname(localStorage.getItem("nickname"));
      setRoomname(room);
      firebase
        .database()
        .ref("roomusers/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp2) => {
          setUsers([]);
          const roomusers = snapshotToArray(resp2);
          setUsers(roomusers.filter((x) => x.status === "online"));
        });
    };

    fetchData();
  }, [room, roomname]);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const chat = newchat;
    console.log(chat, "log");
    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.type = chat.message ? "message" : "file";
    // chat.files
    const newMessage = firebase.database().ref("chats/").push();
    console.log(chat, "chat");
    newMessage.set(chat);
    setNewchat({
      roomname: "",
      nickname: "",
      files: "",
      message: "",
      date: "",
      type: "",
    });
  };

  const onChange = (e) => {
    if (e.target.value) {
      setNewchat({ ...newchat, [e.target.name]: e.target.value });
    }
    if (e.target.files) {
      console.log(e.target.files[0], "file log");
      setNewchat({
        ...newchat,
        [e.target.name]: e.target.files[0].name,
      });
    } else {
      e.persist();
      setNewchat({ ...newchat, [e.target.name]: e.target.value });
    }
  };

  const exitChat = (e) => {
    const chat = {
      roomname: "",
      nickname: "",
      message: "",
      date: "",
      type: "",
    };
    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.message = `${nickname} leave the room`;
    chat.type = "exit";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === nickname);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "offline" });
        }
      });

    history.goBack();
  };
  const classes = useStyles();
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            className="header-message"
            type="button"
            onClick={() => {
              exitChat();
            }}
          >
            Exit Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            {users.map((item, idx) => (
              <ListItem button key={idx}>
                <ListItemIcon>
                  <Avatar
                    alt="Remy Sharp"
                    src={`https://material-ui.com/static/images/avatar/${idx}.jpg`}
                  />
                </ListItemIcon>
                <ListItemText>{item.nickname}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          {chats.map((item, idx) => (
            <div key={idx} className="MessageBox">
              {item.type === "join" || item.type === "exit" ? (
                <div className="ChatStatus">
                  <span className="ChatDate">{item.date}</span>
                  <span className="ChatContentCenter">{item.message}</span>
                </div>
              ) : (
                <div className="container">
                  <div className="ChatMessage">
                    <div
                      className={`${
                        item.nickname === nickname
                          ? "RightBubble"
                          : "LeftBubble"
                      }`}
                    >
                      {item.nickname === nickname ? (
                        <span className="MsgName">Me</span>
                      ) : (
                        <span className="MsgName">{item.nickname}</span>
                      )}
                      <span className="MsgDate"> at {item.date}</span>
                      <p>{item.message}</p>
                      <p className={"RightBubble"}>{item.files}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Grid container style={{ padding: "20px" }}>
            <Form className="MessageForm" onSubmit={submitMessage}>
              <InputGroup>
                <Grid item xs={11}>
                  <TextField
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Enter message here"
                    value={newchat.message}
                    onChange={onChange}
                  />
                  <label for="file" class="sr-only">
                    <AttachFileIcon />
                  </label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    value={newchat.file}
                    onChange={onChange}
                  ></input>
                </Grid>
                <Grid xs={1} align="right">
                  <InputGroupAddon addonType="append">
                    <Grid xs={1} align="right">
                      <Button
                        style={{ backgroundColor: "white" }}
                        type="submit"
                      >
                        <Fab color="primary" aria-label="add">
                          <SendIcon />
                        </Fab>
                      </Button>
                    </Grid>
                  </InputGroupAddon>
                </Grid>
              </InputGroup>
            </Form>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChatRoom;
