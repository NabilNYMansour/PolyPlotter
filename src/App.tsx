import { Button, IconButton } from "@mui/material";
import "./App.css";
import { Tool } from "./components/tool";
import Info from "@mui/icons-material/Info";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";
import { useState } from "react";
import GitHub from "@mui/icons-material/GitHub";

function App() {
  const [isPopUpOpen, setPopUpOpen] = useState<boolean>(false);

  return (
    <div className="App">
      <div className="container">
        <div className="nav">
          <Button onClick={() => setPopUpOpen(!isPopUpOpen) } size="large"><Info fontSize="large"/></Button>
          <div style={{ fontSize:"1.5em" }}>Poly Plotter</div>
          <Button href="https://github.com/NabilNYMansour/PolyPlotter" size="large"><GitHub fontSize="large"/></Button>
        </div>

        {isPopUpOpen && 
        <div className="pop-up">
          <h1 style={{ color: "white", padding:"20px" }}>Poly Plotter</h1>
          <div className="pop-up-point"><ArrowRightAlt/><div>To enter a poly, simply place one inside the fields on the left.</div> </div>
          <div className="pop-up-point"><ArrowRightAlt/>The regex format is:&nbsp;&nbsp;<code>[NUMBER]x(^[Number])((+|-)[NUMBER]x(^[Number]))* </code></div>
          <div className="pop-up-point"><ArrowRightAlt/>You can see some examples initialized on the poly fields already.</div>
          <div className="pop-up-point"><ArrowRightAlt/>To see the GIT Repo, hit the github button on the top-right.</div>
        </div>}

        <Tool />
      </div>
    </div>
  );
}

export default App;
