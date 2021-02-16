import firebase from "firebase";

const config = {
  projectId: "upworkchat123",
  //   apiKey: "AIzaSyBqtuF1-HruRo46GIsla6NyvDPdTB_IbMA",
  databaseURL: "https://upworkchat123-default-rtdb.firebaseio.com",
};
firebase.initializeApp(config);

export default firebase;
