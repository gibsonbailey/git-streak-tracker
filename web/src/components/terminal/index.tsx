import styles from './index.module.css'
import clsx from 'clsx'
import { forwardRef, useEffect, useState } from 'react'
import Vim from './Vim'
import Prompt from './Prompt'
import useTypingText from '../../utils/useTypingText'

export default forwardRef(
  (
    {
      animationFinished,
    }: {
      animationFinished: () => void
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const headerButtonColors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

    const [enableQuakeAnimation, setEnableQuakeAnimation] = useState(false)
    const [dimOverlayEnabled, setDimOverlayEnabled] = useState(false)

    const triggerQuakeAnimation = () => {
      setTimeout(() => {
        setEnableQuakeAnimation(true)
      }, 100)
      setTimeout(() => {
        setDimOverlayEnabled(true)
      }, 1700)
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'max-w-xl 2xl:max-w-2xl flex flex-col bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden relative w-[90%] md:max-w-[500px] md:w-[500px] lg:w-[762px] h-[240px] sm:h-[350px] 2xl:h-[400px]',
          {
            [styles.quakeAnimation]: enableQuakeAnimation,
          },
        )}
      >
        <div className="flex w-full border-b border-b-slate-800 bg-gray-900 ">
          {headerButtonColors.map((color) => (
            <div
              className={clsx(
                'h-2 sm:h-3 w-2 sm:w-3 ml-1.5 sm:ml-2 my-1.5 sm:my-2 rounded-full',
                color,
              )}
              key={color}
            ></div>
          ))}
        </div>
        <Content
          animationFinished={animationFinished}
          triggerQuakeAnimation={triggerQuakeAnimation}
        />
        {/* Dim overlay */}
        <div
          className={clsx(
            'absolute top-0 left-0 w-full h-full bg-black opacity-0 transition-opacity duration-[2500ms]',
            {
              'opacity-30': dimOverlayEnabled,
            },
          )}
        ></div>
      </div>
    )
  },
)

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

// const commitCommand = 'git commit -m "Minor change to language."'
const commitCommand = 'git commit -m "Minor change."'

const Content = ({
  animationFinished,
  triggerQuakeAnimation,
}: {
  animationFinished: () => void
  triggerQuakeAnimation: () => void
}) => {
  const [mode, setMode] = useState<'shell' | 'vim'>('shell')
  const [linesChanged, setLinesChanged] = useState(1)
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandOutputs, setCommandOutputs] = useState<string[]>([])
  const [commandSpeed, setCommandSpeed] = useState<'low' | 'high'>('low')
  const [enablePulse, setEnablePulse] = useState(false)
  const { showCursor, cursorIndex, outputText } = useTypingText({
    text: currentCommand,
    commandSpeed,
  })

  useEffect(() => {
    setTimeout(() => {
      setCurrentCommand('ls -la')
    }, 1500)
  }, [])

  const vimModeFinished = () => {
    setMode('shell')

    setTimeout(() => {
      setCommandSpeed('high')
      setCurrentCommand(commitCommand)
    }, 1000)
  }

  useEffect(() => {
    if (currentCommand == '') {
      return
    }
    if (cursorIndex >= currentCommand.length) {
      if (currentCommand === 'ls -la') {
        setTimeout(() => {
          setCurrentCommand('')
          setCommandOutputs([lsOutput])
        }, 200)

        setTimeout(() => {
          setCurrentCommand(commitCommand)
        }, 1200)
      } else if (currentCommand === commitCommand) {
        setTimeout(() => {
          setCommandSpeed('low')
          setLinesChanged(0)
          setCurrentCommand('')
          setCommandOutputs([lsOutput, gitCommitOutput])
        }, 200)

        setTimeout(() => {
          setCurrentCommand('git push')
        }, 1000)
      } else if (currentCommand === 'git push') {
        setTimeout(() => {
          setCurrentCommand('')
          setCommandOutputs([lsOutput, gitCommitOutput, gitPushOutput])
          animationFinished()
          setTimeout(() => {
            setEnablePulse(true)
          }, 200)
          setTimeout(() => {
            triggerQuakeAnimation()
          }, 400)
        }, 200)
      }
    }
  }, [currentCommand, cursorIndex])

  return mode === 'vim' ? (
    <Vim animationFinished={vimModeFinished} />
  ) : (
    <div className="flex flex-col w-full justify-between h-full">
      <div
        className={clsx(
          'p-2 flex flex-col justify-end overflow-hidden max-h-[180px] sm:max-h-[280px] 2xl:max-h-[320px] text-xs sm:text-md 2xl:text-lg',
          styles.gradientText,
          {
            [styles.gradientTextPulse]: enablePulse,
          },
        )}
      >
        {commandOutputs.map((output, index) => (
          <pre key={index}>
            <span className={'font-thin '}>{output}</span>
          </pre>
        ))}
      </div>

      <Prompt
        showCursor={showCursor}
        outputText={outputText}
        linesChanged={linesChanged}
      />
    </div>
  )
}
