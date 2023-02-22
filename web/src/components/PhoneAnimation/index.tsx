import Image from 'next/image'
import clsx from 'clsx'
import styles from './home.module.css'
import { useEffect, useState } from 'react'
import SimulatedAppView from './SimulatedAppView'


const iPhoneAnimation = () => {
    const [appIsOpen, setAppIsOpen] = useState<boolean>(false)
    const [todayComplete, setTodayComplete] = useState<boolean>(false)
    const [streakLength, setStreakLength] = useState<number>(10)

    useEffect(() => {
        setTimeout(() => {
            // Turns widgets from grey to green
            setTodayComplete(true)
            setStreakLength(streakLength + 1)
        }, 13000);

        setTimeout(() => {
            // opens app.
            setAppIsOpen(true)
        }, 15500);

    }, [])

    return (
        <div className={clsx("w-full h-full overflow-hidden relative", styles.iphoneFrame)}>

            {
                appIsOpen && <SimulatedAppView />
            }

            <div className="w-full flex justify-center relative z-20" >
                {/* =========== Top of iphone (camera etc) ============ */}
                <div className={clsx("text-white absolute font-bold", styles.topRowText)}>12:00</div>
                <div className={clsx("text-white absolute right-5 flex", styles.topIconRow)}>

                    <div className="mt-1 mr-1 d-flex justify-center items-center">
                        <Image src="/iphone-status-icons/white-wifi.png" width={10} height={10} unoptimized priority alt="wifi icon" />
                    </div>
                    <div className={clsx('mt-1', styles.battery)}>
                        <Image src="/iphone-status-icons/white-battery.png" width={15} height={15} unoptimized priority alt="battery icon" />
                    </div>
                </div>

                <div className={clsx('flex justify-center items-center relative', styles.iphoneNotch)}>
                    <div className={clsx(styles.iphoneMicrophone)}></div>
                    <div className={clsx('absolute right-5', styles.iphoneCamera)}></div>
                </div>
            </div>


            {/* ============ Iphone homescreen background ============ */}
            <div className={clsx("w-full h-full absolute z-0", styles.iphoneBg)} />


            <div className={clsx("mt-6 px-4 relative z-10", styles.iphonebody)}>
                {/* ============ Widget area ============ */}
                <div
                    className={
                        clsx(
                            'relative transition',
                            styles.widgetRect,
                            todayComplete && styles.todayComplete,
                            appIsOpen && styles.blurredRectWidget
                        )
                    }
                >
                    {
                        // seperating into a big ternary to persist the fade in animation
                        todayComplete ? (
                            <Image
                                src="/widgets/CopperFlame.svg"
                                alt="Git Streak Flame"
                                width={50}
                                height={50}
                                className={clsx(styles.flame)}
                            />
                        ) :
                            <Image
                                src="/widgets/GrayFlame.svg"
                                alt="Git Streak Flame"
                                width={50}
                                height={50}
                                className={clsx(styles.flame)}
                            />
                    }

                    <div className="flex items-center justify-center h-full w-full relative">
                        <div
                            className={
                                clsx(
                                    "text-white mr-5 pt-2 transition-opacity",
                                    !todayComplete && 'opacity-40'
                                )
                            }
                        >
                            <div className={clsx("font-bold text-center", styles.widgetTextLarge)}>{streakLength}</div>
                            <div className={clsx("uppercase text-center", styles.widgetTextSmall)}>days</div>
                        </div>
                        <Image
                            src="/widgets/Graph.png"
                            alt="Git Streak Flame"
                            width={60}
                            height={80}
                            unoptimized
                            priority
                            className={
                                clsx(
                                    "transition-opacity",
                                    todayComplete ? 'opacity-100' : 'opacity-0'
                                )
                            }
                        />
                        <div className={clsx(
                            "transition-opacity",
                            todayComplete ? 'opacity-0' : 'opacity-50',
                            styles.noContributionText
                        )
                        }
                        >
                            No contributions today
                        </div>

                    </div>
                </div>

                <div className={
                    clsx(
                        'relative z-20 transition',
                        styles.widgetSquare,
                        todayComplete && styles.todayComplete,
                        appIsOpen && styles.openSquareWidgetAnimation
                    )
                }
                >
                    <div className="flex items-center justify-center h-full w-full relative">
                        {
                            // seperating into a big ternary to persist the fade in animation
                            todayComplete ? (
                                <Image
                                    src="/widgets/CopperFlame.svg"
                                    alt="Git Streak Flame"
                                    width={50}
                                    height={50}
                                    className={clsx(styles.flame)}
                                />
                            ) :
                                <Image
                                    src="/widgets/GrayFlame.svg"
                                    alt="Git Streak Flame"
                                    width={50}
                                    height={50}
                                    className={clsx(styles.flame)}
                                />
                        }

                        <div
                            className={
                                clsx(
                                    "text-white pt-2 relative transition-opacity",
                                    !todayComplete && 'opacity-40'
                                )
                            }
                        >
                            <div className={clsx("font-bold text-center", styles.widgetTextLarge)}>{streakLength}</div>
                            <div className={clsx("uppercase text-center", styles.widgetTextSmall)}>days</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full absolute bottom-0 flex justify-center">
                {/* ============ Bottom row of apps ============ */}
                <div className={clsx('flex justify-around items-center relative', styles.bottomRow, appIsOpen && styles.blurredBottomRow)}>
                    {/* <Image src="/app-icons/phone.png" width={30} height={30}/> */}
                    <Image src="/app-icons/safari.png" width={38} height={38} priority alt="Iphone safari App" />
                    <Image src="/app-icons/appstore.png" width={38} height={38} priority alt="Iphone App Store App" />
                    <Image src="/app-icons/messages.png" width={38} height={38} priority alt="Iphone Messages App" />
                </div>
            </div>


        </div>
    );
}


export default iPhoneAnimation
