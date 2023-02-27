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

    const laserBaseClasses = 'h-full w-1.5 sm:w-full sm:h-1'

    return (
      <div
        ref={ref}
        className="h-20 w-40 sm:h-40 sm:w-40 flex sm:flex-col justify-center overflow-hidden"
      >
        <div
          className={clsx(
            'h-40 w-8 sm:h-5 sm:w-[120%] rounded-full overflow-hidden flex justify-center sm:flex-col',
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
            className={clsx('bg-lime-300', laserBaseClasses, styles.outerBeam)}
          ></div>
          <div className={clsx('bg-lime-500', laserBaseClasses, styles.midBeam)}></div>
          <div
            className={clsx('bg-lime-400', laserBaseClasses, styles.centerBeam)}
          ></div>
          <div
            className={clsx('bg-lime-500', laserBaseClasses, styles.midBeam2)}
          ></div>
          <div
            className={clsx('bg-lime-300', laserBaseClasses, styles.outerBeam)}
          ></div>
        </div>
      </div>
    )
  },
)
