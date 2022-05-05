import React, { useContext, useEffect, useState } from 'react'
import FaceRecognition from '../FaceRecognition/FaceRecognition.component';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm.component';
import Rank from '../Rank/Rank.component';
import ResultTable from '../ResultTable/ResultTable.component';
import './ModeContainer.styles.css'
import { ACTION_TYPES, StoreContext } from "../../context/store-context";

const ModeContainer = () => {
    const {dispatch, state} = useContext(StoreContext);
    const { user, mode } = state;

    const [input, setInput] = useState('') 
    const [imageUrl, setImageUrl] = useState('')
    const [boxes, setBoxes] = useState([])
    const [results, setResults] = useState([])

    useEffect(() => {
        setResults([])
        setImageUrl('')
        setBoxes([])
    }, [mode])

    const displayFaceBox = (boxes) => {
        if (boxes) {
          setBoxes(boxes)
        }
    }

    const createResultsArray = (results) => {
        let resultsArray = []
        let singleContext;
        for (let i = 0; i < results.length; i++) {
            if (mode === 'color') {
                singleContext = {
                    name: results[i].raw_hex,
                    percent: results[i].value * 100
                }
            } else {
                singleContext = {
                    name: results[i].name,
                    percent: results[i].value * 100
                }
            }
            resultsArray.push(singleContext)
        }
        setResults(resultsArray)
        return resultsArray
    } 

    const getResults = (data) => {     
        let results;
        if (mode === 'celebrity') { //there can be few celebrities on the picture
            let regions = data.outputs[0].data.regions
            let resultsArray = []
            for (let region of regions) {
                let singleResultArray = createResultsArray(region.data.concepts)
                resultsArray.push(singleResultArray)
            }
            setResults(resultsArray)
            return
        } else if (mode === 'general' || mode === 'food') {
            results = data.outputs[0].data.concepts
        } else if (mode === 'color') {
            results = data.outputs[0].data.colors
        } 
        let resultsArray = createResultsArray(results)
        setResults(resultsArray)
        return
    }

    const getDemographicResults = (data) => {
        let regions = data.outputs[2].data.regions
        let resultsArray = []
        for (let i=0; i<regions.length; i++) {
            const ethnicity = data.outputs[2].data.regions[i].data.concepts[0]
            const gender = data.outputs[3].data.regions[i].data.concepts[0]
            const age = data.outputs[4].data.regions[i].data.concepts[0]

            let tempResults = []
            tempResults.push({name: ethnicity.name, percent: ethnicity.value*100})
            tempResults.push({name: gender.name, percent: gender.value*100})
            tempResults.push({name: age.name, percent: age.value*100})

            resultsArray.push(tempResults)
        }

        setResults(resultsArray)
    }

    const calculateFaceLocation = (data) => {
        if (data && data.outputs) {

          let regions;
          if (mode === 'demographics') {
            regions = data.outputs[2].data.regions
          } else {
            regions = data.outputs[0].data.regions
          }

          const image = document.getElementById('inputimage');
          const width = Number(image.width);
          const height = Number(image.height);
          let boxes = []

      
          for (let i = 0; i < regions.length; i++) {
            const clarifaiFace = regions[i].region_info.bounding_box;
            boxes.push({
              leftCol: clarifaiFace.left_col * width,
              topRow: clarifaiFace.top_row * height,
              rightCol: width - (clarifaiFace.right_col * width),
              bottomRow: height - (clarifaiFace.bottom_row * height),
            })
          }
          return boxes
        }
        return
    }

    const increaseEntriesCount = () => {
      fetch('linki: https://face-rec-server-api.herokuapp.com/image', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: user.id,
        })
      })
      .then(response => response.json())
      .then(count => {
          dispatch({
              type: ACTION_TYPES.SET_USER,
              payload: Object.assign(user, {entries: count})
          })
      })
      .catch(console.log)
    }

    const displayResults = (response) => {
      if (mode === 'demographics') {
        displayFaceBox(calculateFaceLocation(response.results[0]))
        getDemographicResults(response.results[0])
      }

      if (mode === 'face' || mode === 'celebrity') {
        displayFaceBox(calculateFaceLocation(response))
      }

      if (mode !== 'face' && mode !== "demographics") {
        getResults(response)
      }

      let resultsTable = document.getElementById('results-table')
      let image = document.getElementById('inputimage')
      resultsTable ? resultsTable.scrollIntoView() : image.scrollIntoView()
    }

    const onInputChange = (event) => {
        setInput(event.target.value)
    }

    const onSubmit = () => {
        input && setImageUrl(input)
        fetch('https://face-rec-server-api.herokuapp.com/imageurl', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': window.sessionStorage.getItem('token')
          },
          body: JSON.stringify({
              input: input,
              mode: mode
          })
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

    return (
        <div className='rank-container'> 
          <Rank userEntries={user.entries} userName={user.name}/>
          <ImageLinkForm onSubmit={onSubmit} 
                         onInputChange={onInputChange} 
                         setImageUrl={setImageUrl}
                         increaseEntriesCount={increaseEntriesCount}
                         displayResults={displayResults}/>
          <div className='image-with-results-container'>
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
              {mode !== 'face' &&  <ResultTable results={results}/>}
          </div>
        </div>

    )
}

export default ModeContainer;