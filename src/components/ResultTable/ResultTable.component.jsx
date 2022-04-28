import React, { Fragment, useContext, useEffect, useState } from "react";
import './ResultTable.styles.css';
import { StoreContext } from "../../context/store-context";

const ResultTable = ({results}) => {
    let { state } = useContext(StoreContext)
    let { mode } = state

    console.log(results[0])

    const [wikiUrls, setWikiUrls] = useState([[]])
    const [resultPage, setResultPage] = useState(0)

    useEffect(() => {
        if (mode === 'celebrity' && results.length > 0) {
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

    return (
        results.length > 0 ?
            <div className="glass results-container">
                {
                    (mode === 'celebrity' && results[0].length > 1) &&
                    <Fragment>
                        <h4>Celebrity no.{resultPage+1} on the picture:</h4>
                        {results[resultPage].map((result, index) => {
                            return (
                                <div>
                                    <div key={index} className="result">
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
                            {resultPage > 0 && <button onClick={() => setResultPage(resultPage-1)} className="results-navigation-button previous grow">Previous</button>}
                            {resultPage < results.length-1 && <button onClick={() => setResultPage(resultPage+1)} className="results-navigation-button next grow">Next</button>}
                        </div>
                    </Fragment>
                }

                {
                    ((mode === 'general' || mode === 'food') && !results[0].length) && 
                    <Fragment>
                        <h4>On the picture:</h4>
                        {results.map((result, index) => {
                            return (
                                <div>
                                    <div key={index} className="result">
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
                                <div className="color-results-container">
                                    <div key={index} className="result">
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
                    (mode === 'demographics' && results[0].length > 1) && 
                    <Fragment>
                        <h4>Person no.{resultPage+1} on the picture is:</h4>
                        {results[resultPage].map((result, index) => {
                            return (
                                <div>
                                    <div key={index} className="result">
                                        <div className="result-name">
                                            {result.name}
                                        </div>
                                        <div className="result-percent">{result.percent.toFixed(2)}%</div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="results-navigation" >
                            {resultPage > 0 && <button onClick={() => setResultPage(resultPage-1)} className="results-navigation-button previous grow">Previous</button>}
                            {resultPage < results.length-1 && <button onClick={() => setResultPage(resultPage+1)} className="results-navigation-button next grow">Next</button>}
                        </div>
                    </Fragment>
                }
            </div>
            :
            null
    )
}


export default ResultTable