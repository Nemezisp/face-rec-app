import React from 'react'
import './ImageLinkForm.styles.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/store-context'

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    const {state} = useContext(StoreContext);
    const {mode} = state;

    return (
        <div> 
            <p className='f3-l f4'>
                {mode === 'face' && 'This mode will detect faces in your pictures. Give it a try!'}
                {mode === 'celebrity' && 'This mode will detect celebrities in your pictures. Give it a try!'}
                {mode === 'general' && 'This mode will detect general context in your pictures. Give it a try!'}
                {mode === 'color' && 'This mode will detect dominant colors in your pictures. Give it a try!'}
                {mode === 'food' && 'This mode will detect food in your pictures. Give it a try!'}
                {mode === 'demographics' && 'This mode will detect demographics of people in the picture. Give it a try!'}
            </p>
            <div className='center'>
                <div className=' form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
                    <button className='w-30 grow f5 link ph3 ml1 pv2 ba dib white bg-light-purple' onClick={onSubmit}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;