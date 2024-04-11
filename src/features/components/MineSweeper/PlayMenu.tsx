import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Settings {
    width: number,
    height: number,
    mines: number,
    metalDetectors: number,
    hint: boolean
}

export default function PlayMenu2() {
    const navigate = useNavigate()

    const easy_template: Settings = {
        width: 9,
        height: 9,
        mines: 10,
        metalDetectors: 0,
        hint: true
    }

    const intermediate_template: Settings = {
        width: 16,
        height: 16,
        mines: 40,
        metalDetectors: 0,
        hint: true
    }

    const hard_template: Settings = {
        width: 30,
        height: 16,
        mines: 99,
        metalDetectors: 0,
        hint: true
    }

    const master_template: Settings = {
        width: 35,
        height: 20,
        mines: 195,
        metalDetectors: 0,
        hint: true
    }

    const [boardWidthString, setBoardWidthString] = useState("9")
    const [boardWidth, setBoardWidth] = useState(9)
    const minBoardWidth = 5
    const maxBoardWidth = 100

    const [boardHeightString, setBoardHeightString] = useState("9")
    const [boardHeight, setBoardHeight] = useState(9)
    const minBoardHeight = 5
    const maxBoardHeight = 100

    const [mineCountString, setMineCountString] = useState("10")
    const [mineCount, setMineCount] = useState(10)
    const minMinePercentage = 0.05
    const maxMinePercentage = 0.35

    const [metalDetectorsString, setMetalDetectorsString] = useState("0")
    const [metalDetectors, setMetalDetectors] = useState(0)
    const minMetalDetectors = 0
    const maxMetalDetectors = 100

    const [hint, setHint] = useState(true)

    function changeBoardWidth(value: string) {
        let x = Number(value)

        if (x < minBoardWidth) {
            setBoardWidthString(minBoardWidth.toString())
            setBoardWidth(minBoardWidth)
        }
        else if (x > maxBoardWidth) {
            setBoardWidthString(maxBoardWidth.toString())
            setBoardWidth(maxBoardWidth)
        }
        else if (Number.isInteger(x)) {
            setBoardWidth(Number(value))
        }
        else {
            setBoardWidthString(boardWidth.toString())
        }
    }

    function changeBoardHeight(value: string) {
        let x = Number(value)

        if (x < minBoardHeight) {
            setBoardHeightString(minBoardHeight.toString())
            setBoardHeight(minBoardHeight)
        }
        else if (x > maxBoardHeight) {
            setBoardHeightString(maxBoardHeight.toString())
            setBoardHeight(maxBoardHeight)
        }
        else if (Number.isInteger(x)) {
            setBoardHeight(Number(value))
        }
        else {
            setBoardHeightString(boardHeight.toString())
        }
    }

    function changeMineCount(value: string) {
        let min = Math.round(boardWidth * boardHeight * minMinePercentage)
        let max = Math.round(boardWidth * boardHeight * maxMinePercentage)

        let x = Number(value)

        if (x < min) {
            setMineCountString(min.toString())
            setMineCount(min)
        }
        else if (x > max) {
            setMineCountString(max.toString())
            setMineCount(max)
        }
        else if (Number.isInteger(x)) {
            setMineCountString(value)
            setMineCount(Number(value))
        }
        else {
            setMineCountString(mineCount.toString())
        }
    }

    function changeMetalDetectors(value: string) {
        let x = Number(value)

        if (x < minMetalDetectors) {
            setMetalDetectorsString(minMetalDetectors.toString())
            setMetalDetectors(minMetalDetectors)
        }
        else if (x > maxMetalDetectors) {
            setMetalDetectorsString(maxMetalDetectors.toString())
            setMetalDetectors(maxMetalDetectors)
        }
        else if (Number.isInteger(x)) {
            setMetalDetectors(Number(value))
        }
        else {
            setMetalDetectorsString(metalDetectors.toString())
        }
    }

    function applyTemplate(template: Settings) {
        setBoardWidthString(template.width.toString())
        setBoardWidth(template.width)

        setBoardHeightString(template.height.toString())
        setBoardHeight(template.height)

        setMineCountString(template.mines.toString())
        setMineCount(template.mines)

        setMetalDetectorsString(template.metalDetectors.toString())
        setMetalDetectors(template.metalDetectors)

        setHint(template.hint)
    }


    useEffect(() => {
        let min = Math.round(boardWidth * boardHeight * minMinePercentage)
        let max = Math.round(boardWidth * boardHeight * maxMinePercentage)

        if (mineCount < min) {
            setMineCount(min)
        }
        else if (mineCount > max) {
            setMineCount(max)
        }

        setMineCountString(mineCount.toString())
    }, [boardHeight, boardWidth, mineCount])

    function startGame() {
        let params = "c=" + boardWidth + "&r=" + boardHeight + "&m=" + mineCount + "&d=" + metalDetectors + "&h=" + hint
        navigate("/game?" + params)
    }

    return (
        <div id="play-menu-container">
            <div id="play-menu">
                <h1 id="play-menu-header">Menu</h1>
                <div id="pm-board-size" className="pm-setting">
                    <h2 className="pm-header">Board Size</h2>
                    <div id="pm-board-size-inputs">
                        <input className="pm-input" type="number" value={boardWidthString} onBlur={(e) => changeBoardWidth(e.target.value)} onChange={(e) => setBoardWidthString(e.target.value)}></input>
                        <p id="pm-board-size-input-divider">X</p>
                        <input className="pm-input" type="number" value={boardHeightString} onBlur={(e) => changeBoardHeight(e.target.value)} onChange={(e) => setBoardHeightString(e.target.value)}></input>
                    </div>
                </div>
                <div id="pm-mine-count" className="pm-setting">
                    <h2 className="pm-header">Mines</h2>
                    <input id="pm-mine-count-input" className="pm-input" type="number" value={mineCountString} onBlur={(e) => changeMineCount(e.target.value)} onChange={(e) => setMineCountString(e.target.value)}></input>
                </div>
                <div id="pm-metal-detectors" className="pm-setting">
                    <h2 className="pm-header">Metal Detectors</h2>
                    <input className="pm-input" type="number" value={metalDetectorsString} onBlur={(e) => changeMetalDetectors(e.target.value)} onChange={(e) => setMetalDetectorsString(e.target.value)}></input>
                </div>
                <div id="pm-start-hint" className="pm-setting">
                    <h2 className="pm-header">Start Hint</h2>
                    <input className="pm-checkbox" type="checkbox" checked={hint} onChange={(x) => {setHint(!hint)}}></input>
                </div>
                <button id="pm-start-button" className="pm-button" onClick={startGame}>Play</button>
            </div>
            <div id="pm-templates">
                <h1 id="play-menu-header">Templates</h1>
                <button className="pm-button pm-template-button" onClick={() => applyTemplate(easy_template)}>Easy</button>
                <button className="pm-button pm-template-button" onClick={() => applyTemplate(intermediate_template)}>Intermediate</button>
                <button className="pm-button pm-template-button" onClick={() => applyTemplate(hard_template)}>Hard</button>
                <button className="pm-button pm-template-button" onClick={() => applyTemplate(master_template)}>Master</button>
            </div>
        </div>
    )
}