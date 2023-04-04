import React from 'react';
import Head from 'next/head';

import Header from '../components/Header';
import ListView from './view/list';
import MapView from './view/map';

import { useAppSelector, useAppDispatch } from '../store/hook';
import { change } from '../store/slices/viewSlice';

export default function Home() {
  const [listView, setListView] = React.useState<boolean>(true);
  const view = useAppSelector(state => state.view.value);
  const dispatch = useAppDispatch();
  function handleClick() {
    setListView(!listView);
    dispatch(change()); 
  }

  return (
    <>
        <Head>
            <title>EpicRoadTrip | Welcome !</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header />
        <div style={{overflow: 'hidden'}}>
          {view ? <ListView/> : <MapView/>}
        </div>
        <button onClick={() => {handleClick()}} style={{position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)'}} data-testid='ig-button'>Change view</button>
    </>
  )
}