/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
    it('Render completely', () => {
        render(<SearchBar />);
        expect(screen.getByTestId('town')).toBeVisible();
        expect(screen.getByTestId('date')).toBeVisible();
        expect(screen.getByTestId('budget')).toBeVisible();
        expect(screen.getByTestId('search')).toBeVisible();
    });
    it('Render town dropdown', () => {
        const town = screen.getByTestId('town');
        render(<SearchBar />);

        fireEvent.click(town);
        expect(screen.getByTestId('town-1')).toBeVisible();
        expect(screen.getByTestId('town-2')).toBeVisible();
        expect(screen.getByTestId('town-3')).toBeVisible();
        expect(screen.getByTestId('town-4')).toBeVisible();
    });
    it('Render date dropdown', () => {
        const date = screen.getByTestId('date');
        render(<SearchBar />);

        fireEvent.click(date);
        expect(screen.getByTestId('calendar')).toBeVisible();
    });
})