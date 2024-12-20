import React, { useState } from 'react';

function HomepageQuestion3({onChange}) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div className='home-page-question'>
            <h2>What's your goal right now?</h2>
            <p>Write in one sentence</p>
            <input 
                type='text' 
                placeholder="To land my first full-time role as a software engineer" 
                onChange={handleChange}
            />
        </div>
    );
}

export default HomepageQuestion3;