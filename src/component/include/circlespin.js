import React, { Component } from 'react'
import { BarLoader } from 'react-spinners'

export function Spinning() {
    return (
        <div className="inline-loading">
            <div className='sweet-loading'>
                <BarLoader
                width={'100%'}
                color={'#2185d0'}
                height={2} 
                />
            </div>
            <div className="loading-icon">
                <svg className="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                   <circle className="path" fill="none" strokeWidth="3" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </div> 
    );
}

export function SpinningAbove() {
    return (
        <div className="inline-loadingabove">
            <div className='sweet-loading'>
                <BarLoader
                width={'100%'}
                color={'#2185d0'}
                height={2} 
                />
            </div>
            <div className="loading-icon">
                <svg className="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                   <circle className="path" fill="none" strokeWidth="3" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </div> 
    );
}


