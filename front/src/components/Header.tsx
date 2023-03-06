import React from 'react';

export default function Header() {
    return (
        <>
            <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'/>
            <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png' width='100%'/>
        <header className='hh-container'>
            <div/>
            <h1 data-testid='h-title' style={{fontFamily: 'Inter', flex: 1, textAlign: 'left'}}>EpicRoadTrip</h1>
            <nav style={{flex: 1, textAlign: 'center'}}>
                <a href='/' className='.hh-nav-item' data-testid='h-nav-home'>Home</a>
                <a href='/about' className='.hh-nav-item' data-testid='h-nav-about'>About us</a>
                <a href='/destinations' className='.hh-nav-item' data-testid='h-nav-destinations'>Destinations</a>
            </nav>
            <p style={{flex: 1, textAlign: 'right'}} data-testid='h-copyright'>Copryright 2023</p>
        </header>
        </>
    )
}

if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    document.head.append(style);

    style.innerText = `
        .hh-container {
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .hh-nav-item {
            font-family: 'Montserrat';
            color: black;
            text-decoration: 'none';
            margin-left: '2%';
        }
    `
}