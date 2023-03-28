import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

let store;
jest.mock('moment', () => {
    const moment = require.requireActual('moment');
    const momentInstance = moment();
    jest.spyOn(momentInstance, 'format');

    function fakeMoment() {
        return momentInstance;
    }

    Object.assign(fakeMoment, moment);

    return fakeMoment;
});
const mockStore = configureStore([]);

beforeEach(() => {
    store = mockStore({
        view: {
            value: false
        }
    });
});
afterEach(cleanup);

describe('Date Range Picker', () => {
    it('Renders correctly', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker />
            </Provider>
        );

        expect(screen.getByTestId('idrp-container')).toBeVisible();
        expect(screen.getByTestId('idrp-header')).toBeVisible();
        expect(screen.getByTestId('idrp-body')).toBeVisible();
        expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
        expect(screen.getByTestId('idrp-title')).toBeVisible();
        expect(screen.getByTestId('idrp-date-format-container')).toBeVisible();
        expect(screen.getByTestId('idrp-date-icon')).toBeVisible();
    });

    it('Should open dropdown on click on header', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker />
            </Provider>
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
            <Provider store={store}>
                <InputDateRangePicker />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');

        fireEvent.click(header);
        fireEvent.click(document.body);

        expect(screen.getByTestId('idrp-body')).toBeVisible();
        expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
    });

    it('Should keep button select date disabled if no date selected', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        expect(screen.getByTestId('idrp-body-footer-button-select')).toBeDisabled();
    });

    it('Should enable button if date selected', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker dateStart={moment('01-01-2023')} dateEnd={moment('07-01-2023')} />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        expect(screen.getByTestId('idrp-body-footer-button-select')).not.toBeDisabled();
    });

    it('Should display date in header if date selected', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker dateStart={moment('01-01-2023')} dateEnd={moment('07-01-2023')} />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);

        expect(screen.getByTestId('idrp-body-header-dateStart-dayNumber')).toHaveTextContent("01");
        expect(screen.getByTestId('idrp-body-header-dateStart-monthYear')).toHaveTextContent("JANUARY 2023");
        expect(screen.getByTestId('idrp-body-header-dateStart-dayName')).toHaveTextContent("Sunday");

        expect(screen.getByTestId('idrp-body-header-dateEnd-dayNumber')).toHaveTextContent("07");
        expect(screen.getByTestId('idrp-body-header-dateEnd-monthYear')).toHaveTextContent("JANUARY 2023");
        expect(screen.getByTestId('idrp-body-header-dateEnd-dayName')).toHaveTextContent("Saturday");
    });

    it('Should reset calendar if cancel button click with date selected', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker dateStart={moment('01-01-2023')} dateEnd={moment('07-01-2023')} />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);
        
        const cancelButton = screen.getByTestId('idrp-body-footer-button-cancel');
        fireEvent.click(cancelButton);

        expect(screen.getByTestId('idrp-body-footer-button-select')).toBeDisabled();
    });

    it('Should close calendar if cancel button click with no dates selected', () => {
        render(
            <Provider store={store}>
                <InputDateRangePicker />
            </Provider>
        );

        const header = screen.getByTestId('idrp-header');
        fireEvent.click(header);
        
        const cancelButton = screen.getByTestId('idrp-body-footer-button-cancel');
        fireEvent.click(cancelButton);

        expect(screen.getByTestId('idrp-body')).toBeEmptyDOMElement();
    });
});