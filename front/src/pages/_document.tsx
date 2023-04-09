import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script src="https://maps.googleapis.com/maps/api/js?sensor=false" async></script>
      <link href='https://fonts.googleapis.com/css?family=Montserrat&display=optional' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css?family=Inter&display=optional' rel='stylesheet'/>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}