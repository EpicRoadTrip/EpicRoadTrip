import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Destinations from '../../src/pages/destinations';

describe('Destinations', () => {
    it('Renders correctly', () => {
        render(<Destinations />);
        expect(screen.getByTestId('d-title')).toBeVisible();
    });
});