import React, { Fragment, useContext, useEffect, useState } from "react";
import './ResultTable.styles.css';
import { StoreContext, ACTION_TYPES } from "../../context/store-context";

const ResultTable = ({results}) => {
    const { dispatch, state } = useContext(StoreContext)
    const { mode } = state

    const [wikiUrls, setWikiUrls] = useState([[]])
    const [resultPage, setResultPage] = useState(0)

    useEffect(() => {
        if (mode === 'celebrity' && results.length > 0 && results[0].length) {
            setResultPage(0)
            let tempUrls = []
            for (let celebrityOnPicture of results) { //there may be few celebtiries on the picture
                let celebrityOnPictureUrls = []
                for (let singlePerson of celebrityOnPicture) { //each celebrity has 5 possible results
                    let names = singlePerson.name.split(' ')
                    let capitalizedNames = []
                    for (let string of names) {
                        string = string[0].toUpperCase() + string.substring(1)
                        capitalizedNames.push(string)
                    }
                    celebrityOnPictureUrls.push('https://en.wikipedia.org/wiki/' + capitalizedNames.join('_'))
                }
                tempUrls.push(celebrityOnPictureUrls)
            }
            setWikiUrls(tempUrls)
        }
    }, [mode, results])

    const handleChangeResultPage = (index) => {
        setResultPage(index)
        dispatch({
            type: ACTION_TYPES.SET_CURRENT_FACE,
            payload: index
        })
    }

    return (
        results.length > 0 ?
            <div id="results-table" className="glass results-container">
                {
                    (mode === 'celebrity' && results[0].length) &&
                    <Fragment>
                        <h4>Celebrity no.{resultPage+1} on the picture:</h4>
                        {results[resultPage].map((result, index) => {
                            return (
                                <div key={index}>
                                    <div className="result">
                                        <div className="result-name">
                                            {result.name}
                                            {<a className='wiki-link' target="_blank" rel="noopener noreferrer" href={wikiUrls[resultPage] && wikiUrls[resultPage][index]}>Wiki</a>}
                                        </div>
                                        <div className="result-percent">{`${result.percent.toFixed(2)}`}%</div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="results-navigation" >
                            {resultPage > 0 && <button onClick={() => handleChangeResultPage(resultPage-1)} className="green-button previous grow">Previous</button>}
                            {resultPage < results.length-1 && <button onClick={() => handleChangeResultPage(resultPage+1)} className="green-button next grow">Next</button>}
                        </div>
                    </Fragment>
                }

                {
                    ((mode === 'general' || mode === 'food') && !results[0].length) && 
                    <Fragment>
                        <h4>On the picture:</h4>
                        {results.map((result, index) => {
                            return (
                                <div key={index}>
                                    <div className="result">
                                        <div className="result-name">
                                            {result.name}
                                        </div>
                                        <div className="result-percent">{result.percent.toFixed(2)}%</div>
                                    </div>
                                </div>
                            )
                        })}
                    </Fragment>
                }

                {
                    (mode === 'color' && !results[0].length) && 
                    <Fragment>
                        <h4>Dominant colors:</h4>
                        {results.map((result, index) => {
                            return (
                                <div key={index} className="color-results-container">
                                    <div className="result">
                                        <div className="result-name">
                                            {result.name}
                                        </div>
                                        <div className="result-percent">{result.percent.toFixed(2)}%</div>
                                    </div>
                                    <div className="color-preview" style={{backgroundColor: result.name}}></div>
                                </div>
                            )
                        })}
                    </Fragment>
                }

                {
                    (mode === 'demographics' && results[0].length) && 
                    <Fragment>
                        <h4>Person no.{resultPage+1} on the picture is:</h4>
                        {results[resultPage].map((result, index) => {
                            return (
                                <div key={index}>
                                    <div className="result">
                                        <div className="result-name">
                                            {result.name}
                                        </div>
                                        <div className="result-percent">{result.percent.toFixed(2)}%</div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="results-navigation" >
                            {resultPage > 0 && <button onClick={() => handleChangeResultPage(resultPage-1)} className="green-button previous grow">Previous</button>}
                            {resultPage < results.length-1 && <button onClick={() => handleChangeResultPage(resultPage+1)} className="green-button next grow">Next</button>}
                        </div>
                    </Fragment>
                }
            </div>
            :
            null
    )
}

export default ResultTable