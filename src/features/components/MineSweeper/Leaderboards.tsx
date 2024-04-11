import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { dbGetHighscores, dbGetSignatures } from "../../../app/utils"

interface Settings {
    w: number,
    h: number,
    m: number,
    md: number,
    hi: boolean
}

export default function Leaderboards() {
    const [searchParams] = useSearchParams()
    const [settings, setSettings] = useState(createSettings(searchParams))
    const [leaderboards, setLeaderboards] = useState([])

    useEffect(() => {
        async function fetch() {
            const data = await dbGetSignatures()

            setLeaderboards(data)
        }
            
        fetch()
    }, [])

    console.log(settings)

    function h(): undefined {
        console.log("u");
        return undefined
    }

    return (
        <div id="ms-leaderboards">
            <select id="ms-leaderboards-select" defaultValue={settings ? createSignature(settings) : h()} onChange={(e) => setSettings(createSettingsFromSignature(e.target.value))}>
                <CreateLeaderboardSelect leaderboards={leaderboards}/>
            </select>
            <table id="ms-leaderboards-table">
                <thead id="ms-leaderboards-table-header">
                    <tr className="ms-leaderboards-table-row">
                        <th className="ms-leaderboards-table-header-cell">Position</th>
                        <th className="ms-leaderboards-table-header-cell">Completion time in seconds</th>
                    </tr>
                </thead>
                <tbody id="ms-leaderboards-table-body">
                    <CreateTableContents settings={settings}/>
                </tbody>
            </table>
        </div>
    )
}

function createSignature(settings: Settings) {
    let x = "w" + settings.w + "h" + settings.h + "m" + settings.m + "md" + settings.md + "hi" + settings.hi
    console.log(x)
    return x
}

function CreateLeaderboardSelect({leaderboards}: {leaderboards: string[]}) {
    return (
        <>
            { leaderboards.length > 0 ? leaderboards.map((x, index) => <option key={index}>{x}</option>) : <></>}
        </>
    )
}

function CreateTableContents({settings}: {settings: Settings | undefined}) {
    const [highscores, setHighscores] = useState([])

    useEffect(() => {
        async function fetch(settings: Settings) {
            const highscores_ = await dbGetHighscores(settings.w, settings.h, settings.m, settings.md, settings.hi)
        
            setHighscores(highscores_)
        }

        if (settings) {
            fetch(settings)
        }
    }, [settings])

    if (highscores.length > 0) {
        return(
            <>
                {
                    highscores.map((x, index) => 
                        <tr key={index} className="ms-leaderboards-table-row">
                            <td className="ms-leaderboards-table-cell">{index + 1}</td>
                            <td className="ms-leaderboards-table-cell">{x}</td>
                        </tr>)
                }
            </>
        ) 
    }
    else {
        return <tr className="ms-leaderboards-table-row">
            <td className="ms-leaderboards-table-cell">-</td>
            <td className="ms-leaderboards-table-cell">-</td>
        </tr>
    }
}

function createSettings(searchParams: URLSearchParams) {
    let settings: Settings = {
        w: Number(searchParams.get("w")),
        h: Number(searchParams.get("h")),
        m: Number(searchParams.get("m")),
        md: Number(searchParams.get("md")),
        hi: Boolean(searchParams.get("hi"))
    }

    if (settings.w === undefined || settings.h === undefined || 
        settings.m === undefined || settings.md === undefined ||
        settings.hi === undefined) {
        return undefined
    }
    else {
        return settings
    }
}

function createSettingsFromSignature(signature: string) {
    // Easier if all keys have a length of one
    signature = signature.replace("md", "d").replace("hi", "i")
    const parts = ["w", "h", "m", "d", "i"]

    let settings_numeric: number[] = []
    let settings_boolean: boolean = false

    let partIndex = 0
    let part = ""
    for (let i = 0; i < signature.length; i++) {
        if (signature[i] === parts[partIndex]) {
            continue
        }
        else if (i === signature.length - 1 || (partIndex < parts.length && signature[i] === parts[partIndex + 1])) {
            if (parts[partIndex] === "i") {
                settings_boolean = Boolean(part)
            }
            else {
                settings_numeric.push(Number(part))
            }

            part = ""
            partIndex++
        }
        else {
            part += signature[i]
        }
    }


    let settings: Settings = {
        w: settings_numeric[0],
        h: settings_numeric[1],
        m: settings_numeric[2],
        md: settings_numeric[3],
        hi: settings_boolean
    }


    return settings
}