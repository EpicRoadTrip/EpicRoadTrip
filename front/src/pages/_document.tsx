import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
  const urlScriptGoogle = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`

  return (
    <Html lang="en">
      <Head />
      <script async
        src={urlScriptGoogle}>
      </script>
      <script src="https://maps.googleapis.com/maps/api/js" async></script>
      <link href='https://fonts.googleapis.com/css?family=Montserrat&display=optional' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css?family=Inter&display=optional' rel='stylesheet'/>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}