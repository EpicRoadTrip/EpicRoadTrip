import React from 'react';
import Head from 'next/head';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

import { useAppSelector, useAppDispatch } from '../store/hook';
import { change, leavePageDetail } from '../store/slices/viewSlice';
import { Button, ChakraProvider } from '@chakra-ui/react';
import ListView from './view/list';
import MapView from './view/map';

export default function Home() {
  const view = useAppSelector(state => state.view.value);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(leavePageDetail())
  })

  function handleClick() {
    dispatch(change()); 
  }

  return (
    <>
        <Head>
            <title>EpicRoadTrip | Welcome !</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div style={{overflow: 'hidden'}}>
          {view === 'list' ? <ListView/> : <MapView/>}
        </div>
        <ChakraProvider>
          <Button
            onClick={() => {handleClick()}}
            leftIcon={view ? <MapRoundedIcon />: <ListRoundedIcon />}
            colorScheme='blue'
            variant='solid'
            borderRadius={50}
            position='fixed'
            bottom='3%'
            left='50%'
            transform='translateX(-50%)'
          >
            { view ? 'Display map' : 'Display list' }
          </Button>
        </ChakraProvider>
    </>
  )
}