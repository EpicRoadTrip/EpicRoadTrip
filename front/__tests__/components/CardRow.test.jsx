import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Card row', () => {
    it('Renders correctly', () => {
        render(<CardRow imgSrc='coucou' title='La montagne du Gay' price={542} description='La description' />);

        expect(screen.getByTestId('card-container')).toBeVisible();
        expect(screen.getByTestId('card-image')).toBeVisible();
        expect(screen.getByTestId('card-header-title')).toBeVisible();
        expect(screen.getByTestId('card-header-price')).toBeVisible();
        expect(screen.getByTestId('card-body-description')).toBeVisible();
    });

    it('Card container should contain image and card body', () => {
        const card = render(<CardRow imgSrc='coucou' title='La montagne du Gay' price={542} description='La description' />);
        const imageCard = card.getByTestId('card-image');
        const cardBody = card.getByTestId('card-body');

        expect(card.container).toContainElement(imageCard);
        expect(card.container).toContainElement(cardBody);
    });

    it('Card body should contain card header and card text description', () => {
        const card = render(<CardRow imgSrc='coucou' title='La montagne du Gay' price={542} description='La description' />);
        const cardBody = card.getByTestId('card-body');
        const cardHeader = card.getByTestId('card-header');
        const cardTextDescription = card.getByTestId('card-body-description');

        expect(cardBody).toContainElement(cardHeader);
        expect(cardBody).toContainElement(cardTextDescription);
    });

    it('Card header should contain card title and card price', () => {
        const card = render(<CardRow imgSrc='coucou' title='La montagne du Gay' price={542} description='La description' />);
        const cardHeader = card.getByTestId('card-header');
        const cardTitle = card.getByTestId('card-header-title');
        const cardPrice = card.getByTestId('card-header-price');

        expect(cardHeader).toContainElement(cardTitle);
        expect(cardHeader).toContainElement(cardPrice);
    });

    it('Click on card should redirect to detail page', () => {
        const card = render(<CardRow imgSrc='coucou' title='La montagne du Gay' price={542} description='La description' />);
        fireEvent.click(card.baseElement);

        const link = window.location.href;

        expect(link).toContain('/detail/');
    })
});