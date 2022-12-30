import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import NewGame from "./NewGame";
import RegisterPlayer from "./RegisterPlayer";
import GameHistory from "./GameHistory";

function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: '700px' }}>
        <Router basename="rummy-score-tracker">
          <AuthProvider>
            <Routes>
              {/* <Route path="/signup" component={Signup}/> */}
              <Route exact path="/" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/reset" element={<Reset />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/registerplayer" element={<RegisterPlayer />} />
              <Route exact path="/newgame" element={<NewGame />} />
              <Route exact path="/gamehistory" element={<GameHistory />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
