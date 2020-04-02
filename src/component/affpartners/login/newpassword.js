import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox, Message } from 'semantic-ui-react'
import axios from 'axios'
import {newvalidations} from './validate'
import {getresetid} from '../../include/queryurl'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {windowReload,returnUrl} from '../../include/merchant_redirect'
import {getaffmerchantid} from '../../include/queryurl'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import '../../../assets/css/merchant.css'

export default function AffNewpass(props) {

	/*------- alert message and spinner--------- */

	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	const [textmessage, settextmessage] = useState(null);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}


	/*-------- Form Data --------------------- */

	const [state, setstate] = useState({
		id_merchant:getaffmerchantid(),
		password:'',
		reset_key:getresetid()
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);CloseAlert(false);
		let formData = new FormData();
		formData.append('type','affiliate_newpassword');
		formData.append('info',JSON.stringify(values));
		axios.post('/affiliates/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setspinner(false);
			if(obj==1){
				resetForm();setsuccess(true);
				setTimeout(function() {returnUrl('affiliates/login/?merchant='+getaffmerchantid());},3000);
				return false;
			}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);setspinner(false); return false;});
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
	function isAffiliateLogin(){
		setiswait(true);
		let formData = new FormData();
		formData.append('type','affiliates_islogin');
		axios.post('/affiliates/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setiswait(false);
			if(obj!=0){returnUrl('affiliates/dashboard');}
			ifmerchantexistid(getaffmerchantid());
		})
		.catch(function (error) {setiswait(false);return false;});
	}



	/* Check if valid merchant */
	const [store, setstore] = useState(null);
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
		axios.post('/affiliates/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setiswait(false);
			if(obj=='invalid_merchant'){setisvalid(false);return false;}
			setisvalid(true);
			setstore(obj);
			return false;
		})
		.catch(function (error) {setiswait(false);return false;});
	}


	function checkresetid(id){
		 let formData = new FormData();
		 formData.append('type','affiliate_checkreset');
		 formData.append('id',id);
		 axios.post('/affiliates/login/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 if(obj==0){
				 returnUrl('affiliates/login/?merchant='+getaffmerchantid());
			 }
		 })
		 .catch(function (error) {});
	}

	useEffect(()=>{
		isAffiliateLogin();
		if(getresetid()==null||getresetid()==''){
 		 returnUrl('affiliates/login/?merchant='+getaffmerchantid());
 	 }else{
 		 checkresetid(getresetid());
 	 }
	},[]);


	return (
		<div className="login-wrapper">
			{iswait&&Spinning()}
			<div className="topheading">
				<div className="login-grid-top">
					<div className="columns is-mobile is-vcentered">
						<div className="column"><img src={Logo}/><span>Hivefiliate</span></div>
						{isvalid&&<div className="column is-clearfix">
							<div className="position-right">
								<Button as="a" href={process.env.PUBLIC_URL+'/affiliates/register?merchant='+getaffmerchantid()} className='blue'>Register</Button>
								<Button as="a" href={process.env.PUBLIC_URL+'/affiliates/login?merchant='+getaffmerchantid()} className='green' icon><Icon name='lock' /> Login</Button>
							</div>
						</div>}
					</div>
				</div>
			</div>

			<div className="login-form">
				<div className="login-grid">


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

						{isvalid&&<div><Message
						    positive
							icon='building outline'
							header={store}
							content={'Welcome to '+store+' affiliate program!'}
						/>

						<div className="login-input">
							<div className="inside-padding">
								<h2>Affiliate New Password</h2>
								<h3 className="text-blur">Enter your new password</h3>


								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Congratulations! Password successfully changed.'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Unable to update new password'/>}


								<Formik
									initialValues={state}
									validationSchema={newvalidations}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
												<Field name="password">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Password</label>
														<Input
															type={seen==true?'text':'password'}
															fluid {...field}
															onChange={handleChange}
															icon={<Icon name={seen==true?'eye':'eye slash'} link onClick={()=>PasswordView()}/>}/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
											</Form.Group>
											<Button fluid className='blue' size='big' icon  loading={spinner} onClick={handleSubmit}><Icon name='lock' /> Confirm Password</Button>
											<div className="linkinput"><a href={process.env.PUBLIC_URL+'/affiliates/login/?merchant='+getaffmerchantid()}>Back to Login</a></div>
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
