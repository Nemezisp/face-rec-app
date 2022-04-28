import React from 'react'
import './FaceRecognition.styles.css'

const FaceRecognition = ({imageUrl, boxes}) => {
    return (
        <div className='center ma'>
            <div className='relative'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'></img> 
                {boxes.map((box, boxIndex) => {
                    return (<div className='bounding-box' key={boxIndex} style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>)
                })}
            </div>
        </div>
    )
}

export default FaceRecognition;