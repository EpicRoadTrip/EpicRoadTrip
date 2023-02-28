import React from 'react';

export default function Counter({label}: any) {
    const [count, setCount] = React.useState<number>(0);
    
    return (
        <div className='c-container'>
            <p data-testid='c-label'>{label}</p>
            <div className='c-counter'>
                <button data-testid='c-plus' onClick={()=>{if (count < 10) {setCount(count => count + 1)}}}>+</button>
                <p data-testid='c-count'>{count}</p>
                <button data-testid='c-minus' onClick={()=>{if (count > 0) {setCount(count => count - 1)}}}>-</button>
            </div>
        </div>
    )
}