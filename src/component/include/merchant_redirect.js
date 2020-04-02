import React from 'react'
let publicurl           =  process.env.PUBLIC_URL;

let domainurl           = 'http://localhost:3000';
let localurl            = 'http://localhost:3000';

let shopifyurl 			    = domainurl+'/api/app/shopify/shopify_install.php?shop='
let trackscript 		    = domainurl+'/api/app/script/hivefiliate.js';

let url                 = domainurl+'/'
let settingurl 		      = domainurl+'/affiliates/'

export function windowReload(props){
  return window.location.reload();
}
export function returnUrl(props) {
	return window.location.href = url+props;
}
export function Public_URL(props) {
	return window.location.href = publicurl+props;
}
export function shopifyinstallurl(props) {
	return window.location.href = shopifyurl+props;
}
export function RootLink(props) {
	return url+props;
}
export function ProgramAffLink(props) {
	return settingurl+props;
}
export function TrackingScriptURI() {
	return '<script type="text/javascript" src="'+trackscript+'"></script>';
}
export function StartTrackingURI() {
	return '<script type="text/javascript">startTracking();</script>';
}
export function MarkPurchaseURI() {
	return '<script type="text/javascript">markPurchase(id,price);</script>';
}

export function scrollToTop() {
	return document.querySelector('body').scrollTop = 0;
}
