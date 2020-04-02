import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {windowReload,returnUrl} from '../../include/merchant_redirect'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import Shopify from '../../../assets/image/shopify.png'
import '../../../assets/css/merchant.css'

export default function Register(props) {

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
		store_name:'',
		email:'',
		password:'',
		confirmpassword:'',
		checkagree:false
	});


	const [isoff, setisoff] = useState('off');
	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){

		//console.log(values);return false;

		setspinner(true);CloseAlert(false);

		let formData = new FormData();
		formData.append('type','merchant_regisration');
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

	useEffect(()=>{
		isMerchantLogin();
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
								<Button as="a" href={process.env.PUBLIC_URL+'/signup'} className='blue'>Register</Button>
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
						<div className="column information">
							<div className="inside-padding">
								<h2>Start your 14-day free trial</h2>
								<p>Best for businesses new or just getting started with affiliate marketing and have a stable amount of affiliates & sales.</p>
								<ul>
									<li><Icon name='check circle'/>Unlimited affiliates.</li>
									<li><Icon name='check circle'/>Unlimited visits and clicks.</li>
									<li><Icon name='check circle'/>Dedicated, onsite support staff.</li>
									<li><Icon name='check circle'/>Free Test Account for Shopify Partners</li>
									<li><Icon name='check circle'/>Set commission by product or SKU</li>
									<li><Icon name='check circle'/>Track sales with coupon codes, emails, and SKUs</li>
									<li><Icon name='check circle'/>Custom reporting</li>
									<li><Icon name='check circle'/>Integration assistance</li>
								</ul>
							</div>
						</div>
						<div className="column register-input">
							<div className="inside-padding">
								<h2>Register Form</h2>
								<Formik
									initialValues={state}
									validationSchema={getvalidations}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
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
											</Form.Group>
											<Form.Group widths='equal'>
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
												<Field name="confirmpassword">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Confirm Password</label>
														<Input
															type={seen2==true?'text':'password'}
															fluid {...field}
															onChange={handleChange}
															icon={<Icon name={seen2==true?'eye':'eye slash'} link onClick={()=>PasswordView2()}/>}
															autoComplete={isoff}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>Confirm password does not match</Label> }
													</Form.Field>
													)}
												</Field>
											</Form.Group>
											<Field name="checkagree">
												{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
													<Checkbox className="labelagree" id="checkagree" label='I agree to the Hivefiliate Terms and Conditions' defaultChecked={state.checkagree} onChange={(e)=>setFieldValue('checkagree',e.target.checked)}/>
												</Form.Field>
												)}
											</Field>
											<Button className='blue' loading={spinner} size='big' icon onClick={handleSubmit}>Start free trial <Icon name='arrow alternate circle right outline' /></Button>
										</Form>

								)}}/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="integrates-wrapper">
				<div className="register-grid">
					<span>Integrates with Your Favorite Platform:</span>
					<img src={Shopify}/>
				</div>
			</div>
		</div>
	)
}
