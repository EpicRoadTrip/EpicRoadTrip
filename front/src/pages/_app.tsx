import '../../styles/globals.css'

import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import { persistor, store } from '../store/store'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { PersistGate } from 'redux-persist/integration/react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Layout from '@components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </LocalizationProvider>
  )
}

export default MyApp
