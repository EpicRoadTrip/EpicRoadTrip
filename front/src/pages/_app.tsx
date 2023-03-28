import '../../styles/globals.css';

import { Provider } from 'react-redux';
import { store } from '../store/store';

function MyApp({ Component, pageProps, ...rest }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;