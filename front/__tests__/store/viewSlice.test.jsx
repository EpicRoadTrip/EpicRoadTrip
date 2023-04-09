import reducer, { change } from '../../src/store/slices/viewSlice';

describe('View Slice test', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {type: undefined})).toEqual({"value": true});
    });
    it('should handle change', () => {
        expect(reducer(undefined, change())).toEqual({"value": false});
    });
})