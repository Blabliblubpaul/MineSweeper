import axios from "axios";

export async function dbGetSignatures() {
    const result = await axios.get("http://localhost:3001/ms-leaderboards")

    return result.data
}

export async function dbGetHighscores(boardWidth: number, boardHeight: number, mines: number, metalDetectors: number, hint: boolean) {
    const result = await axios.get("http://localhost:3001/ms-leaderboard", {
        params: {
            w: boardWidth,
            h: boardHeight,
            m: mines,
            md: metalDetectors,
            hi: hint
        }
    })

    return result.data
}

export async function dbTestHighscore(boardWidth: number, boardHeight: number, mines: number, metalDetectors: number, hint: boolean, score: number) {
    const result = await axios.get("http://localhost:3001/ms-leaderboard/test-score", {
        params: {
            settings: {
                w: boardWidth,
                h: boardHeight,
                m: mines,
                md: metalDetectors,
                hi: hint
            },
            score: score
        }
    })

    return result.data
}

export async function dbPushHighscore(boardWidth: number, boardHeight: number, mines: number, metalDetectors: number, hint: boolean, score: number) {
    const result = await axios.put("http://localhost:3001/ms-leaderboard", {
        settings: {
            w: boardWidth,
            h: boardHeight,
            m: mines,
            md: metalDetectors,
            hi: hint
        },
        score: score
    })

    return result.data
}