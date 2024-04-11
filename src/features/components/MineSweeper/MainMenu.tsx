import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { set } from "../../slices/themeSlice";

export default function MainMenu() {
    const dispatch = useDispatch()

    let [searchParams] = useSearchParams()
    
    if (searchParams.has("theme")) {
        let dark = searchParams.get("theme") === "dark"

        dispatch(set(dark ? "dark" : "light"))
    }
    
    // return <Link to="/menu">PLAY</Link>

    return (
        <div id="main-menu">
            <h1 id="main-menu-header">Mine Sweeper</h1>
            <button id="main-menu-button">PLAY</button>
        </div>
    )
}