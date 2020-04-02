<?php
function serveremail(){
	return 'mail@hivefiliate.com';
}
function appemail(){
	return 'admin@hivefiliate.com';
}
function receivingemail($email){
	return $email;
}
function pathlogo(){
	return '/home/hiveelia/public_html/api/hive/config/email/logo.jpg';
}
function contactnumber(){
	return '415-941-5199 | contact@hivefiliate.com';
}
function contactaddress(){
	return '201 King St London, Ontario N6A 1C9 Canada';
}
function linkloginaffiliate($param){
	return baseurl('/affiliates/login/?merchant='.$param);
}
function loginmerchant($param){
	return baseurl('/login');
}

function websiteurl(){
	return 'https://hivefiliate.com';
}
