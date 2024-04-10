import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { dbPushHighscore, dbTestHighscore } from "../../../app/utils"

interface GameEndScreenParams {
    won: boolean,
    time: number,
    boardWidth: number,
    boardHeight: number,
    mines: number,
    metalDetectors: number,
    hint: boolean
}

/* PUSH STATE
0: not pushed
1: pushing
2: pushed
*/

export default function GameEndScreen({won, time, boardWidth, boardHeight, mines, metalDetectors, hint}: GameEndScreenParams) {
    const navigate = useNavigate()
    const [hideMenu, setHideMenu] = useState(false)
    const [isHighscore, setIsHighscore] = useState(0)
    const [pushState, setPushState] = useState(0)

    useEffect(() => {
        const fetch = async () => {
            const data = await dbTestHighscore(boardWidth, boardHeight, mines, metalDetectors, hint, time)
            console.log(data)
            setIsHighscore(await dbTestHighscore(boardWidth, boardHeight, mines, metalDetectors, hint, time))
        }

        fetch()
    }, [])

    async function pushHighscore() {
        if (pushState > 0) {
            return
        }

        setPushState(1)

        await dbPushHighscore(boardWidth, boardHeight, mines, metalDetectors, hint, time)

        setPushState(2)
    }

    function createLeaderboardParams() {
        return "w=" + boardWidth + "&h=" + boardHeight + "&m=" + mines + "&md=" + metalDetectors + "&hi=" + hint
    }

    if (!hideMenu) {
        return (
            <div id="ms-game-end-screen">
                <button id="ms-game-end-visibility-button" className="ms-game-end-button" onClick={() => setHideMenu(!hideMenu)}>Hide</button>
                <div id="ms-game-end-menu">
                <h1 className="ms-game-end-label">{won ? "YOU WON!" : "GAME OVER!"}</h1>
                {won ? <h1 id="ms-game-end-time-label" className="ms-game-end-label">{"Completion time: " + time}</h1> : <></>}
                {won && isHighscore ? <NewHighscoreComponent pushState={pushState} pushHighscore={pushHighscore}/> : <></>}
                <button id="ms-game-end-leaderboards-buttons" className="ms-game-end-button" onClick={() => navigate("/leaderboards?" + createLeaderboardParams())}>View Leaderboards</button>
                <button className="ms-game-end-button" onClick={() => navigate(0)}>Play Again</button>
                <button className="ms-game-end-button" onClick={() => navigate("/menu")}>Menu</button>  
                </div>
            </div>)
    }
    else {
        return (
            <div id="ms-game-end-screen">
                <button id="ms-game-end-visibility-button" className="ms-game-end-button" onClick={() => setHideMenu(!hideMenu)}>Show</button>
            </div>)
    }
}

function NewHighscoreComponent({ pushState, pushHighscore }: { pushState: number, pushHighscore: () => void}) {
    function getPushButtonText(pushState: number) {
        switch (pushState) {
            case 0:
                return "Upload"

            case 1:
                return "..."

            default:
                return "Done!"
        }
    }
    
    return (
        <div id="ms-game-end-new-highscore">
            <h1 id="ms-game-end-new-highscore-label" className="ms-game-end-label">New Highscore!</h1>
            <button id="ms-game-end-new-highscore-button" className="ms-game-end-button" onClick={pushHighscore}>{getPushButtonText(pushState)}</button>
        </div>
    )
}