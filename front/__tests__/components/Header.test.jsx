import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../src/components/Header';

describe('Header', () => {
    it('Renders correctly', () => {
        render(<Header />);

        expect(screen.getByTestId('h-title')).toBeVisible();
        expect(screen.getByTestId('h-nav-home')).toBeVisible();
        expect(screen.getByTestId('h-nav-destinations')).toBeVisible();
        expect(screen.getByTestId('h-nav-about')).toBeVisible();
        expect(screen.getByTestId('h-copyright')).toBeVisible();
    });
});