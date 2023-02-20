/**
 * @jest-environment jsdom
 */
import IndexPage from '../src/pages/index';
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';

describe('index', () => {
    it('should render index', () => {
        render(<IndexPage />);
        expect(screen.getByText('About')).toBeInTheDocument();
    }
    )
})