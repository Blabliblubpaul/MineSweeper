import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PlayMenu() {
    const navigate = useNavigate()

    const [boardWidth, setBoardWidth] = useState(9)
    const [boardHeight, setBoardHeight] = useState(9)
    const [mineCount, setMineCount] = useState(10)

    const [maxMineCount, setMaxMineCount] = useState(40)

    const [badMineCount, setBadMineCount] = useState(false)

    useEffect(() => {
        let x = boardWidth * boardHeight

        setMaxMineCount(x / 3)
    }, [boardHeight, boardWidth])

    useEffect(() => {
        if (mineCount > maxMineCount || !Number.isInteger(mineCount)) {
            setBadMineCount(true)
        }
        else {
            setBadMineCount(false)
        }
    }, [mineCount, maxMineCount])

    function valueChanged(event: React.ChangeEvent<HTMLInputElement>, setNewValue: (value: number) => void) {
        setNewValue(Number(event.target.value))
    }

    function startGame() {
        if (!badMineCount) {
            let params = "r=" + boardWidth + "&c=" + boardHeight + "&m=" + mineCount + "&d=0&h=false"
            navigate("/game?" + params)
        }
    }

    return (
        <div id="play-menu">
            <h1 id="play-menu-header">Menu</h1>
            <div id="pm-board-size" className="pm-setting">
                <h2 className="pm-header">Board Size</h2>
                <div id="pm-board-size-inputs">
                    <input className="pm-input" type="number" min={5} max={35} defaultValue={boardWidth} onChange={(x) => valueChanged(x, setBoardWidth)}></input>
                    <p id="pm-board-size-input-divider">X</p>
                    <input className="pm-input" type="number" min={5} max={20} defaultValue={boardHeight} onChange={(x) => valueChanged(x, setBoardHeight)}></input>
                </div>
            </div>
            <div id="pm-mine-count" className="pm-setting">
                <h2 className="pm-header">Mines</h2>
                <input id="pm-mine-count-input" className="pm-input" style={{outline: badMineCount ? "1px solid red" : "none"}} type="number" min={3} max={maxMineCount} defaultValue={mineCount} onChange={(x) => valueChanged(x, setMineCount)}></input>
            </div>
            <div id="pm-metal-detectors" className="pm-setting">
                <h2 className="pm-header">Metal Detectors</h2>
                <input className="pm-input" type="number" min={0} max={0} defaultValue={0}></input>
            </div>
            <div id="pm-start-hint" className="pm-setting">
                <h2 className="pm-header">Start Hint</h2>
                <input type="checkbox"></input>
            </div>
            <button id="pm-start-button" className={badMineCount ? "pm-start-button-disabled" : ""} onClick={startGame}>Play</button>
        </div>
    )
}