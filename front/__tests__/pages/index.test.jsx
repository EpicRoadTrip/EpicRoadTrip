import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Index from '../../src/pages/index';
import * as reactRedux from 'react-redux';
import { change }from '../../src/store/slices/viewSlice';
import '@testing-library/jest-dom';


jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Index', () => {
    
    console.log(typeof change);
    const useDispatchMock = reactRedux.useDispatch;
    const useSelectorMock = reactRedux.useSelector;
    const testAction = jest.spyOn(change, 'Change value');
    const mockStore = {
        view: {
            value: true,
        }
    }

    beforeEach(() => {
        useDispatchMock.mockImplementation(() => () => {});
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    });
    afterEach(() => {
        useDispatchMock.mockClear();
        useSelectorMock.mockClear();
    });

    it('Renders correctly with the list view', () => {
        render(<Index />);

        expect(screen.getByTestId('ig-button')).toBeVisible();
        expect(screen.getByText('List')).toBeVisible();
    });
    it('Change the view', () => {
        render(<Index />);

        const button = screen.getByTestId('ig-button');
        fireEvent.click(button);
        expect(testAction).toHaveBeenCalled();
    });
});