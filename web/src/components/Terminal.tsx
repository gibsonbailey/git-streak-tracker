import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

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
        <div className='flex w-full border-b border-b-slate-800 bg-gray-900 '>
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

const lsOutput = `
total 42
drwxr-xr-x   27 git-man  staff    864 Feb  8 21:18 .
drwxr-xr-x   25 git-man  staff    800 Feb 15 18:41 ..
drwxr-xr-x   16 git-man  staff    512 Feb 14 14:06 .git
-rw-r--r--    1 git-man  staff   1408 Feb  6 21:44 .gitignore
-rw-r--r--    1 git-man  staff    154 Nov 13 12:03 code.tsx
`

const gitCommitOutput = `
[main 3e6f0d6] Minor change to language.
1 file changed, 1 insertions(+), 0 deletions(-)`

const gitPushOutput = `
Enumerating objects: 6, done.
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
    const [ linesChanged, setLinesChanged ] = useState(0)
    const [ currentCommand, setCurrentCommand ] = useState('')
    const [ commandOutputs, setCommandOutputs ] = useState<string[]>([])
    const [ currentCommandCursorIndex, setCurrentCommandIndex ] = useState(0)
    const [ commandSpeed, setCommandSpeed ] = useState<'low' | 'high'>('low')


    useEffect(() => {
        setTimeout(() => {
            setCurrentCommand('ls -la')
        }, 1500)
    }, [])

    const vimModeFinished = () => {
        setMode('shell')
        setTimeout(() => {
            setCommandSpeed('high')
            setCurrentCommand('git commit -m "Minor change to language."')
            setCurrentCommandIndex(0)
        }, 1000)
    }

    useEffect(() => {
        if (currentCommand == '') {
            return
        }
        if (currentCommandCursorIndex < currentCommand.length) {
            const timeout = setTimeout(() => {
                setCurrentCommandIndex(currentCommandCursorIndex + 1)
            }, Math.floor((commandSpeed === 'low' ? 50 : 20) + (Math.random() * 30)))
            return () => { clearTimeout(timeout) }
        } else {
            if (currentCommand === 'ls -la') {
                setTimeout(() => {
                    setCurrentCommand('')
                    setCommandOutputs([ lsOutput ])
                }, 200)
                setTimeout(() => {
                    setCurrentCommand('vim code.tsx')
                    setCurrentCommandIndex(0)
                }, 1200)
            } else if (currentCommand === 'vim code.tsx') {
                setTimeout(() => {
                    setMode('vim')
                    setCurrentCommand('')
                    setLinesChanged(1)
                }, 200)
            } else if (currentCommand === 'git commit -m "Minor change to language."') {
                setTimeout(() => {
                    setCommandSpeed('low')
                    setLinesChanged(0)
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
            <VimCodeView animationFinished={vimModeFinished} />
        ) : (
            <div className='flex flex-col w-full'>
                <div className='p-2 flex flex-col justify-end h-72 overflow-hidden'>
                    {commandOutputs.map(output => (
                        <pre key={output}>{output}</pre>
                    ))}
                </div>
                <Prompt command={currentCommand} commandCursorIndex={currentCommandCursorIndex} linesChanged={linesChanged} />
            </div>
        )
    )
}

const Prompt = ({ command, commandCursorIndex, linesChanged }: { command: string, commandCursorIndex: number, linesChanged: number }) => {
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
        <div className='flex border-t border-t-slate-800 p-2'>
            <span className='text-fuchsia-400'>~/git-streak-tracker</span>
            <span className='text-green-300 ml-2'>git:(</span>
            <span className='text-yellow-200'>main</span>
            <span className='text-green-300'>){linesChanged ? `±${linesChanged}` : null}</span>
            <span className='ml-2'>{command.slice(0, commandCursorIndex)}</span>
            {
                showCursor ? <div className='whitespace-pre bg-cyan-400' style={{width: 2}}></div> : null
            }
        </div>
    )
}


const VimCodeView = ({ animationFinished }: { animationFinished: () => void }) => {
    const [ vimStatusBar, setVimStatusBar ] = useState<string>('--NORMAL--')
    const [ cursorStep, setCursorStep ] = useState(0)
    const [ typingPosition, setTypingPosition ] = useState(0)
    const [ currentTypingText, setCurrentTypingText ] = useState('VIM')


    useEffect(() => {
        setTimeout(() => {
            if (cursorStep === 5) {
                setVimStatusBar('--INSERT--')
            } else if (cursorStep === 7) {
                setVimStatusBar('--NORMAL--')
            }
            setCursorStep(cursorStep + 1)
        }, cursorStep < 5 ? 200 : 600)
    }, [ cursorStep ])

    useEffect(() => {
        if (cursorStep === 6 || cursorStep === 8) {
            if (typingPosition < currentTypingText.length + 1) {
                setTimeout(() => {
                    setTypingPosition(typingPosition + 1)
                }, Math.floor(50 + (Math.random() * 30)))
            } else if (currentTypingText === ':wq') {
                setTimeout(() => {
                    animationFinished()
                }, 300)
            }
        } else if (cursorStep === 7) {
            setTypingPosition(0)
            setCurrentTypingText(':wq')
        }
    }, [ cursorStep, typingPosition ])

    return (
        <div className='flex flex-col h-96 justify-between w-full whitespace-pre p-2'>
            <div>
                <div>
                    {
                        cursorStep === 0 ? (
                            <>
                                <CodeToken tokenType='cursor'>i</CodeToken>
                                <CodeToken tokenType='keyword'>mport</CodeToken>
                            </>
                        ) : (
                            <CodeToken tokenType='keyword'>import</CodeToken>
                        )
                    }
                    <Space />
                    <CodeToken tokenType='outerBracket'>{'{'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='arg'>useState</CodeToken>
                    <Space />
                    <CodeToken tokenType='outerBracket'>{'}'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='keyword'>from</CodeToken>
                    <Space />
                    <CodeToken tokenType='string'>'react'</CodeToken>
                </div>
                <div>
                    {
                        cursorStep === 1 ? (
                            <>
                                <CodeToken tokenType='cursor'> </CodeToken>
                                <Space />
                            </>
                        ) : (
                            <Space />
                        )
                    }
                </div>
                <div>
                    <CodeToken tokenType='keyword'>export</CodeToken>
                    <Space />
                    <CodeToken tokenType='keyword'>default</CodeToken>
                    <Space />
                    <CodeToken tokenType='outerBracket'>{'()'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='arrow'>{'=>'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='outerBracket'>{'{'}</CodeToken>
                </div>
                <div>
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='declareVar'>const</CodeToken>
                    <Space />
                    <CodeToken tokenType='innerBracket'>[</CodeToken>
                    <Space />
                    <CodeToken tokenType='var'>mode,</CodeToken>
                    <Space />
                    <CodeToken tokenType='var'>setMode</CodeToken>
                    <Space />
                    <CodeToken tokenType='innerBracket'>]</CodeToken>
                    <Space />
                    <CodeToken tokenType='text'>=</CodeToken>
                    <Space />
                    <CodeToken tokenType='function'>useState</CodeToken>
                    <CodeToken tokenType='innerBracket'>{'<'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='string'>'shell'</CodeToken>
                    <Space />
                    <CodeToken tokenType='text'>|</CodeToken>
                    <Space />
                    <CodeToken tokenType='string'>'shell'</CodeToken>
                    <Space />
                    <CodeToken tokenType='innerBracket'>{'>('}</CodeToken>
                    <CodeToken tokenType='string'>'shell'</CodeToken>
                    <CodeToken tokenType='innerBracket'>{')'}</CodeToken>
                </div>
                <div>
                    {
                        cursorStep === 2 ? (
                            <>
                                <CodeToken tokenType='cursor'> </CodeToken>
                                <Space />
                            </>
                        ) : (
                            <Space />
                        )
                    }
                </div>
                <div>
                    {
                        cursorStep === 3 ? (
                            <>
                                <CodeToken tokenType='cursor'> </CodeToken>
                                <CodeToken tokenType='text'> </CodeToken>
                            </>
                        ) : (
                            <Space />
                        )
                    }
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='keyword'>return</CodeToken>
                    <Space />
                    <CodeToken tokenType='var'>mode</CodeToken>
                    <Space />
                    <CodeToken tokenType='text'>===</CodeToken>
                    <Space />
                    <CodeToken tokenType='string'>'vim'</CodeToken>
                    <Space />
                    <CodeToken tokenType='text'>?</CodeToken>
                    <Space />
                    <CodeToken tokenType='innerBracket'>{'('}</CodeToken>
                </div>
                <div>
                    {
                        cursorStep === 4 ? (
                            <>
                                <CodeToken tokenType='cursor'> </CodeToken>
                                <CodeToken tokenType='text'> </CodeToken>
                            </>
                        ) : (
                            <Space />
                        )
                    }
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='elementBrackets'>{'<'}</CodeToken>
                    <CodeToken tokenType='elementName'>div</CodeToken>
                    <Space />
                    <CodeToken tokenType='arg'>className</CodeToken>
                    <CodeToken tokenType='text'>=</CodeToken>
                    <CodeToken tokenType='string'>'text-red-500'</CodeToken>
                    <CodeToken tokenType='elementBrackets'>{'>'}</CodeToken>
                    {
                        cursorStep < 5 ? (
                            <CodeToken tokenType='text'>SHELL MODE</CodeToken>
                        ) : (
                            null
                        )
                    }
                    {
                        cursorStep === 5 ? (
                            <>
                                <CodeToken tokenType='cursor'>S</CodeToken>
                                <CodeToken tokenType='text'>HELL MODE</CodeToken>
                            </>
                        ) : (
                            null
                        )
                    }
                    {
                        cursorStep === 6 ? (
                            <>
                                <CodeToken tokenType='text'>{'VIM'.slice(0, typingPosition)}</CodeToken>
                                <CodeToken tokenType='cursor'> </CodeToken>
                                <CodeToken tokenType='text'>MODE</CodeToken>
                            </>
                        ) : (
                            null
                        )
                    }
                    {
                        cursorStep > 6 ? (
                            <CodeToken tokenType='text'>VIM MODE</CodeToken>
                        ) : (
                            null
                        )
                    }
                    <CodeToken tokenType='elementBrackets'>{'</'}</CodeToken>
                    <CodeToken tokenType='elementName'>div</CodeToken>
                    <CodeToken tokenType='elementBrackets'>{'>'}</CodeToken>
                </div>
                <div>
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='innerBracket'>{')'}</CodeToken>
                    <Space />
                    <CodeToken tokenType='text'>:</CodeToken>
                    <Space />
                    <CodeToken tokenType='innerBracket'>{'('}</CodeToken>
                </div>
                <div>
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='elementBrackets'>{'<'}</CodeToken>
                    <CodeToken tokenType='elementName'>div</CodeToken>
                    <Space />
                    <CodeToken tokenType='arg'>className</CodeToken>
                    <CodeToken tokenType='text'>=</CodeToken>
                    <CodeToken tokenType='string'>'text-blue-500'</CodeToken>
                    <CodeToken tokenType='elementBrackets'>{'>'}</CodeToken>
                    <CodeToken tokenType='text'>SHELL MODE</CodeToken>
                    <CodeToken tokenType='elementBrackets'>{'</'}</CodeToken>
                    <CodeToken tokenType='elementName'>div</CodeToken>
                    <CodeToken tokenType='elementBrackets'>{'>'}</CodeToken>
                </div>
                <div>
                    <Space />
                    <Space />
                    <Space />
                    <Space />
                    <CodeToken tokenType='innerBracket'>{')'}</CodeToken>
                </div>
                <div>
                    <CodeToken tokenType='outerBracket'>{'}'}</CodeToken>
                </div>
            </div>
            <div className='bg-cyan-800 text-slate-50 w-full p-1 whitespace-pre'>{cursorStep < 8 ? vimStatusBar : ' ' + currentTypingText.slice(0, typingPosition)}</div>
        </div>
    )
}

const CodeToken = ({ tokenType, children }: React.PropsWithChildren<{ tokenType: string }>) => {
    const colorMap = {
        outerBracket: 'text-yellow-400',
        innerBracket: 'text-pink-400',
        arg: 'text-cyan-300',
        text: 'text-slate-300',
        function: 'text-yellow-200',
        keyword: 'text-violet-400',
        string: 'text-[#d1734b]',
        elementName: 'text-[#3459bf]',
        declareVar: 'text-[#3459bf]',
        arrow: 'text-[#3459bf]',
        var: 'text-blue-400',
        elementBrackets: 'text-gray-700',
        cursor: 'text-black bg-gray-400',
    }
    return (
        <span
            className={clsx(
                colorMap[ tokenType ],
                'tabular-nums',
            )}>{children}</span>
    )
}

const Space = () => (
    <span>  </span>
)