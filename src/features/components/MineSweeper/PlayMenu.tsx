import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function PlayMenu() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [boardWidth, setBoardWidth] = useState(9)
    const [boardHeight, setBoardHeight] = useState(9)
    const [mineCount, setMineCount] = useState(10)
    const [metalDetectors, setMetalDetectors] = useState(0)
    const [hint, setHint] = useState(false)

    const [maxMineCount, setMaxMineCount] = useState(40)

    const [badBoardWidth, setBadBoardWidth] = useState(false)
    const [badBoardHeight, setBadBoardHeight] = useState(false)
    const [badMineCount, setBadMineCount] = useState(false)
    const [badMetalDetectors, setBadMetalDetectors] = useState(false)

    useEffect(() => {
        let x = boardWidth * boardHeight

        setMaxMineCount(x / 3)
    }, [boardHeight, boardWidth])

    useEffect(() => {
        if (!Number.isInteger(boardWidth)) {
            setBadBoardWidth(true)
        }
        else {
            setBadBoardWidth(false)
        }

        if (!Number.isInteger(boardHeight)) {
            setBadBoardHeight(true)
        }
        else {
            setBadBoardHeight(false)
        }

        if (mineCount > maxMineCount || !Number.isInteger(mineCount)) {
            setBadMineCount(true)
        }
        else {
            setBadMineCount(false)
        }

        if (!Number.isInteger(metalDetectors)) {
            setBadMetalDetectors(true)
        }
        else {
            setBadMetalDetectors(false)
        }
    }, [boardWidth, boardHeight, mineCount, maxMineCount, metalDetectors])

    function valueChanged(event: React.ChangeEvent<HTMLInputElement>, setNewValue: (value: number) => void) {
        setNewValue(Number(event.target.value))
    }

    function startGame() {
        if (!badBoardWidth && !badBoardHeight && !badMineCount && !badMetalDetectors) {
            let params = "r=" + boardWidth + "&c=" + boardHeight + "&m=" + mineCount + "&d=" + metalDetectors + "&h=" + hint
            navigate("/game?" + params)
        }
    }

    return (
        <div id="play-menu">
            <h1 id="play-menu-header">Menu</h1>
            <div id="pm-board-size" className="pm-setting">
                <h2 className="pm-header">Board Size</h2>
                <div id="pm-board-size-inputs">
                    <input className="pm-input" type="number" style={{outline: badBoardWidth ? "1px solid var(--input-error-color)" : "none"}} min={5} max={100} defaultValue={boardWidth} onChange={(x) => valueChanged(x, setBoardWidth)}></input>
                    <p id="pm-board-size-input-divider">X</p>
                    <input className="pm-input" type="number" style={{outline: badBoardHeight ? "1px solid var(--input-error-color)" : "none"}} min={5} max={100} defaultValue={boardHeight} onChange={(x) => valueChanged(x, setBoardHeight)}></input>
                </div>
            </div>
            <div id="pm-mine-count" className="pm-setting">
                <h2 className="pm-header">Mines</h2>
                <input id="pm-mine-count-input" className="pm-input" style={{outline: badMineCount ? "1px solid var(--input-error-color)" : "none"}} type="number" min={3} max={maxMineCount} defaultValue={mineCount} onChange={(x) => valueChanged(x, setMineCount)}></input>
            </div>
            <div id="pm-metal-detectors" className="pm-setting">
                <h2 className="pm-header">Metal Detectors</h2>
                <input className="pm-input" type="number" style={{outline: badMetalDetectors ? "1px solid var(--input-error-color)" : "none"}} min={0} max={1000} defaultValue={3} onChange={(x) => valueChanged(x, setMetalDetectors)}></input>
            </div>
            <div id="pm-start-hint" className="pm-setting">
                <h2 className="pm-header">Start Hint</h2>
                <input className="pm-checkbox" type="checkbox" defaultChecked={true} onChange={(x) => {setHint(x.target.checked)}}></input>
            </div>
            <button id="pm-start-button" className={(badBoardWidth || badBoardHeight || badMineCount || badMetalDetectors) ? "pm-start-button pm-start-button-disabled" : "pm-start-button"} onClick={startGame}>Play</button>
        </div>
    )
}