import { useEffect, useRef, useState } from "react"

export default ({ text, commandSpeed = "low" }) => {
    const [cursorIndex, setCursorIndex] = useState(0)
    const [showCursor, setShowCursor] = useState(true)
    const cursorInterval = useRef(null)

    const clearCursorInterval = () => {
        if (cursorInterval.current) {
            clearInterval(cursorInterval.current)
        }
    }

    const createCursorInterval = () => {

        cursorInterval.current = setInterval(() => {
            setShowCursor(value => !value)
        }, 400)
    }

    useEffect(() => {
        setCursorIndex(0)
    }, [text])

    useEffect(() => {
        createCursorInterval()

        return clearCursorInterval
    }, [])

    useEffect(() => {
        setShowCursor(true)

        clearCursorInterval()

        createCursorInterval()

        let timeout: ReturnType<typeof setTimeout>;

        if (cursorIndex < text.length) {
            timeout = setTimeout(() => {
                setCursorIndex(cursorIndex + 1)
            }, Math.floor((commandSpeed === 'low' ? 50 : 20) + Math.random() * 30))
        }

        return () => {
            clearCursorInterval()
            if (timeout){
                clearTimeout(timeout)
            }
        }

    }, [text, cursorIndex])

    return { showCursor, cursorIndex, outputText: text.slice(0, cursorIndex) }
}