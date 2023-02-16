import clsx from "clsx"
import { useEffect, useState } from "react"


export default () => {
    return (
        <div className='w-full flex flex-col bg-gray-900 rounded-2xl overflow-hidden relative'>
            <Header />
            <Content />
        </div>
    )
}

const Header = () => {
    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
    ]
    return (
        <div className='flex w-full border-b border-b-slate-800 absolute z-20 bg-gray-900 '>
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

const vimText = `export default () => {
    const [ mode, setMode ] = useState<'shell' | 'vim'>('shell')

    return mode === 'vim' ? (
        <div className='text-red-500'>VIM MODE</div>
    ) : (
        <div className='text-blue-500'>SHELL MODE</div>
    )
}
`
const vimStatusBar = `--NORMAL--`

const gitCommitOutput = `[main 3e6f0d6] Minor change to language.
 1 file changed, 1 insertions(+), 0 deletions(-)`

const gitPushOutput = `Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Delta compression using up to 4 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 481 bytes | 481.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 1 local object.
To https://github.com/gibsonbailey/git-streak-tracker.git
   3e6f0d6..89abcdef  main -> main`

const Content = () => {
    const [ mode, setMode ] = useState<'shell' | 'vim'>('shell')
    const [ linesChanged, setLinesChanged ] = useState('')
    const [ currentCommand, setCurrentCommand ] = useState('')
    const [ commandOutputs, setCommandOutputs ] = useState<string[]>([])
    const [ currentCommandCursorIndex, setCurrentCommandIndex ] = useState(0)
    const [ commandSpeed, setCommandSpeed ] = useState<'low' | 'high'>('low')


    useEffect(() => {
        setTimeout(() => {
            setCurrentCommand('ls -la')
        }, 1500)
    }, [])

    useEffect(() => {
        if (currentCommand == '') {
            return
        }
        if (currentCommandCursorIndex < currentCommand.length) {
            setTimeout(() => {
                setCurrentCommandIndex(currentCommandCursorIndex + 1)
            }, Math.floor((commandSpeed === 'low' ? 50 : 20) + (Math.random() * 30)))
        } else {
            if (currentCommand === 'ls -la') {
                setTimeout(() => {
                    setCurrentCommand('')
                    setCommandOutputs([ lsOutput ])
                }, 200)
                setTimeout(() => {
                    setCurrentCommand('vim code.ts')
                    setCurrentCommandIndex(0)
                }, 1200)
            } else if (currentCommand === 'vim code.ts') {
                setTimeout(() => {
                    setMode('vim')
                    setCurrentCommand('')
                    setLinesChanged('±1')
                }, 200)
                setTimeout(() => {
                    setMode('shell')
                    setTimeout(() => {
                        setCommandSpeed('high')
                        setCurrentCommand('git commit -m "Minor change to language."')
                        setCurrentCommandIndex(0)
                    }, 1000)
                }, 1500)
            } else if (currentCommand === 'git commit -m "Minor change to language."') {
                setTimeout(() => {
                    setCommandSpeed('low')
                    setLinesChanged('')
                    setCurrentCommand('')
                    setCommandOutputs([ lsOutput, gitCommitOutput ])
                }, 200)
                setTimeout(() => {
                    setCurrentCommand('git push')
                    setCurrentCommandIndex(0)
                }, 1000)
            } else if (currentCommand === 'git push') {
                setTimeout(() => {
                    setCurrentCommand('')
                    setCommandOutputs([ lsOutput, gitCommitOutput, gitPushOutput ])
                }, 200)
            }
        }
    }, [ currentCommand, currentCommandCursorIndex ])

    return (
        mode === 'vim' ? (
            <div className='flex flex-col h-72 justify-between w-full'>
                <pre className='p-2'>{vimText}</pre>
                <div className='bg-cyan-800 text-slate-50 w-full p-1'>{vimStatusBar}</div>
            </div>
        ) : (
            <div className='flex flex-col justify-end h-72 w-full'>
                <div className='p-2'>
                    {commandOutputs.map(output => (
                        <pre key={output}>{output}</pre>
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