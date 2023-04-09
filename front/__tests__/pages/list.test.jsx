import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import List from '../../src/pages/view/list';

describe('List view', () => {
    it('Renders correctly', () => {
        render(<List />);
        expect(screen.getByTestId('iv-list')).toBeVisible();
    });
})