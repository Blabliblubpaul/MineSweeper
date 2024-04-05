import { useDispatch } from "react-redux";
import Board from "./Board";
import { useSearchParams } from "react-router-dom";

/* Cell States
0: unopened
1: flagged
2: opened
3: exploded (If mine)
*/

export default function MineSweeper() {
    const dispatch = useDispatch()

    let [searchParams] = useSearchParams()

    let rows: number = Number(searchParams.get("r"))
    let columns: number = Number(searchParams.get("c"))
    let mines: number = Number(searchParams.get("m"))
    let metalDetectors: number = Number(searchParams.get("d"))
    let hint: boolean = searchParams.get("h") === "true"

    return (
        <Board rows={rows} columns={columns} mines={mines} metalDetectors={metalDetectors} hint={hint}/>
    )
}