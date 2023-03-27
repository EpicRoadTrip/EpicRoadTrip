import "../../styles/globals.css"
import type { AppProps } from 'next/app';
import { wrapper } from '../store/store';

function EpicRoadTrip({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default wrapper.withRedux(EpicRoadTrip);