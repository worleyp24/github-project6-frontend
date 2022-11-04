import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
// import AccountDetails from "../src/components/miscellaneous/MatchMaking";
// import MatchMaking from "./pages/MatchMaking";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/myaccount" element={<AccountDetails />} /> */}
        {/* <Route path="/match" element={<MatchMaking />} /> */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
