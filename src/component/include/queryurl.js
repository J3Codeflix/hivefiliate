import React from 'react'
export function getappstatus(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('app_status');
    return id;
}
export function getaffmerchantid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('merchant');
    return id;
}
export function urlmode(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('mode');
    return id;
}
export function storemode(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('store');
    return id;
}
export function getresetid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('reset_id');
    return id;
}
export function affiliateid(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('affiliate');
    return id;
}
export function id(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('id');
    return id;
}
export function month(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('month');
    return id;
}
export function year(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('year');
    return id;
}

// For shopify

export function shopify_code(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('code');
    return id;
}
export function shopify_hmac(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('hmac');
    return id;
}
export function shopify_shop(props) {
    const location = window.location.search;
    const searchParams = new URLSearchParams(location);
    const id  = searchParams.get('shop');
    return id;
}
