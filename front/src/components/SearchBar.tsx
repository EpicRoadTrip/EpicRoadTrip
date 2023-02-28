import React from 'react';
import Dropdown from 'react-dropdown';
import MultiRangeSlider from 'multi-range-slider-react';
import DatePicker from 'react-datepicker';
import Counter from './Counter';

import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';

const options = [
    { value: 'nantes', label: 'Nantes' },
    { value: 'paris', label: 'Paris'},
    { value: 'nancy', label: 'Nancy'}
];

export default function SearchBar() {
    const [town, setTown] = React.useState<string>('Ville');
    const [budget, setBudget] = React.useState<number[]>([0, 5000]);
    const [date, setDate] = React.useState<Date>(new Date());

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Dropdown options={[{value: 'test1', label: 'test1'}, {value: 'test2', label: 'test2'}]} value='test'/>
            <MultiRangeSlider
                min={0}
                max={5000}
                step={10}
                minValue={budget[0]}
                maxValue={budget[1]}
                onInput={(e) => {console.log(e)}}
            />
            <DatePicker selected={date} onChange={(date: Date) => {setDate(date)}}/>
            <Counter label='Adult'/>
        </div>
    )
}