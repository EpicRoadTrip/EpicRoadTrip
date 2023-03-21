import { getLocationsByCity, getStatus, getLocationDetails } from "../../src/api/api";
import axios from "axios";

describe('Test for the getStatus api call', () => {
    it('should return pong', async () => {
        const spy = jest.spyOn(axios, 'get').mockResolvedValue({data: 'pong'});
        const data = await getStatus();
        expect(data).toEqual("pong");
        spy.mockRestore();
    });
    it('should return an error', async () => {
        const spy = jest.spyOn(axios, 'get').mockRejectedValue(new Error('API not online'));
        await expect(getStatus()).rejects.toThrow('API not online');
        spy.mockRestore();
    })
});

describe('Test for the getLocationsByCity api call', () => {
    it('should return an array of locations', async () => {
        const spy = jest.spyOn(axios, 'get').mockResolvedValue({data: {name: 'Tour Feifel', location: {lat: 3.222, long: 1.333}}})
        const data = await getLocationsByCity('Paris');
        expect(data).toBeInstanceOf(Object);
        spy.mockRestore();
    })
    it('should return an error', async () => {
        const spy = jest.spyOn(axios, 'get').mockRejectedValue(new Error('No locations found'));
        await expect(getLocationsByCity('Not_Any_City')).rejects.toThrow('No locations found');
        spy.mockRestore();
    });
})

describe('Test for the getLocationDetails api call', () => {
    it('should return the detail as an object', async () => {
        const spy = jest.spyOn(axios, 'get').mockResolvedValue({data: {title: 'Tour feifel', desc: 'The big big tour'}});
        const data = await getLocationDetails('1');
        expect(data).toBeInstanceOf(Object);
        spy.mockRestore();
    })
    it('should return an error', async () => {
        const spy = jest.spyOn(axios, 'get').mockRejectedValue(new Error('No location found with this id'));
        await expect(getLocationDetails('1')).rejects.toThrow('No location found with this id');
        spy.mockRestore();
    })
})