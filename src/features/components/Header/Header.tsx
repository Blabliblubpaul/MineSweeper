import { useDispatch, useSelector } from "react-redux"
import { set } from "../../slices/themeSlice"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"

export default function Header() {
    const dispatch = useDispatch()
    const theme = Cookies.get("theme")

    if (theme) {
        dispatch(set(theme))
    }

    return (
        <div id="header">
            <Link id="headerTitle" to="/"><h1>Mine Sweeper</h1></Link>
            <CreateThemeButton />
        </div>
    )
}

function CreateThemeButton() {
    const theme = useSelector((state: any) => state.theme.value)
    const dispatch = useDispatch()

    document.body.classList.toggle("dark-mode", theme === "dark")

    function changeTheme(theme: string) {
        dispatch(set(theme))
        Cookies.set("theme", theme)
    }

    if (theme === "light") {
        return <button className="header-button" onClick={() => changeTheme("dark")}><i className="fa fa-moon-o"></i></button>
    }
    else {
        return <button className="header-button" onClick={() => changeTheme("light")}><i className="fa fa-sun-o"></i></button>
    }
}