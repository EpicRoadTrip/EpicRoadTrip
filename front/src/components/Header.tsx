import Link from 'next/link'
import React from 'react';
import styles from '@styledComponentStyle/Header.module.css';
import { useRouter } from 'next/router';
import { useAppSelector } from '../store/hook';
import SearchEvent from '@components/SearchEvent';

export default function Header() {
    const view = useAppSelector(state => state.view.value);
    const router = useRouter();

    return (
        <header className={view ? styles.hhContainerImage : styles.hhContainerNoImage} style={{zIndex: '1'}}>
            <div className={ styles.hhTop}>
                <h1 data-testid='h-title' className={styles.hhTitle}>EpicRoadTrip</h1>
                <nav style={{flex: 1, textAlign: 'center'}} className={styles.hNav}>
                    <Link href='/' style={{marginRight: '1%', color: router.pathname === '/' ? '#fff' : view ? '#fff' : '#979DAC', borderBottom: router.pathname === '/' ? '1px solid #fff' : 'none'}} data-testid='h-nav-home'>Home</Link>
                    <Link href='/about' style={{color: router.pathname === '/about' ? '#fff' : view ? '#fff' : '#979DAC', borderBottom: router.pathname === '/about' ? '1px solid #fff' : 'none'}} data-testid='h-nav-about'>About us</Link>
                    <Link href='/destinations' style={{marginLeft: '1%', color: router.pathname === '/destinations' ? '#fff' : view ? '#fff' : '#979DAC', borderBottom: router.pathname === '/destination' ? '1px solid #fff' : 'none'}} data-testid='h-nav-destinations'>Destinations</Link>
                </nav>
                <div style={{flex: 1, textAlign: 'right', marginRight: '2%', color: '#fff'}} data-testid='h-copyright'>Copryright 2023</div>
            </div>
            <SearchEvent className={styles.hSearchEvent} />
        </header>
    )
}