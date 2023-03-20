import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectDropdown', () => {
    it('Renders correctly', () => {
        render(<InputSelectDropdown data={[]} selectedData={[]} />);

        expect(screen.getByTestId('isd-container')).toBeVisible();
        expect(screen.getByTestId('isd-header')).toBeVisible();
        expect(screen.getByTestId('isd-display-chip-container')).toBeInTheDocument();
        expect(screen.getByTestId('isd-display-chip-container')).toBeEmptyDOMElement();
        expect(screen.getByTestId('isd-input-search')).toBeInTheDocument();
        expect(screen.getByTestId('isd-body')).toBeInTheDocument();
        expect(screen.getByTestId('isd-body')).toBeEmptyDOMElement();
    });

    it('Header and body should by in container', () => {
        const container = render(<InputSelectDropdown data={[]} selectedData={[]} />);
        const header = screen.getByTestId('isd-header');
        const body = screen.getByTestId('isd-body');

        expect(container.baseElement).toContainElement(header);
        expect(container.baseElement).toContainElement(body);
    });

    it('Header should include chip container and input search', () => {
        render(<InputSelectDropdown data={[]} selectedData={[]} />);
        const header = screen.getByTestId('isd-header');
        const chipContainer = screen.getByTestId('isd-display-chip-container');
        const inputSearch = screen.getByTestId('isd-input-search');

        expect(header).toContainElement(chipContainer);
        expect(header).toContainElement(inputSearch);
    });

    it('Should open dropdown on click in header', () => {
        render(<InputSelectDropdown data={[]} selectedData={[]} />);
        const header = screen.getByTestId('isd-header');

        fireEvent.click(header);

        expect(screen.getByTestId('isd-body')).toBeVisible();
        expect(screen.getByTestId('isd-body')).not.toBeEmptyDOMElement();
    });

    it('Close openned dropdown on click outside', () => {
        render(<InputSelectDropdown data={[]} selectedData={[]} />);
        const header = screen.getByTestId('isd-header');

        fireEvent.click(header);
        expect(screen.getByTestId('isd-body')).toBeVisible();
        expect(screen.getByTestId('isd-body')).not.toBeEmptyDOMElement();

        fireEvent.click(document.body);
        expect(screen.getByTestId('isd-body')).toBeVisible();
        expect(screen.getByTestId('isd-body')).toBeEmptyDOMElement();
    });

    it('Chips should be visible if selected data', () => {
        render(<InputSelectDropdown data={[]} selectedData={[{
            id: 1,
            name: "Logement",
            apiName: "location",
        }]} />);

        const header = screen.getByTestId('isd-header');
        const chipContainer = screen.getByTestId('isd-display-chip-container');
        expect(chipContainer).not.toBeEmptyDOMElement();
    });

    it('Should send selected data on selection', () => {
        const handleOnSelectedChange = jest.fn();
        render(<InputSelectDropdown data={[]} selectedData={[{
            id: 1,
            name: "Logement",
            apiName: "location",
        }]} onSelectedChange={handleOnSelectedChange} />);

        waitFor(() => {
            expect(handleOnSelectedChange).toHaveBeenCalledTimes(1);
        });
    });
});