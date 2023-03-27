import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import About from '../../src/pages/about';

describe('About', () => {
    it('Renders correctly', () => {
        render(<About />);
        expect(screen.getByTestId('a-title')).toBeVisible();
    });
});