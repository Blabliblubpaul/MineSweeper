import { MouseEvent, useEffect, useState } from "react";

interface CellProps {
    x: number,
    y: number,
    state: number,
    nearbyMines: number,
    isHint: boolean,
    isBombHint: boolean,
    gameOverReveal: boolean,
    cellLeftClicked: (x: number, y: number) => void,
    cellRightClicked: (x: number, y: number) => void
}

export default function Cell({x, y, state, nearbyMines, isHint, isBombHint, gameOverReveal, cellLeftClicked, cellRightClicked}: CellProps) {
    const [cellState, setCellState] = useState(state)

    useEffect(() => {
        setCellState(state)
    }, [state])

    const handleRightClick = (event: MouseEvent) => {
        event.preventDefault()

        if (cellState === 0 || cellState === 1) {
            cellRightClicked(x, y)
        }
    }

    const handleLeftClick = (event: MouseEvent) => {
        if (cellState === 0 || cellState === 1) {
            cellLeftClicked(x, y)
        }
    }

    switch (state) {
        case 0:
            return <button className={"ms-cell" + (isHint ? " ms-cell-hint" : (isBombHint ? " ms-cell-bomb-hint" : ""))} onClick={handleLeftClick} onContextMenu={handleRightClick}></button>

        case 1:
            return <button className={"ms-cell" + (isBombHint ? " ms-cell-bomb-hint" : "")} onClick={handleLeftClick} onContextMenu={handleRightClick}><img className="cell-image" src="../images/flag.png"></img></button>

        case 2:
            return <div className={"ms-cell-container" + (gameOverReveal ? " ms-cell-container-game-over-reveal" : "")}><button className="ms-cell ms-cell-opened" style={{"color": getCellColor(nearbyMines)}} onClick={handleLeftClick} onContextMenu={handleRightClick}>{nearbyMines > 0 ? nearbyMines : ""}</button></div>

        case 3:
            return <div className={"ms-cell-container" + (gameOverReveal ? " ms-cell-container-game-over-reveal" : "")}><button className={"ms-cell ms-cell-opened"  + (gameOverReveal ? "" : "")} onClick={handleLeftClick} onContextMenu={handleRightClick}><img className="cell-image" src="../images/mine.png"></img></button></div>

        default:
            return <button className={"ms-cell"} onClick={handleLeftClick} onContextMenu={handleRightClick}></button>
    }
}

function getCellColor(nearbyMines: number) {
    switch (nearbyMines) {
        case 1:
            return "rgb(0, 128, 0)"

        case 2:
            return "rgb(0, 0, 255)"

        case 3:
            return "rgb(255, 255, 0)"

        case 4:
            return "rgb(255, 165, 0)"

        default:
            return "rgb(255, 0, 0)"
    }
}