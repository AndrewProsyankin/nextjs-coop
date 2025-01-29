'use client'
import React from 'react';
import cx from "classnames";
import styles from '@/app/moduleCSS/LoadingSpinner.module.css'

export type LoadingSpinnerProps = {
    isLoading: boolean;
    isLoaded?: boolean; 
    color?: string;
    text?: string;
  };
  
const LoadingSpinner = ({
    isLoading,
    isLoaded = false, 
    color = "black",
    text = "",
}: LoadingSpinnerProps) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isLoading && !isLoaded) return null;
    if (!isMounted) return null;

    return (
        <div className={styles.wrapper}>
            <svg className={styles.clock} viewBox="0 0 100 100">
                {/* Сам циферблат */}
                <g className={styles.dial}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * Math.PI) / 6;
                        const x = 50 + 40 * Math.sin(angle);
                        const y = 50 - 40 * Math.cos(angle);
                        return <circle key={i} cx={x} cy={y} r="1.5" fill="black" />;
                    })}
                </g>
                {/* Часовая */}
                <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="30"
                    className={cx(styles.hourHand, { [styles.loaded]: isLoaded })}
                    strokeWidth="2"
                    stroke={color}
                />
                {/* Минутная */}
                <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="20"
                    className={cx(styles.minuteHand, { [styles.loaded]: isLoaded })}
                    strokeWidth="1"
                    stroke={color}
                />
            </svg>
            {text && <span className="mt-4">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;