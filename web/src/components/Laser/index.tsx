import clsx from 'clsx'
import styles from './laser.module.css'
import { forwardRef } from 'react'

export default forwardRef(
  (
    {
      activateBeam,
    }: {
      activateBeam: boolean
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className="h-20 sm:h-40 sm:w-40 flex flex-col justify-center overflow-hidden"
      >
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
      </div>
    )
  },
)
