import clsx from 'clsx'
import Sparks from './Sparks'
import styles from './laser.module.css'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

type MethodsRef = {
  triggerAnimation: () => void
}

export default forwardRef(
  (
    {
      iPhoneFrameRef,
      TerminalFrameRef,
    }: {
      iPhoneFrameRef: React.RefObject<HTMLDivElement>
      TerminalFrameRef: React.RefObject<HTMLDivElement>
    },
    ref: React.Ref<MethodsRef>,
  ) => {
    const sparkControl = useRef<'stop' | 'run' | 'finish'>('stop')
    const [particleAnimationFinished, setParticleAnimationFinished] =
      useState(false)

    const [activateBeam, setActivateBeam] = useState(false)

    useImperativeHandle(
      ref,
      () => {
        return {
          triggerAnimation: () => {
            const startTimeDelay = 800

            setTimeout(() => {
              setActivateBeam(true)
            }, startTimeDelay - 150)

            setTimeout(() => {
              sparkControl.current = 'run'
            }, startTimeDelay)

            setTimeout(() => {
              sparkControl.current = 'finish'
            }, startTimeDelay + 1800)

            setTimeout(() => {
              setParticleAnimationFinished(true)
            }, startTimeDelay + 6000)
          },
        }
      },
      [],
    )

    return (
      <div className="h-40 w-40 flex flex-col justify-center overflow-hidden">
        <div
          className={clsx('w-[120%] rounded-full overflow-hidden', styles.beam, {
            [styles.beamActive]: activateBeam,
          })}
          style={{
            boxShadow: '0 3px 40px #04ff04',
          }}
        >
          <div
            className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}
          ></div>
          <div className={clsx('bg-lime-500 w-full h-1', styles.midBeam)}></div>
          <div
            className={clsx('bg-lime-400 w-full h-1', styles.centerBeam)}
          ></div>
          <div
            className={clsx('bg-lime-500 w-full h-1', styles.midBeam2)}
          ></div>
          <div
            className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}
          ></div>
        </div>
        {particleAnimationFinished ? null : (
          <Sparks
            ref={sparkControl}
            sparksXPosition={0}
            iPhoneFrameRef={iPhoneFrameRef}
            TerminalFrameRef={TerminalFrameRef}
          />
        )}
      </div>
    )
  },
)
