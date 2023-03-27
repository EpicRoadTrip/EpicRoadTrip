import Link from 'next/link'
import React from 'react';

export default function Header() {

    React.useEffect(() => {
        const style = document.createElement('style');
        document.head.append(style);
        style.innerText = `
        .hh-container {
            height: 40vh;  
            background-image: url(/assets/images/header-background.jpg);
            background-size: cover;
            background-position: center;
            width: 100%;
        }
        .hh-top {
            display: flex;
            width: 100%;
            height: 30%;
            backdrop-filter: blur(10px);
            font-family: 'Montserrat';
            justify-content: center;
            flex-direction: row;
            align-items: center;
        }
        .hh-title {
            flex: 1;
            text-align: left;
            margin-left: 2%;
        }
        .hh-nav-item {
            font-size: 150px;
        }
        `
    }, []);

    return (
        <header className='hh-container'>
            <div className='hh-top'>
                <h1 data-testid='h-title' style={{flex: 1, textAlign: 'left', marginLeft: '2%'}}>EpicRoadTrip</h1>
                <nav style={{flex: 1, textAlign: 'center'}}>
                    <Link href='/' style={{marginRight: '1%'}} data-testid='h-nav-home'>Home</Link>
                    <Link href='/about' data-testid='h-nav-about'>About us</Link>
                    <Link href='/destinations' data-testid='h-nav-destinations' style={{marginLeft: '1%'}}>Destinations</Link>
                </nav>
                <div style={{flex: 1, textAlign: 'right', marginRight: '2%'}} data-testid='h-copyright'>Copryright 2023</div>
            </div>
        </header>
    )
}