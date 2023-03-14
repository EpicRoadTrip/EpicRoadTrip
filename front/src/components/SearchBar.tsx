import React from 'react';
import Dropdown from 'react-dropdown';
import MultiRangeSlider from 'multi-range-slider-react';
import DatePicker from 'react-datepicker';

import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';


export default function SearchBar() {
    const [budget] = React.useState<number[]>([0, 5000]);
    const [date, setDate] = React.useState<Date>(new Date());

    return (
        <div style={{display: 'flex', flexDirection: 'row'}} data-testid='sb-container'>
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
        </div>
    )
}
