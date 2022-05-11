import React, { useState, useContext } from 'react';
import Resizer from "react-image-file-resizer";

import { StoreContext } from '../../context/store-context';
import './ImageUploader.styles.css';

const ImageUploader = ({setImageUrl, increaseEntriesCount, displayResults}) => {
    const {state} = useContext(StoreContext)
    const {mode} = state;

    const [file, setFile] = useState(null)

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                512,
                10000,
                "JPEG",
                80,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        }
    );

    const submitFile = () => {
        let pictureUrl = URL.createObjectURL(file)
        setImageUrl(pictureUrl)

        const formData = new FormData();
        formData.append('image', file)

        let url = process.env.NODE_ENV === 'production' ? 'https://face-rec-server-api.herokuapp.com' : 'http://localhost:3000'

        fetch(`${url}/localimage?model=${mode}`, {
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
            } else {
                alert('Unable to work with API')
            }
        })
        .catch(err => {
            alert('Error connecting to server')
            console.log(err)
        })
   }

   const handleInputChange = async (event) => {
        const file = event.target.files[0]

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            alert('Wrong file type! Use jpeg or png.')
            return
        }
        
        const resizedFile = await resizeFile(file)
        setFile(resizedFile)
   }

    return (
        <div className='local-file-container'>
            <span className = 'f4-l f5'> Or upload image from file (png or jpeg): </span>
            <form className='local-form'>
                <label htmlFor="file-upload" className="grow f5 link ph3 ml1 pv2 ba dib white bg-light-purple custom-file-upload">
                    Upload image
                </label>
                <input
                    type="file"
                    id="file-upload"
                    accept="image/jpeg, image/png" 
                    name="image"
                    onChange={event => handleInputChange(event)}
                />
                {file && <div className='file-detect-container'>
                            <span className='file-name-container'>{file.name.length>20 ? file.name.substring(0, 20) + '...' : file.name}</span>
                            <button onClick={() => submitFile()} type='button' className='grow f5 link ph3 ml1 pv2 ba dib white bg-light-purple'>Detect</button>
                         </div>
                }       
            </form>  
        </div>
    )
}

export default ImageUploader;