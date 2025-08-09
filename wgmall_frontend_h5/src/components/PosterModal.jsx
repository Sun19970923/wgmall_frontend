import React, { useEffect, useState, useRef } from 'react';
import styles from './PosterModal.module.less';

import poster1 from '@/assets/poster1.png';
import poster2 from '@/assets/poster2.png';
import poster3 from '@/assets/poster3.png';

const posters = [poster1, poster2, poster3];

export default function PosterModal() {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const endX = useRef(0);

    useEffect(() => {
        if (sessionStorage.getItem('showPosters') === 'true') {
            setVisible(true);
            sessionStorage.removeItem('showPosters');
        }
    }, []);

    const handleClose = () => setVisible(false);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        endX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const distance = endX.current - startX.current;
        if (distance > 50 && current > 0) {
            setCurrent((prev) => prev - 1);
        } else if (distance < -50 && current < posters.length - 1) {
            setCurrent((prev) => prev + 1);
        }
        startX.current = 0;
        endX.current = 0;
    };

    if (!visible) return null;

    return (
        <div className={styles.overlay}>
            <div
                className={styles.carousel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={styles.slides}
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {posters.map((src, index) => (
                        <div className={styles.slide} key={index}>
                            <img
                                src={src}
                                alt=""
                                className={styles.image}
                                onClick={handleClose}
                            />
                        </div>
                    ))}
                </div>
                {/* 轮播指示点 */}
                <div className={styles.dots}>
                    {posters.map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${index === current ? styles.active : ''}`}
                            onClick={() => setCurrent(index)}
                        />
                    ))}
                </div>
            </div>

            <button className={styles.closeBtn} onClick={handleClose}>
                Close
            </button>
        </div>
    );
}
