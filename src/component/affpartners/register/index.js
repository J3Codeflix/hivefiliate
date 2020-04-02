import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox, Message } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {windowReload,returnUrl} from '../../include/merchant_redirect'
import {getaffmerchantid} from '../../include/queryurl'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import '../../../assets/css/merchant.css'

export default function AffRegister(props) {

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
		id_merchant:getaffmerchantid(),
		first_name:'',
		last_name:'',
		email:'',
		password:'',
		confirmpassword:'',
		checkagree:false
	});


	const [isoff, setisoff] = useState('off');
	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){

		setspinner(true);CloseAlert(false);

		let formData = new FormData();
		formData.append('type','affiliate_register');
		formData.append('info',JSON.stringify(values));
		axios.post('/affiliates/register/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				resetForm();setsuccess(true);
				setTimeout(function() {returnUrl('affiliates/login?merchant='+getaffmerchantid())},2000);
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

	/* Check if valid merchant */
	const [isvalid, setisvalid] = useState(false);
	function ifmerchantexistid(id){
		if(id==null||id==''){
			setisvalid(false);
			return false;
		}
		checkifmerchantisvalid();
	}
	function checkifmerchantisvalid(){

		setiswait(true);
		let formData = new FormData();
		formData.append('type','affiliate_isvalidmerchant');
		formData.append('id',getaffmerchantid());
		axios.post('/affiliates/register/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setiswait(false);
			if(obj=='1'){setisvalid(true);return false;}
			if(obj=='invalid_merchant'){setisvalid(false);return false;}
		})
		.catch(function (error) {setiswait(false);return false;});
	}


	const [dataconfig, setdataconfig] = useState({
		cookie_days:'',
		com_type:'',
		base_com:'',
	});

	function CommissionConfiguration(){
		setiswait(true);
		let formData = new FormData();
		formData.append('type','setfrontdata');
		formData.append('id',getaffmerchantid());
		axios.post('/affiliates/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setdataconfig({
				...dataconfig,
				cookie_days:obj.cookie_days,
				com_type:obj.com_type,
				base_com:obj.base_com,
			});
			setiswait(false);
			return false;
		})
		.catch(function (error) {setiswait(false);return false;});
	}

	useEffect(()=>{
		//isMerchantLogin();
		ifmerchantexistid(getaffmerchantid());
		CommissionConfiguration();
	},[]);


	return (
		<div className="register-wrapper">
			{iswait&&Spinning()}
			<div className="topheading">
				<div className="register-grid">
					<div className="columns is-mobile is-vcentered">
						<div className="column"><a href={process.env.PUBLIC_URL+'/'}><img src={Logo}/><span>Hivefiliate</span></a></div>
						{isvalid&&<div className="column is-clearfix">
							<div className="position-right">
								<Button as="a" href={process.env.PUBLIC_URL+'/affiliates/register?merchant='+getaffmerchantid()} className='blue'>Register</Button>
								<Button as="a" href={process.env.PUBLIC_URL+'/affiliates/login?merchant='+getaffmerchantid()} className='green' icon><Icon name='lock' /> Login</Button>
							</div>
						</div>}
					</div>
				</div>
			</div>
			<div className="register-form">
				<div className="register-grid">

					{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Account successfully registered'/>}
					{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Account not successfully registered'/>}

					{!isvalid&&<div className="merchant-notfound">
						<Message
						    negative
							icon='question circle outline'
							header='Error! 404'
							content='The page your were looking for cannot be found!'
						/>
						<div className="text-center">
							<Button as="a" href={process.env.PUBLIC_URL+'/'} content='Go to homepage' className="blue" icon='left arrow' labelPosition='left' />
						</div>
					</div>}

					{isvalid&&<div className="columns registration">
						<div className="column information">
							<div className="inside-padding">
								<h2>Commission & Business Details</h2>
								<ul className="affregistration">
									<li>
										<div className="columns is-mobile">
											<div className="column is-1"><Icon name='check circle'/></div>
											<div className="column">
												<h2>Conversion action</h2>
												<p>Online purchase with processed valid payment</p>
											</div>
										</div>
									</li>
									<li>
										<div className="columns is-mobile">
											<div className="column is-1"><Icon name='check circle'/></div>
											<div className="column">
												<h2>Cookie days</h2>
												<p>{dataconfig.cookie_days}</p>
											</div>
										</div>
									</li>
									<li>
										<div className="columns is-mobile">
											<div className="column is-1"><Icon name='check circle'/></div>
											<div className="column">
												<h2>Commission type</h2>
												<p>{dataconfig.com_type}</p>
											</div>
										</div>
									</li>
									<li>
										<div className="columns is-mobile">
											<div className="column is-1"><Icon name='check circle'/></div>
											<div className="column">
												<h2>Base commission</h2>
												<p>{dataconfig.base_com}</p>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<div className="column register-input">
							<div className="inside-padding">
								<h2>Affiliate Registration Form</h2>
								<Formik
									initialValues={state}
									validationSchema={getvalidations}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
												<Field name="first_name">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>First Name</label>
														<Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
												<Field name="last_name">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Last Name</label>
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
													<Form.Field
													  id="checkagree"
														className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error labelagree' : "labelagree";})()}
														control={Checkbox}
														label={<label className="termslabel">I agree to the Hivefiliate <a target="_blank" href={process.env.PUBLIC_URL+'/terms'}>Terms and Conditions</a></label>}
														defaultChecked={state.checkagree}
														onChange={(e)=>setFieldValue('checkagree',e.target.checked)}/>
												)}
											</Field>
											<Button className='blue' loading={spinner} size='big' icon onClick={handleSubmit}>Submit <Icon name='arrow alternate circle right outline' /></Button>
											<Button className='black' as='a' href={process.env.PUBLIC_URL+'/affiliates/login?merchant='+getaffmerchantid()} size='big' icon>Already have an account? <Icon name='arrow alternate circle right outline' /></Button>
										</Form>

								)}}/>
							</div>
						</div>
					</div>}

					<p className="copyright onform"><a href={process.env.PUBLIC_URL+'/'}>Hivefiliate All</a> © Copyright by . All Rights Reserved.</p>


				</div>
			</div>
		</div>
	)
}
