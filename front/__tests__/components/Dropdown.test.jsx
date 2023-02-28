import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'

describe('Dropdown', () => {
    it('Renders correctly', () => {
        render(<Dropdown options={[{value: 'test1', label: 'test1'}, {value: 'test2', label: 'test2'}]} value='test'/>);
        expect(screen.getByText('test')).toBeVisible();
    });
});