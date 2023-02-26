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
      startTimeDelay,
    }: {
      iPhoneFrameRef: React.RefObject<HTMLDivElement>
      TerminalFrameRef: React.RefObject<HTMLDivElement>
      startTimeDelay: number
    },
    ref: React.Ref<MethodsRef>,
  ) => {
    const [activateBeam, setActivateBeam] = useState(false)

    useImperativeHandle(
      ref,
      () => {
        return {
          triggerAnimation: () => {

            setTimeout(() => {
              setActivateBeam(true)
            }, startTimeDelay - 150)
          },
        }
      },
      [],
    )

    return (
      <div>
        <div className="h-40 w-40 flex flex-col justify-center overflow-hidden">
          <div
            className={clsx(
              'w-[120%] rounded-full overflow-hidden',
              styles.beam,
              {
                [styles.beamActive]: activateBeam,
              },
            )}
            style={{
              boxShadow: '0 3px 40px #04ff04',
            }}
          >
            <div
              className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}
            ></div>
            <div
              className={clsx('bg-lime-500 w-full h-1', styles.midBeam)}
            ></div>
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
        </div>
      </div>
    )
  },
)
