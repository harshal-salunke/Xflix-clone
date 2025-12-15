import React from "react";
import VideoGrid from "./components/VideoGrid";
import VideoDetails from "./components/VideoDetails";
import { Route, Switch } from "react-router-dom";
import "./App.css";

export const config = {
  endpoint: `https://xflix-backend-1avv.onrender.com/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={VideoGrid} />
        <Route exact path="/video/:id" component={VideoDetails} />
      </Switch>
    </div>
  );
}

export default App;
