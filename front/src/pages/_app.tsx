import '../../styles/globals.css'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import type { AppProps } from 'next/app'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </LocalizationProvider>
  )
}

export default MyApp
