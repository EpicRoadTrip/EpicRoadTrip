import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RootState } from '../../src/store/store';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import Header from '../../src/components/Header';

const mockStore = configureStore([]);

describe('Header', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            view: {
                value: true
            }
        });
    });

    it('Renders correctly', () => {
        render(
            <Provider store={store}>
                <Header />
            </Provider>
        );

        expect(screen.getByTestId('h-title')).toBeVisible();
        expect(screen.getByTestId('h-nav-home')).toBeVisible();
        expect(screen.getByTestId('h-nav-destinations')).toBeVisible();
        expect(screen.getByTestId('h-nav-about')).toBeVisible();
        expect(screen.getByTestId('h-copyright')).toBeVisible();
    });
});