import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Card column', () => {
    it('Renders correctly', () => {
        render(<CardColumn />);

        expect(screen.getByTestId('card-container')).toBeVisible();
        expect(screen.getByTestId('card-image')).toBeVisible();
        expect(screen.getByTestId('card-header-title')).toBeVisible();
        expect(screen.getByTestId('card-header-price')).toBeVisible();
        expect(screen.getByTestId('card-body-description')).toBeVisible();
    });

    it('image should have a top radius only', () => {
        const { container, getAllByTestId } = render(<CardColumn />);

        // Replace <YOUR_DIV_ID> by your component's id
        let contentDiv = document.getElementById('card-image'); // Retrieve the image
        let style = window.getComputedStyle(contentDiv[0]); // Get the style of the image

        expect(style.borderTopLeftRadius).toEqual('10px'); // Test if have a border top left radius equal to 10px
        expect(style.borderTopRightRadius).toEqual('10px'); // Test if have a border top right radius equal to 10px

        expect(style.borderBottomLeftRadius).toEqual('10px'); // Test if have a border bottom left radius equal to 10px
        expect(style.borderBottomRightRadius).toEqual('10px'); // Test if have a border bottom right radius equal to 10px
    });

    it('should not have a shadow', () => {
        const { container, getAllByTestId } = render(<CardColumn />);

        // Replace <YOUR_DIV_ID> by your component's id
        let contentDiv = document.getElementById('card-image'); // Retrieve the image
        let style = window.getComputedStyle(contentDiv[0]); // Get the style of the image

        expect(style.boxShadow).toBeNull();
    });

    it('should be in display row', () => {
        const { container, getAllByTestId } = render(<CardRow />);

        // Replace <YOUR_DIV_ID> by your component's id
        let contentDiv = document.getElementById('card-image'); // Retrieve the image
        let style = window.getComputedStyle(contentDiv[0]); // Get the style of the image

        expect(style.display).toEqual('flex');
        expect(style.flexDirection).toEqual('column');
    });
})