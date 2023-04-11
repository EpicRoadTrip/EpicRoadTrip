import SearchEvent from '@components/SearchEvent';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dateSearchSlice from '../../src/store/slices/dateSearchSlice';
import searchSlice from '../../src/store/slices/searchSlice';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from '../../src/store/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

describe('SearchEvent', () => {
    let store;
    let persistor;

    function createTestStore() {
        const persistConfig = {
            key: 'root',
            storage,
        }
        const persistedDateSearchReducer = persistReducer(persistConfig, dateSearchSlice);
        const persistedSearchReducer = persistReducer(persistConfig, searchSlice);
        const store = configureStore({
            reducer: {
                dateSearch: persistedDateSearchReducer,
                search: persistedSearchReducer
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

    it('Renders correctly', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        expect(screen.getByTestId('se-container')).toBeVisible();
        expect(screen.getByTestId('se-header')).toBeVisible();
        expect(screen.getByTestId('se-header-input')).toBeVisible();
        expect(screen.getByTestId('se-header-icon-search')).toBeVisible();
        expect(screen.getByTestId('se-header-icon-config')).toBeVisible();
        expect(screen.getByTestId('se-body')).toBeVisible();
        expect(screen.getByTestId('se-body')).toBeEmptyDOMElement();
    });

    it('Should open dropdown on click on header', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        const header = screen.getByTestId('se-header');

        fireEvent.click(header);

        waitFor(() => {
            expect(screen.getByTestId('se-body')).not.toBeEmptyDOMElement();
        });
    });

    it('Should close dropdown on click outside', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        const header = screen.getByTestId('se-header');

        fireEvent.click(header);

        waitFor(() => {
            expect(screen.getByTestId('se-body')).not.toBeEmptyDOMElement();
        });

        fireEvent.click(document.body);

        waitFor(() => {
            expect(screen.getByTestId('se-body')).toBeEmptyDOMElement();
        });
    });

    it('Should enable and focus on input after dropdown openned', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        const header = screen.getByTestId('se-header');
        const input = screen.getByTestId('se-header-input');

        fireEvent.click(header);

        expect(input).toHaveFocus();
    });

    it('Should enable button if something changed', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        const header = screen.getByTestId('se-header');
        const input = screen.getByTestId('se-header-input');

        fireEvent.click(header);

        const searchButton = screen.getByTestId('se-body-button-search');

        expect(searchButton).toBeDisabled();

        // Number selector
        const plusButton = screen.getAllByTestId('nbs-item-plus-button')[0];

        fireEvent.click(plusButton);

        // Date range picker
        const headerDateRange = screen.getByTestId('idrp-header');
        fireEvent.click(headerDateRange);

        const selectDateButton = screen.getByTestId('idrp-body-footer-button-select');
        const calendarButton1 = (await screen.findAllByText("7"))[0];
        const calendarButton2 = (await screen.findAllByText("14"))[1];

        fireEvent.click(calendarButton1);
        fireEvent.click(calendarButton2);
        fireEvent.click(selectDateButton);

        // Dropdown data
        fireEvent.click(screen.getAllByTestId("isd-checkbox")[0]);

        fireEvent.change(input, { target: { value: 'Nantes' } });

        expect(searchButton).toBeEnabled();
    });

    it('Should save in storage if all property is present and save button clicked', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SearchEvent />
                    </PersistGate>
                </Provider>
            </LocalizationProvider >
        );

        const header = screen.getByTestId('se-header');
        const input = screen.getByTestId('se-header-input');

        fireEvent.click(header);

        const saveButton = screen.getByTestId('se-body-button-save-seach');

        expect(saveButton).toBeDisabled();

        // Number selector
        const plusButton = screen.getAllByTestId('nbs-item-plus-button')[0];

        fireEvent.click(plusButton);

        // Date range picker
        const headerDateRange = screen.getByTestId('idrp-header');
        fireEvent.click(headerDateRange);

        const selectDateButton = screen.getByTestId('idrp-body-footer-button-select');
        const calendarButton1 = (await screen.findAllByText("7"))[0];
        const calendarButton2 = (await screen.findAllByText("14"))[1];

        fireEvent.click(calendarButton1);
        fireEvent.click(calendarButton2);
        fireEvent.click(selectDateButton);

        // Dropdown data
        fireEvent.click(screen.getAllByTestId("isd-checkbox")[0]);

        fireEvent.change(input, { target: { value: 'Nantes' } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);
        
        expect(store.getState().search.date.isDateSet).toBeTruthy();
        expect(store.getState().search.searchValue).toBeTruthy();
        expect(store.getState().search.selectedTypes).not.toEqual([]);
        expect(store.getState().search.travelers).toEqual([{ "apiName": "adult", "id": 1, "min": 0, "name": "Adulte", "number": 1 }, { "apiName": "children", "id": 2, "min": 0, "name": "Enfant", "number": 0 }]);

    });
});