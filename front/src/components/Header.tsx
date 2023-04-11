import Link from 'next/link'
import React from 'react';
import styles from '@styledComponentStyle/Header.module.css';
import { useRouter } from 'next/router';
import { useAppSelector } from '../store/hook';
import SearchEvent from '@components/SearchEvent';

export default function Header() {
    const viewStore = useAppSelector(state => state.view);
    const router = useRouter();

    return (
        <header className={viewStore.value === 'list' && !viewStore.isInPageDetail  ? styles.hhContainerImage : styles.hhContainerNoImage} style={{zIndex: '1'}}>
            <div className={ styles.hhTop}>
                <h1 data-testid='h-title' className={styles.hhTitle}><Link href='/'>EpicRoadTrip</Link></h1>
                <nav style={{flex: 1, textAlign: 'center'}} className={styles.hNav}>
                    <Link href='/' style={{marginRight: '1%', color: router.pathname === '/' ? '#fff' : viewStore.value === 'list' ? '#fff' : '#979DAC', borderBottom: router.pathname === '/' ? '1px solid #fff' : 'none'}} data-testid='h-nav-home'>Home</Link>
                </nav>
                <div style={{flex: 1, textAlign: 'right', marginRight: '2%', color: '#fff'}} data-testid='h-copyright'>Copryright 2023</div>
            </div>
            <SearchEvent className={`${styles.hSearchEvent} ${viewStore.value === 'map' && !viewStore.isInPageDetail ? styles.mapView : ''}`} />
        </header>
    )
}