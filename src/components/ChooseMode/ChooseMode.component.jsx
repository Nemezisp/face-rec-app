import React from 'react'
import './ChooseMode.styles.css'

const ChooseMode = ({onModeChange, toggleModal}) => {

    const handleModeChange = (mode) => {
        onModeChange(mode)
        toggleModal()
    }

    return (
        <div className='choose-mode-modal'>
            <div className='choose-mode-container'>
                <h2>Choose a mode:</h2>
                <div className='choose-mode-buttons-container'>
                    <button onClick={() => handleModeChange('face')} className='choose-mode-button grow'>Face Detection</button>
                    <button onClick={() => handleModeChange('celebrity')} className='choose-mode-button grow'>Celebrity Detection</button>
                    <button onClick={() => handleModeChange('demographics')} className='choose-mode-button grow'>Demographics</button>
                    <button onClick={() => handleModeChange('general')} className='choose-mode-button grow'>General Context</button>
                    <button onClick={() => handleModeChange('color')} className='choose-mode-button grow'>Dominant Colors</button>
                    <button onClick={() => handleModeChange('food')} className='choose-mode-button grow'>Food Detection</button>
                </div>
                <div className="choose-mode-close" onClick={toggleModal}>&times;</div>
            </div>
        </div>
    )
}

export default ChooseMode;