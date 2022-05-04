import React, { useState, useContext } from 'react';

import { StoreContext } from '../../context/store-context';
import './ImageUploader.styles.css';

const ImageUploader = ({setImageUrl, increaseEntriesCount, displayResults}) => {
    const {state} = useContext(StoreContext)
    const {mode} = state;

    const [file, setFile] = useState(null)

    const submitFile = () => {
        let pictureUrl = URL.createObjectURL(file)
        setImageUrl(pictureUrl)

        const formData = new FormData();
        formData.append('image', file)

        fetch(`https://face-rec-server-api.herokuapp.com/localimage?model=${mode}`, {
            method: 'post',
            headers: {
                'Authorization': window.sessionStorage.getItem('token'),
            },
            body: formData
        })
        .then(response => response.json())
        .then((response) => {
          if (response.status.code === 10000) {
            increaseEntriesCount()
            displayResults(response)
          }
        })
        .catch(err => console.log(err))
   }

   const handleInputChange = (event) => {
        setFile(event.target.files[0])
   }

    return (
        <div className='local-file-container'>
            <span className = 'f4-l f5'> Or upload image from file: </span>
            <form className='local-form'>
                <label for="file-upload" className="grow f5 link ph3 ml1 pv2 ba dib white bg-light-purple custom-file-upload">
                    Upload file
                </label>
                <input
                    type="file"
                    id="file-upload"
                    accept="image/gif, image/jpeg, image/png, image/jpg" 
                    name="image"
                    onChange={event => handleInputChange(event)}
                />
                {file && <div className='file-detect-container'>
                            <span className='file-name-container'>{file.name.substring(0, 20)}{file.name.length>20 ? '...' : null}</span>
                            <button onClick={() => submitFile()} type='button' className='grow f5 link ph3 ml1 pv2 ba dib white bg-light-purple'>Detect</button>
                         </div>
                }       
            </form>  
        </div>
    )
}

export default ImageUploader;