import React from 'react';
//import MapComponent from '../components/MapDirection';
//import { ChakraProvider } from '@chakra-ui/react';

import { getStatus, getLocationsByCity } from '../api/api.js';

export default function IndexPage() {
  const [text, setText] = React.useState<string>('');

  React.useEffect(() => {
    async function getData() {
      await getLocationsByCity("Nantes")
        .then((result) => {
          console.log(result);
          setText(JSON.stringify(result));
        });
    }
    getData();
  }, []);
  return (
    <>
      <p>{text}</p>
    </>
  )
}
