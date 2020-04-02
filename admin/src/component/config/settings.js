import React from 'react'
let url = process.env.PUBLIC_URL;

export function windowReload(props){
   return window.location.reload();
}
export function windowLocation(props) {
	return window.location.href = url+props;
}
export function LinkURL(props) {
	return url+props;
}
