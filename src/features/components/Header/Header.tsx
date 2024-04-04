import { useDispatch, useSelector } from "react-redux"
import { set } from "../../slices/themeSlice"
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <div id="header">
            <Link id="headerTitle" to="/"><h1>Mine Sweeper</h1></Link>
            <div className="headermiddle" >
            </div>
            <CreateThemeButton />
        </div>
    )
}

function CreateThemeButton() {
    const theme = useSelector((state: any) => state.theme.value)
    const dispatch = useDispatch()

    document.body.classList.toggle("dark-mode", theme === "dark")

    if (theme === "light") {
        return <button className="headerNavButton" onClick={() => dispatch(set("dark"))}><i className="fa fa-moon-o"></i></button>
    }
    else {
        return <button className="headerNavButton" onClick={() => dispatch(set("light"))}><i className="fa fa-sun-o"></i></button>
    }
}