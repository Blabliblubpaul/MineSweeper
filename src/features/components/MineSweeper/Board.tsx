import React, { useEffect, useState } from "react"
import CellComponent from "./Cell"
import cloneDeep from "lodash/cloneDeep"
import GameEndScreen from "./GameEndScreen"

interface BoardParams {
    rows: number,
    columns: number,
    mines: number,
    metalDetectors: number,
    hint: boolean
}

interface CellPos {
    x: number,
    y: number
}

interface Cell {
    isMine: boolean,
    state: number,
    nearbyMines: number,
    hint: boolean,
    bomb_hint: boolean,
    gameOverReveal: boolean
}

interface BoardCreationProps {
    board: Cell[][],
    showHint: boolean,
    cellLeftClicked: (x: number, y: number) => void,
    cellRightClicked: (x: number, y: number) => void
}

export default function Board({rows, columns, mines, metalDetectors, hint}: BoardParams) {
    const [boardState, setBoardState] = useState(createBoardArray(rows, columns, mines, hint))
    const [time, setTime] = useState(0)
    const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined)
    const [metalDetectorActive, setMetalDetectorActive] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [won, setWon] = useState(false)

    // Hide the hint after the first click
    const [showHint, setShowHint] = useState(true)

    const [flagCount, setFlagCount] = useState(0)
    const [metalDetectorsLeft, setMetalDetectorsLeft] = useState(metalDetectors)
    const [openedCells, setOpenedCells] = useState(0)

    function cellLeftClicked(x: number, y: number) {
        if (gameOver || won) {
            return
        }

        if (metalDetectorActive) {
            if (boardState[x][y].isMine) {
                let boardState_ = cloneDeep(boardState)
                boardState_[x][y].bomb_hint = true
                setBoardState(boardState_)
            }

            setMetalDetectorsLeft(metalDetectorsLeft - 1)
            setMetalDetectorActive(false)
            return
        }

        if (boardState[x][y].state === 2 && !boardState[x][y].isMine) {
            setFlagCount(flagCount - 1)
        }

        let ret = openCell(boardState, x, y, gameOverFunc)

        setBoardState(ret.board)
        setOpenedCells(openedCells + ret.openedCells)

        if (showHint) {
            setShowHint(false)
        }
    }

    function cellRightClicked(x: number, y: number) {
        if (gameOver || won) {
            return
        }

        if (metalDetectorActive) {
            setMetalDetectorActive(false)
            return
        }

        if (boardState[x][y].state === 1) {
            setCellFlag(boardState, setBoardState, x, y, false)
            setFlagCount(flagCount - 1)
        }
        else {
            setCellFlag(boardState, setBoardState, x, y, true)
            setFlagCount(flagCount + 1)
        }
    }

    function metalDetectorButtonHandle() {
        if (metalDetectorsLeft > 0) {
            setMetalDetectorActive(true)
        }
    }

    function gameOverFunc(board: Cell[][]) {
        setGameOver(true)
        clearInterval(timerId)

        gameOverReveal(board)
    }

    useEffect(() => {
        let id = setInterval(() => {
            setTime(time => time + 1)
        }, 1000)

        setTimerId(id)

        return () => {
            clearInterval(id)
        }
    }, [])

    useEffect(() => {
        document.body.classList.toggle("metal-detector-active", metalDetectorActive)
    }, [metalDetectorActive])

    useEffect(() => {
        if ((openedCells + mines) === (rows * columns)) {
            setWon(true)
            clearInterval(timerId)
        }
    }, [openedCells])

    return (
        <div id="ms-game">
            { (gameOver || won) && <GameEndScreen won={won} time={time} boardWidth={rows} boardHeight={columns} mines={mines} metalDetectors={metalDetectorsLeft} hint={hint}/> }
            <div id="ms-game-hud">
                <h1 className="ms-game-hud-display">{"Mines left: " + (mines - flagCount) }</h1>
                <h1 className="ms-game-hud-display">{"Metal-Detectors: " + metalDetectors}</h1>
                <button className="ms-game-hud-button" onClick={metalDetectorButtonHandle}>Use metal detector</button>
                <button id="ms-game-hud-clear-flags-button" className="ms-game-hud-button">Clear flags</button>
                <h1 className="ms-game-hud-display">{"Time: " + time}</h1>
            </div>
            <div id="ms-board-container">
                <CreateBoard board={boardState} showHint={showHint} cellLeftClicked={cellLeftClicked} cellRightClicked={cellRightClicked}/>
            </div>
        </div>
    )
}

function gameOverReveal(board: Cell[][]) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (board[x][y].state < 2) {
                if (board[x][y].isMine) {
                    board[x][y].state = 3
                    board[x][y].gameOverReveal = true
                }
                else {
                    board[x][y].state = 2
                    board[x][y].gameOverReveal = true
                }
            }
        }
    }
}

function setCellFlag(board: Cell[][], setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>, x: number, y: number, flagged: boolean) {
    let board_ = cloneDeep(board)

    board_[x][y].state = flagged ? 1 : 0

    setBoard(board_)
}

function openCell(board: Cell[][], x: number, y: number, /*setGameOver: React.Dispatch<React.SetStateAction<boolean>>,*/ gameOverFunc: (board: Cell[][]) => void) {
    let board_ = cloneDeep(board)
    let openedCells = 0

    if (board_[x][y].state > 1) {
        return {board: board_, openedCells: openedCells}
    }

    // Game Over
    if (board_[x][y].isMine) {
        board_[x][y].state = 3
        gameOverFunc(board_)
        return {board: board_, openedCells: openedCells}
    }
    else {
        board_[x][y].state = 2
        openedCells++
    }

    // If there are no adjacent mines, open all adjacent tiles
    if (board_[x][y].nearbyMines === 0) {
        
        if (!hasAdjacentMines(board_, x, y)) {
            for (let x_ = -1; x_ <= 1; x_++) {
                for (let y_ = -1; y_ <= 1; y_++) {
                    // Check if position is outside of the board-bounds.
                    if ((x + x_ < 0) || (x + x_ > board_.length - 1) || (y + y_ < 0) || (y + y_ > board_[x + x_].length - 1) || (board_[x + x_][y + y_].state > 0)) {
                        continue
                    }
                    else {
                        let ret = openCell(board_, x + x_, y + y_, gameOverFunc)

                        board_ = ret.board
                        openedCells += ret.openedCells
                    }
                }
            }
        }   
    }

    return {board: board_, openedCells: openedCells}
}

function hasAdjacentMines(board: Cell[][], x: number, y: number) {
    for (let x_ = -1; x_ <= 1; x_++) {
        for (let y_ = -1; y_ <= 1; y_++) {
            // Check if position is outside of the board-bounds.
            if ((x + x_ < 0) || (x + x_ > board.length - 1) || (y + y_ < 0) || (y + y_ > board[x + x_].length - 1)) {
                continue
            }
            else {
                if (board[x + x_][y + y_].isMine) {
                    return true
                }
            }
        }
    }

    return false
}

function createBoardArray(rows: number, columns: number, mines: number, hint: boolean) {
    let board: Cell[][] = []

    for (let r = 0; r < rows; r++) {
        let row: Cell[] = []

        for (let c = 0; c < columns; c++) {
            row.push({isMine: false, state: 0, nearbyMines: 0, hint: false, bomb_hint: false, gameOverReveal: false})
        }

        board.push(row)
    }

    createMines(board, mines)

    if (hint) {
        let hintPlaced = false
        // Always try to hint an empty cell first, but after 1000 fails, also allow numbered tiles to be hinted.
        // Cancel after 2000 fails.
        let counter = 0

        while (!hintPlaced) {
            let x = getRandomInt(0, board.length - 1)
            let y = getRandomInt(0, board[x].length - 1)
    
            if (!board[x][y].isMine && board[x][y].nearbyMines === 0) {
                board[x][y].hint = true
                hintPlaced = true
            }
            else if (counter >= 1000 && !board[x][y].isMine) {
                board[x][y].hint = true
                hintPlaced = true
            }
            else {
                counter++
            }
            
            if (counter >= 2000) {
                break
            }
        }
    }

    return board
}

function createMines(board: Cell[][], mineCount: number) {
    let placedMines = 0

    while (placedMines < mineCount) {
        let x = getRandomInt(0, board.length - 1)
        let y = getRandomInt(0, board[x].length - 1)

        if (board[x][y].isMine === true) {
            continue
        }
        else {
            board[x][y].isMine = true
            placedMines++
        }
    }

    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (!board[x][y].isMine) {
                let mineCounter = 0

                for (let x_ = -1; x_ <= 1; x_++) {
                    for (let y_ = -1; y_ <= 1; y_++) {
                        // Check if position is outside of the board-bounds.
                        if ((x + x_ < 0) || (x + x_ > board.length - 1) || (y + y_ < 0) || (y + y_ > board[x + x_].length - 1)) {
                            continue
                        }

                        if ( board[x + x_][y + y_].isMine) {
                            mineCounter++
                        }
                    }
                }

                board[x][y].nearbyMines = mineCounter
            }
        }
    }
}

// Creates Mines after first click, thus preventing players from dying immediatly
function createMines_old(board: Cell[][], mineCount: number, clickedCell: CellPos, setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>) {
    let board_ = cloneDeep(board)
    let placedMines = 0

    while (placedMines < mineCount) {
        let x = getRandomInt(0, board.length - 1)
        let y = getRandomInt(0, board[x].length - 1)

        if (board_[x][y].isMine === true || (x === clickedCell.x && y === clickedCell.y) || isDiagonalOrAdjacent(x, y, clickedCell.x, clickedCell.y)) {
            continue
        }
        else {
            board_[x][y].isMine = true
            board_[x][y].state = 2
            placedMines++
        }
    }

    setBoard(board_)
}

function isDiagonalOrAdjacent(posX: number, posY: number, originX: number, originY: number) {
    return (Math.abs(Math.abs(posX) - Math.abs(originX)) <= 1 && Math.abs(Math.abs(posY) - Math.abs(originY)) <= 1)
}

// Source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CreateBoard({board, showHint, cellLeftClicked, cellRightClicked}: BoardCreationProps) {
    let board_ = board.map((x, indexX) => (
        <div key={indexX}>
            {
                x.map((y, indexY) => {
                    let cell = board[indexX][indexY]

                    return <CellComponent key={indexY} x={indexX} y={indexY} state={cell.state} nearbyMines={cell.nearbyMines} isHint={cell.hint && showHint} isBombHint={cell.bomb_hint} gameOverReveal={cell.gameOverReveal} cellLeftClicked={cellLeftClicked} cellRightClicked={cellRightClicked}/>
                })
            }
        </div>
    ))

    return (
        <div id="ms-board">
            {board_}
        </div>
    )
}