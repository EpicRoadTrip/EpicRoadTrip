import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '../../src/components/Counter';

describe('Counter', () => {
    it('Renders correctly', () => {
        render(<Counter label='test'/>);

        expect(screen.getByTestId('c-label')).toBeVisible();
        expect(screen.getByTestId('c-plus')).toBeVisible();
        expect(screen.getByTestId('c-minus')).toBeVisible();
        expect(screen.getByTestId('c-count')).toBeVisible();
    });
    it('Increment', () => {
        render(<Counter label='test'/>);

        expect(screen.getByText('0')).toBeVisible();
        fireEvent.click(screen.getByTestId('c-plus'));
        expect(screen.getByText('1')).toBeVisible();
    });
    it('Decrement', () => {
        render(<Counter label='test'/>);

        expect(screen.getByText('0')).toBeVisible();
        fireEvent.click(screen.getByTestId('c-plus'));
        fireEvent.click(screen.getByTestId('c-minus'));
        expect(screen.getByText('0')).toBeVisible();
    });
    it("Don't go below 0", () => {
        render(<Counter label='test'/>);

        expect(screen.getByText('0')).toBeVisible();
        fireEvent.click(screen.getByTestId('c-minus'));
        expect(screen.getByText('0')).toBeVisible();
    });
    it("Don't go beyond 10", () => {
        render(<Counter label='test'/>);

        expect(screen.getByText('0')).toBeVisible();
        for(let i = 0; i < 20; i++)
            fireEvent.click(screen.getByTestId('c-plus'));
        expect(screen.getByText('10')).toBeVisible();
    });
});