import clsx from "clsx"
import { setHttpClientAndAgentOptions } from "next/dist/server/config"
import { useEffect, useState } from "react"

const TutorialOverlay = () => {
    return (
        <div className='absolute -right-4 -top-4 z-30 bg-slate-50 text-black p-4 rounded-lg w-1/2'>Each day, make at least one contribution to GitHub to keep your streak.</div>
    )
}

const Terminal = () => {
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
-rw-r--r--    1 git-man  staff    154 Nov 13 12:03 code.tsx
`

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
    // const [ mode, setMode ] = useState<'shell' | 'vim'>('shell')
    const [ mode, setMode ] = useState<'shell' | 'vim'>('vim')
    const [ linesChanged, setLinesChanged ] = useState(0)
    const [ currentCommand, setCurrentCommand ] = useState('')
    const [ commandOutputs, setCommandOutputs ] = useState<string[]>([])
    const [ currentCommandCursorIndex, setCurrentCommandIndex ] = useState(0)
    const [ commandSpeed, setCommandSpeed ] = useState<'low' | 'high'>('low')


    useEffect(() => {
        // setTimeout(() => {
        //     setCurrentCommand('ls -la')
        // }, 1500)
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
                    setCurrentCommand('vim code.tsx')
                    setCurrentCommandIndex(0)
                }, 1200)
            } else if (currentCommand === 'vim code.tsx') {
                setTimeout(() => {
                    setMode('vim')
                    setCurrentCommand('')
                    setLinesChanged(1)
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
                setTimeout(() => {
                    setCurrentCommand('ls -la')
                    setCurrentCommandIndex(0)
                }, 1000)
            }
        }
    }, [ currentCommand, currentCommandCursorIndex ])

    return (
        mode === 'vim' ? (
            <VimCodeView />
        ) : (
            <div className='flex flex-col justify-end h-72 w-full'>
                <div className='p-2'>
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
    return (
        <div className='flex border-t border-t-slate-800 p-2'>
            <span className='text-fuchsia-400'>~/git-streak-tracker</span>
            <span className='text-green-300 ml-2'>git:(</span>
            <span className='text-yellow-200'>main</span>
            <span className='text-green-300'>){linesChanged ? `±${linesChanged}` : null}</span>
            <span className='ml-2'>{command.slice(0, commandCursorIndex)}</span>
            {/* TODO: Implement blinking cursor */}
            {/* <span className='ml-2 whitespace-pre'> </span> */}
        </div>
    )

}

const vimText = `export default () => {
    const [ mode, setMode ] = useState<'shell' | 'vim'>('shell')

    return mode === 'vim' ? (
        <div className='text-red-500'>VIM MODE</div>
    ) : (
        <div className='text-blue-500'>SHELL MODE</div>
    )
}
`


const VimCodeView = () => {
    const vimStatusBar = `--NORMAL--`

    return (
        <div className='flex flex-col h-72 justify-end w-full whitespace-pre tracking-wider'>
            <div className=''>
                <CodeToken tokenType='keyword'>import</CodeToken>
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
                <Space />
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
                <Space />
            </div>
            <div>
                <Space />
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
                <CodeToken tokenType='string'>'text-red-500'</CodeToken>
                <CodeToken tokenType='elementBrackets'>{'>'}</CodeToken>
                <CodeToken tokenType='text'>VIM MODE</CodeToken>
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
            <div className='bg-cyan-800 text-slate-50 w-full p-1'>{vimStatusBar}</div>
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
    }
    return (
        <span className={colorMap[ tokenType ]}>{children}</span>
    )
}

const Space = () => (
    <span>  </span>
)

export {
    Terminal,
    TutorialOverlay,
}