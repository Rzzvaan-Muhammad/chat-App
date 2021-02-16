import "./App.css";
import Header from "./Components/Header";
import History from "./history";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Login from "./Components/login";
import RoomList from "./Components/RoomList";
import AddRoom from "./Components/AddRoom";
import ChatRoom from "./Components/ChatRoom";
function App() {
  let location = useLocation();

  return (
    <>
      <Router history={History}>
        <div>
          <Header />
          <Redirect
            to={{
              pathname: "/roomlist",
              state: { from: location },
            }}
          />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <SecureRoute path="/roomlist">
              <RoomList />
            </SecureRoute>
            <SecureRoute path="/addroom">
              <AddRoom />
            </SecureRoute>
            <SecureRoute path="/chatroom/:room">
              <ChatRoom />
            </SecureRoute>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;

function SecureRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("nickname") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
