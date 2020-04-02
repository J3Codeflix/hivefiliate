import React from 'react'
export function getresetid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('reset_id');
    return id;
}
export function getid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('id');
    return id;
}
export function affiliateid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('affiliate');
    return id;
}
