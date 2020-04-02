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
export function Success() {
    return (
        <div className="inline-loading">
            <div className="loading-icon">
                <div className="loadingtext">
                   <div className="texticon-success"><i className="check circle outline icon"></i></div>
                   <div className="text-overlay">Successfully saved</div>
                </div>
            </div>
        </div>
    );
}
export function Error() {
    return (
        <div className="inline-loading">
            <div className="loading-icon">
                <div className="loadingtext">
                   <div className="texticon-error"><i className="exclamation triangle icon"></i></div>
                   <div className="text-overlay">Not save successfully</div>
                </div>
            </div>
        </div>
    );
}
export function SuccessLogin() {
    return (
        <div className="inline-loading">
            <div className="loading-icon">
                <div className="loadingtext">
                   <div className="texticon-success"><i className="check circle outline icon"></i></div>
                   <div className="text-overlay">Successfully Login</div>
                </div>
            </div>
        </div>
    );
}
