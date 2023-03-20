import React from 'react';
import MapComponent from '../components/MapDirection';
import { ChakraProvider } from '@chakra-ui/react';

const AnyReactComponent = ({ text }) => <div style={{backgroundColor: 'red'}}>{text}</div>;

export default function IndexPage() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    <>
      <ChakraProvider>
        <MapComponent/>
      </ChakraProvider>
    </>
  )
}
