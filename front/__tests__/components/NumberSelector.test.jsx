import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('NumberSelectorComponent', () => {
    it('Should renders correctly', () => {
        render(<NumberSelector />);

        expect(screen.getByTestId('nbs-container')).toBeVisible();
        expect(screen.getByTestId('nbs-title')).toBeVisible();
        expect(screen.getByTestId('nbs-body')).toBeVisible();
    });

    it('Should data render correctly', () => {
        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }, {
                    name: "Enfant",
                    number: 0,
                    apiName: "children"
                }
            ]
        }]} />);

        const title = screen.getByTestId('nbs-title');
        const nbsBody = screen.getByTestId('nbs-body');
        const items = screen.getAllByTestId('nbs-body-item');


        expect(title).toBeVisible();
        expect(title).toHaveTextContent("Voyageur");
        expect(items).toHaveLength(2);

        items.forEach((item) => {
            expect(nbsBody).toContainElement(item);
        });
    });

    it('Should data item render correctly', () => {
        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }
            ]
        }]} />);

        const dataItem = screen.getByTestId('nbs-body-item');
        const dataItemName = screen.getByTestId('nbs-item-name');
        const minusButton = screen.getByTestId('nbs-item-minus-button');
        const numberDisplayItem = screen.getByTestId('nbs-item-number');
        const plusButton = screen.getByTestId('nbs-item-plus-button');

        expect(dataItem).toContainElement(dataItemName);
        expect(dataItem).toContainElement(minusButton);
        expect(dataItem).toContainElement(numberDisplayItem);
        expect(dataItem).toContainElement(plusButton);

        expect(dataItemName).toHaveTextContent("Adulte");
        expect(numberDisplayItem).toHaveTextContent("0");
        expect(minusButton).toBeDisabled();
        expect(plusButton).not.toBeDisabled();
    });

    it('Should increment number', () => {
        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }
            ]
        }]} />);

        const minusButton = screen.getByTestId('nbs-item-minus-button');
        const numberDisplayItem = screen.getByTestId('nbs-item-number');
        const plusButton = screen.getByTestId('nbs-item-plus-button');

        expect(minusButton).toBeDisabled();

        fireEvent.click(plusButton);

        expect(minusButton).not.toBeDisabled();
        expect(numberDisplayItem).toHaveTextContent("1");
    });

    it('Should decrement number', () => {
        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }
            ]
        }]} />);

        const minusButton = screen.getByTestId('nbs-item-minus-button');
        const numberDisplayItem = screen.getByTestId('nbs-item-number');
        const plusButton = screen.getByTestId('nbs-item-plus-button');

        expect(minusButton).toBeDisabled();

        fireEvent.click(plusButton);

        expect(minusButton).not.toBeDisabled();
        expect(numberDisplayItem).toHaveTextContent("1");

        fireEvent.click(minusButton);

        expect(minusButton).toBeDisabled();
        expect(numberDisplayItem).toHaveTextContent("0");
    });

    it('Should send number on increase', () => {
        const handleValueReturn = jest.fn();

        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }
            ]
        }]} onChange={handleValueReturn} />);

        const plusButton = screen.getByTestId('nbs-item-plus-button');

        fireEvent.click(plusButton);

        expect(handleValueReturn).toHaveBeenCalled();
        expect(handleValueReturn).toHaveBeenCalledTimes(1);
    });

    it('Should send number on decrease', () => {
        const handleValueReturn = jest.fn();

        render(<NumberSelector data={[{
            title: "Voyageur",
            items: [
                {
                    name: "Adulte",
                    number: 0,
                    apiName: "adult"
                }
            ]
        }]} onChange={handleValueReturn} />);
        
        const minusButton = screen.getByTestId('nbs-item-minus-button');
        const plusButton = screen.getByTestId('nbs-item-plus-button');

        fireEvent.click(plusButton);
        fireEvent.click(plusButton);
        fireEvent.click(minusButton);

        expect(handleValueReturn).toHaveBeenCalled();
        expect(handleValueReturn).toHaveBeenCalledTimes(3);
    });
});