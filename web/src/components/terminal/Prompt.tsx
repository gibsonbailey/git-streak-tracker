import { useEffect, useRef, useState } from "react"

export default ({ command, commandCursorIndex, linesChanged }: { command: string, commandCursorIndex: number, linesChanged: number }) => {
    const [ showCursor, setShowCursor ] = useState(true)
    const cursorInterval = useRef(null)

    const clearCursorInterval = () => {
        if (cursorInterval.current) {
            clearInterval(cursorInterval.current)
        }
    }

    const createCursorInterval = () => {
        cursorInterval.current = setInterval(() => {
            setShowCursor(showCursor => !showCursor)
        }, 400)
    }

    useEffect(() => {
        createCursorInterval()

        return clearCursorInterval
    }, [])

    useEffect(() => {
        setShowCursor(true)

        clearCursorInterval()

        createCursorInterval()

        return clearCursorInterval
    }, [ command, commandCursorIndex, linesChanged ])

    return (
        <div className='flex border-t border-t-slate-800 p-2 font-medium'>
            <span className='text-fuchsia-400'>~/git-streak-tracker</span>
            <span className='text-green-300 ml-2'>git:(</span>
            <span className='text-yellow-200'>main</span>
            <span className='text-green-300'>){linesChanged ? `±${linesChanged}` : null}</span>
            <span className='ml-2'>{command.slice(0, commandCursorIndex)}</span>
            {
                showCursor ? <div className='whitespace-pre bg-cyan-400' style={{ width: 2 }}></div> : null
            }
        </div>
    )
}