import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox, Message } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {returnUrl} from '../../include/merchant_redirect'
import {urlmode,storemode} from '../../include/queryurl'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import '../../../assets/css/merchant.css'

export default function Login(props) {

	/*------- alert message and spinner--------- */

	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

	const [confirmstaff, setconfirmstaff] = useState(false);


	/*-------- Form Data --------------------- */

	const [state, setstate] = useState({
		email:'',
		password:'',
		remember:false
	});

	const [isoff, setisoff] = useState('off');
	function handleSubmitForm(values, { setSubmitting, resetForm, setErrors }){
		  let staff=0;
		  if(confirmstaff==true){
				  staff=storemode();
			}
			setspinner(true);CloseAlert(false);
			let formData = new FormData();
			formData.append('type','merchant_login');
			formData.append('info',JSON.stringify(values));
			formData.append('mode',staff);
			axios.post('/merchant/login/request.php',formData)
			.then(function (response) {
      console.log("handleSubmitForm -> response", response)
				let obj = response.data;
				if(obj==1){
					resetForm();setsuccess(true);
					setTimeout(
						function() {
							returnUrl('dashboard')},1000
							);
					return false;
				}
				setspinner(false);
				if(obj==0){resetForm();seterror(true);return false;}
				Object.keys(obj).forEach(function(key) {setErrors(obj)});
			})
		  .catch(function (error) {resetForm();seterror(true);setspinner(false); return false;});
	}

	function handleSubmitForm2(values, { setSubmitting, resetForm, setErrors }){
		setTimeout(
			function() {
				returnUrl('dashboard')},1000
				);
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

	/* Check if staff mode */
	const [istaff, setistaff] = useState(false);
	const [store, setstore] = useState('');
	function StaffModeMerchant(){
		let formData = new FormData();
		formData.append('type','merchant_querymodestaff');
		formData.append('store',storemode());
		formData.append('urlmode',urlmode());
		axios.post('/merchant/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      console.log("StaffModeMerchant -> obj", obj)
			if(obj==0){returnUrl('login');return false;}
			if(obj.is_login==1){returnUrl('dashboard');return false;}
			setstore(obj.store_name);
			setistaff(true);
			setconfirmstaff(true);
		})
		.catch(function (error) {setiswait(false);return false;});
	}

	function StaffMode(){
		  if(storemode()==''||storemode()==null||urlmode()==''||urlmode()==null){
				isMerchantLogin();
				return false;
			}
			StaffModeMerchant();
	}

	useEffect(()=>{
		StaffMode();
	},[]);


	return (
		<div className="login-wrapper">

			{iswait&&Spinning()}
			<div className="topheading">
				<div className="login-grid-top">
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

			<div className="login-form">
				<div className="login-grid">


					  {istaff&&<Message
							positive
							icon='user outline'
							header={store}
							content={'Welcome to '+store+' merchant store'}
					  />}

						{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Successfully login'/>}
						{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Invalid email or password'/>}

						<div className="login-input">
							<div className="inside-padding">
								<h2>{istaff==true?'Staff':'Merchant'} Login</h2>
								<h3 className="text-blur">Login to your account</h3>
								<Formik
									initialValues={state}
									validationSchema={getvalidations}
									onSubmit={handleSubmitForm2}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
												<Field name="email">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Email</label>
														<Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
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
											</Form.Group>
											<Field name="remember">
												{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
													<Checkbox className="labelagree" id="checkagree" label='Remember me'  defaultChecked={state.checkagree} onChange={(e)=>setFieldValue('checkagree',e.target.checked)}/>
												</Form.Field>
												)}
											</Field>
											<Button fluid className='blue' size='big' icon  loading={spinner} onClick={handleSubmit}><Icon name='lock' /> Continue to login</Button>
											{confirmstaff==false&&<div className="linkinput"><a href={process.env.PUBLIC_URL+'/reset'}>Forgot your password</a></div>}
											{confirmstaff&&<div className="linkinput"><a href={process.env.PUBLIC_URL+'/staffreset/?mode=staff&store='+storemode()}>Forgot your password</a></div>}
										</Form>

									)}}/>
								</div>
							</div>


							<p className="copyright onform"><a href={process.env.PUBLIC_URL+'/'}>Hivefiliate All</a> © Copyright by . All Rights Reserved.</p>


						</div>
					</div>
		</div>
	)
}
