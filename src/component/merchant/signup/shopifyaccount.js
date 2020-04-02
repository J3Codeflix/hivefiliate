import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {shopifyregister} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {windowReload,returnUrl,shopifyinstallurl} from '../../include/merchant_redirect'
import {shopify_code,shopify_hmac,shopify_shop} from '../../include/queryurl'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import Shopify from '../../../assets/image/apps/shopify-logo.png'
import '../../../assets/css/merchant.css'

export default function ShopifyAccount(props) {

	/*------- alert message and spinner--------- */

	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}


	/*-------- Form Data--------------------- */
	const [state, setstate] = useState({
		code:shopify_code(),
		hmac:shopify_hmac(),
		shop:shopify_shop(),
		shopify_token:'',
		website_url:'',
		store_name:'',
		email:'',
		password:'',
		checkagree:false
	});


	const [isoff, setisoff] = useState('off');
	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){


		setspinner(true);CloseAlert(false);

		let formData = new FormData();
		formData.append('type','merchant_regisration_shopify');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/register/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				resetForm();setsuccess(true);
				setTimeout(function() {returnUrl('dashboard')},1000);
				return false;
			}
			setspinner(false);
			if(obj==0){resetForm();seterror(true);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});
	}


	/*--------- Password seen and unseen------------ */

	const [seen,setseen] = useState(false);
	const [seen2,setseen2] = useState(false);
    function PasswordView(){
    	if(seen==true){
    		setseen(false);
    	}else{
    		setseen(true);
    	}
	}
	function PasswordView2(){
    	if(seen2==true){
    		setseen2(false);
    	}else{
    		setseen2(true);
    	}
	}

	/* Check Login Merchant */
	const [iswait,setiswait] = useState(false);
	function isMerchantLogin(){
		setiswait(true);
		let formData = new FormData();
		formData.append('type','merchant_islogin');
		axios.post('/merchant/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setiswait(false);
			if(obj!=0){returnUrl('dashboard');}
		})
		.catch(function (error) {setiswait(false);return false;});
	}

	/* Get Account Setup */
	function AccountSetup(){

		const givenvalue = {
			code:shopify_code(),
			hmac:shopify_hmac(),
			shop:shopify_shop(),
		}

		let formData = new FormData();
		formData.append('type','shopify_setup');
		formData.append('info',JSON.stringify(givenvalue));
		axios.post('/merchant/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){returnUrl('signup/shopify');return false;}
		})
		.catch(function (error) {return false;});
	}


  const [isvefied, setisvefied] = useState(true);
	function ShopifyVerification(){

		const givenvalue = {
			code:shopify_code(),
			hmac:shopify_hmac(),
			shop:shopify_shop(),
		}

		let formData = new FormData();
		formData.append('type','shopify_verification');
		formData.append('info',JSON.stringify(givenvalue));
		axios.post('/merchant/register/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){
				shopifyinstallurl(shopify_shop());
				return false;
			}
			setisvefied(false);
		})
		.catch(function (error) {return false;});
	}

	useEffect(()=>{
		isMerchantLogin();
		AccountSetup();
		ShopifyVerification();
	},[]);


	return (
		<div className="register-wrapper">
			{iswait&&Spinning()}
			<div className="topheading">
				<div className="register-grid">
					<div className="columns is-mobile is-vcentered">
						<div className="column"><a href={process.env.PUBLIC_URL+'/'}><img src={Logo}/><span>Hivefiliate</span></a></div>
						<div className="column is-clearfix">
							<div className="position-right">
								<Button as="a" href={process.env.PUBLIC_URL+'/singup'} className='blue'>Register</Button>
								<Button as="a" href={process.env.PUBLIC_URL+'/login'} className='green' icon><Icon name='lock' /> Login</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="register-form">


				<div className="register-grid">

					{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Account successfully registered'/>}
					{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Account not successfully registered'/>}

					<div className="columns registration">
						<div className="column register-input">
							<div className="inside-padding">
							  <img src={Shopify}/>
								<h2>Registered Your Hivefiliate Account</h2>
								<Formik
								  enableReinitialize
									initialValues={state}
									validationSchema={shopifyregister}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
												<Field name="shop">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Your Shopify Website</label>
														<Input readOnly fluid {...field} onChange={handleChange} autoComplete={isoff}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
												<Field name="store_name">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Store Name</label>
														<Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
											</Form.Group>
											<Form.Group widths='equal'>
												<Field name="email">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Email</label>
														<Input fluid {...field} onChange={handleChange}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
												<Field name="password">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Password</label>
														<Input
															type={seen==true?'text':'password'}
															fluid {...field}
															onChange={handleChange}
															icon={<Icon name={seen==true?'eye':'eye slash'} link onClick={()=>PasswordView()}/>}
															autoComplete={isoff}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
											</Form.Group>
											<Field name="checkagree">
												{({ field, form }) => (
													<Form.Field
														id="checkagree"
														className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error labelagree' : "labelagree";})()}
														control={Checkbox}
														label={<label className="termslabel">I agree to the Hivefiliate <a target="_blank" href={process.env.PUBLIC_URL+'/terms'}>Terms and Conditions</a></label>}
														defaultChecked={state.checkagree}
														onChange={(e)=>setFieldValue('checkagree',e.target.checked)}/>
												)}
											</Field>
											<Button className='blue' disabled={isvefied} loading={spinner} size='big' icon onClick={handleSubmit}>Start free trial <Icon name='arrow alternate circle right outline' /></Button>
										</Form>

								)}}/>
							</div>
						</div>
					</div>
					<p className="copyright onform"><a href={process.env.PUBLIC_URL+'/'}>Hivefiliate All</a> © Copyright by . All Rights Reserved.</p>
				</div>
			</div>
		</div>
	)
}
