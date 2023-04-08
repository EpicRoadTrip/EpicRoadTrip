import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

describe('SearchEvent', () => {
    it('Renders correctly', () => {
        render(<SearchEvent />);

        expect(screen.getByTestId('se-container')).toBeVisible();
        expect(screen.getByTestId('se-header')).toBeVisible();
        expect(screen.getByTestId('se-header-input')).toBeVisible();
        expect(screen.getByTestId('se-header-icon-search')).toBeVisible();
        expect(screen.getByTestId('se-header-icon-config')).toBeVisible();
        expect(screen.getByTestId('se-body')).toBeVisible();
        expect(screen.getByTestId('se-body')).toBeEmptyDOMElement();
    });

    it('Should open dropdown on click on header', () => {
        render(<SearchEvent />);

        const header = screen.getByTestId('se-header');

        fireEvent.click(header);

        waitFor(() => {
            expect(screen.getByTestId('se-body')).not.toBeEmptyDOMElement();
        });
    });

    it('Should close dropdown on click outside', () => {
        render(<SearchEvent />);

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
        render(<SearchEvent />);

        const header = screen.getByTestId('se-header');
        const input = screen.getByTestId('se-header-input');

        expect(input).toHaveAttribute('readonly', 'readonly');
        
        fireEvent.click(header);
        
        waitFor(() => {
            expect(input).toHaveAttribute('readonly', '');
            expect(input).toHaveFocus();
        });
    });
});