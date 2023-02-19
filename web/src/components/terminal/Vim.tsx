import clsx from "clsx"
import { useEffect, useState } from "react"

export default ({ animationFinished }: { animationFinished: () => void }) => {
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
        <div className='flex flex-col h-96 justify-between w-full whitespace-pre p-2 font-medium'>
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