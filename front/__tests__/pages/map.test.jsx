import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Map from '../../src/pages/view/map';

describe('Map view', () => {
    it('Renders correctly', () => {
        render(<Map />);
        expect(screen.getByTestId('iv-map')).toBeVisible();
    });
})