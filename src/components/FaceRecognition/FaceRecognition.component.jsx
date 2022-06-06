import React, { useContext } from 'react';
import './FaceRecognition.styles.css'
import { StoreContext } from "../../context/store-context";

const FaceRecognition = ({imageUrl, boxes}) => {
    const { state } = useContext(StoreContext);
    const { currentFaceIndex } = state;
    const boxColor = "0 0 0 3px #149df2 inset"
    const chosenBoxColor = "0 0 0 3px #f23214 inset"

    return (
        <div className='center ma'>
            <div className='relative'>
                <img id='inputimage' key={currentFaceIndex} alt='' src={imageUrl} width='500px' height='auto'></img> 
                {boxes.map((box, boxIndex) => {
                    return (<div className='bounding-box' key={boxIndex} style={{top: box.topRow, 
                                                                                 right: box.rightCol, 
                                                                                 bottom: box.bottomRow, 
                                                                                 left: box.leftCol,
                                                                                 boxShadow: boxIndex === currentFaceIndex ? chosenBoxColor : boxColor}}></div>)
                })}
            </div>
        </div>
    )
}

export default FaceRecognition;