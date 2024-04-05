import { useNavigate } from "react-router-dom"

interface GameEndScreenParams {
    won: boolean,
    boardWidth: number,
    boardHeight: number,
    mines: number,
    metalDetectors: number,
    hint: boolean
}

export default function GameEndScreen({won, boardWidth, boardHeight, mines, metalDetectors, hint}: GameEndScreenParams) {
    const navigate = useNavigate()

    return (
    <div id="ms-game-end-screen">
        <h1 className="ms-game-end-label">{won ? "YOU WON!" : "GAME OVER!"}</h1>
        <button className="ms-game-end-button" onClick={() => navigate(0)}>Play Again</button>
        <button className="ms-game-end-button" onClick={() => navigate("/menu")}>Menu</button>
    </div>)
}