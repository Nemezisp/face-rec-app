import React from 'react'
import './Rank.styles.css'

const Rank = ({userName, userEntries}) => {
    return (
        <div className='rank-container'> 
            <div className='f3'>
                {`${userName}, your current entry count is...`}
            </div>
            <div className='f1'>
                {userEntries}
            </div>
        </div>
    )
}

export default Rank;