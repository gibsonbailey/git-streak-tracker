import clsx from "clsx"
import { useEffect, useState } from "react"


export default () => {
    return (
        <div className='w-full flex flex-col bg-gray-900 rounded-2xl'>
            <Header />
            <Content />
        </div>
    )
}

const Header = () => {
    const colors = [
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
    ]
    return (
        <div className='flex w-full border-b border-b-slate-800'>
            {colors.map(color => (
                <div
                    className={clsx(
                        'h-3 w-3 ml-2 my-2 rounded-full',
                        color
                    )}
                    key={color}
                ></div>
            ))}
        </div>
    )
}

const lsOutput = `total 42
drwxr-xr-x   27 git-man  staff    864 Feb  8 21:18 .
drwxr-xr-x   25 git-man  staff    800 Feb 15 18:41 ..
drwxr-xr-x   16 git-man  staff    512 Feb 14 14:06 .git
-rw-r--r--    1 git-man  staff   1408 Feb  6 21:44 .gitignore
-rw-r--r--    1 git-man  staff    154 Nov 13 12:03 code.ts
    `

const Content = () => {
    const [ mode, setMode ] = useState<'shell' | 'vim'>('shell')
    const [ linesChanged, setLinesChanged ] = useState('')
    const [ currentCommand, setCurrentCommand ] = useState('ls -la')
    const [ commandOutputs, setCommandOutputs ] = useState<string[]>([])
    const [ currentCommandCursorIndex, setCurrentCommandIndex ] = useState(0)

    useEffect(() => {
        if (currentCommandCursorIndex < currentCommand.length) {
            setTimeout(() => {
                setCurrentCommandIndex(currentCommandCursorIndex + 1)
            }, Math.floor(50 + (Math.random() * 30)))
        } else {
            if (currentCommand === 'ls -la') {
                setTimeout(() => {
                    setCommandOutputs([ lsOutput ])
                }, 200)
                setTimeout(() => {
                    setCurrentCommand('vim code.ts')
                    setCurrentCommandIndex(0)
                }, 1200)
            } else if (currentCommand === 'vim code.ts') {
                setMode('vim')
            }
        }
    }, [ currentCommandCursorIndex ])

    return (
        mode === 'vim' ? (
            <div></div>
        ) : (
            <div className='flex flex-col justify-end h-72 w-full'>
                <div className='p-2'>
                    {commandOutputs.map(output => (
                        <pre>{output}</pre>
                    ))}
                </div>
                <div className='flex border-t border-t-slate-800 p-2'>
                    <span className='text-fuchsia-400'>~/git-streak-tracker</span>
                    <span className='text-green-300 ml-2'>git:(</span>
                    <span className='text-yellow-200'>main</span>
                    <span className='text-green-300'>){linesChanged}</span>
                    <span className='ml-2'>{currentCommand.slice(0, currentCommandCursorIndex)}</span>
                </div>
            </div>
        )
    )
}