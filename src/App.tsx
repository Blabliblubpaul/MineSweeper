import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Layout from "./features/components/Layout"
import MineSweeper from "./features/components/MineSweeper/MineSweeper"
import MainMenu from "./features/components/MineSweeper/MainMenu"
import PlayMenu from "./features/components/MineSweeper/PlayMenu"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Layout}>
            <Route index Component={MainMenu}/>
            <Route path="/" Component={MainMenu}/>
            <Route path="/menu" Component={PlayMenu}/>
            <Route path="/game" Component={MineSweeper}/>
        </Route>
      </Routes>
    </Router>
  )
}