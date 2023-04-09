import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import InputDateRangePicker from '../../src/components/InputDateRangePicker';
import { configureStore } from '@reduxjs/toolkit';
import dateSearchSlice from '../../src/store/slices/dateSearchSlice';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from '../../src/store/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

describe('Date Range Picker', () => {
    let store;
    let persistor;

    function createTestStore() {
        const persistConfig = {
            key: 'root',
            storage,
        }
        const persistedDateSearchReducer = persistReducer(persistConfig, dateSearchSlice);
        const store = configureStore({
            reducer: {
                dateSearch: persistedDateSearchReducer
            },
            middleware: [thunk]
        });
        persistor = persistStore(store);
        return store;
    }

    beforeEach(() => {
        store = createTestStore();
    });

    afterEach(cleanup);

    it('Renders correctly', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );

        expect(screen.getByTestId('idrp-container')).toBeVisible();
        expect(screen.getByTestId('idrp-header')).toBeVisible();
        expect(screen.getByTestId('idrp-body')).toBeVisible();
        expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
        expect(screen.getByTestId('idrp-header-title')).toBeVisible();
        expect(screen.getByTestId('idrp-header-date-container')).toBeVisible();
        expect(screen.getByTestId('idrp-header-calendar-icon')).toBeVisible();
    });

    it('Should open dropdown on click on header', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );

        const header = screen.getByTestId('idrp-header');

        fireEvent.click(header);

        expect(screen.getByTestId('idrp-body')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('idrp-body-header')).toBeVisible();
        expect(screen.getByTestId('idrp-body-calendar')).toBeVisible();
        expect(screen.getByTestId('idrp-body-footer')).toBeVisible();
    });

    it('Should close dropdown on click outiside after openned', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );

        const header = screen.getByTestId('idrp-header');

        fireEvent.click(header);
        fireEvent.click(document.body);

        waitFor(() => {
            expect(screen.getByTestId('idrp-body')).toBeVisible();
            expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
        });
    });

    it('Should keep button select date disabled if no date selected', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        expect(screen.getByTestId('idrp-body-footer-button-select')).toBeDisabled();
    });

    it('Should close calendar if cancel button click with no dates selected', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        const cancelButton = screen.getByTestId('idrp-body-footer-button-cancel');
        fireEvent.click(cancelButton);

        expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
    });

    it('Should reset date if date is selected', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );
        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        const cancelButton = screen.getByTestId('idrp-body-footer-button-cancel');
        const selectButton = screen.getByTestId('idrp-body-footer-button-select');
        const calendarButton1 = (await screen.findAllByText("7"))[0];
        const calendarButton2 = (await screen.findAllByText("14"))[1];


        waitFor(() => {
            fireEvent.click(calendarButton1);
            fireEvent.click(calendarButton2);
            expect(selectButton).toBeEnabled();
        });

        fireEvent.click(cancelButton);

        expect(selectButton).toBeDisabled();
    });

    it('Should close dropdown if date is selected', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <InputDateRangePicker />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        );
        const header = screen.getByTestId('idrp-header');
        const body = screen.getByTestId('idrp-body');
        fireEvent.click(header);

        const selectButton = screen.getByTestId('idrp-body-footer-button-select');
        const calendarButton1 = (await screen.findAllByText("7"))[0];
        const calendarButton2 = (await screen.findAllByText("14"))[1];


        waitFor(() => {
            fireEvent.click(calendarButton1);
            fireEvent.click(calendarButton2);
            expect(selectButton).toBeEnabled();
        });

        fireEvent.click(selectButton);

        waitFor(() => {
            expect(body).toBeEmptyDOMElement();
        });
    });
});