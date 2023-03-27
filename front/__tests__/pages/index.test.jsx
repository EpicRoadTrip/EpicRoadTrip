import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Index from '../../src/pages/index';

describe('Index', () => {
    it('Renders correctly', () => {
        render(<Index />);
        expect(screen.getByTestId('h-title')).toBeVisible();
    });
});