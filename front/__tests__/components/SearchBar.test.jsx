import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SearchBar from '../../src/components/SearchBar';
import 'react-dropdown/style.css'

describe('SearchBar', () => {
    it('Renders correctly', () => {
        render(<SearchBar/>);
        expect(screen.getByTestId('sb-container')).toBeVisible();
    });
});