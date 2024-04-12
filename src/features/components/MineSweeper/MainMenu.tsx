import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { set } from "../../slices/themeSlice";

export default function MainMenu() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let [searchParams] = useSearchParams()
    
    if (searchParams.has("theme")) {
        let dark = searchParams.get("theme") === "dark"

        dispatch(set(dark ? "dark" : "light"))
    }

    return (
        <div id="main-menu">
            <h1 id="main-menu-header">Mine Sweeper</h1>
            <button id="main-menu-play-button" className="main-menu-button" onClick={() => navigate("/menu")}>PLAY</button>
            <button id="main-menu-leaderboards-button" className="main-menu-button" onClick={() => navigate("/leaderboards")}>Leaderboard</button>
        </div>
    )
}