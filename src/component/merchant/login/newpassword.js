import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox, Message } from 'semantic-ui-react'
import axios from 'axios'
import {newvalidations} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {getresetid} from '../../include/queryurl'
import {windowReload,returnUrl} from '../../include/merchant_redirect'
import {urlmode,storemode} from '../../include/queryurl'
import {Spinning} from '../../include/circlespin'

import Logo from '../../../assets/image/logo.png'
import '../../../assets/css/merchant.css'

export default function NewPassword(props) {

	/*------- alert message and spinner--------- */

	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

	/*-------- Form Data --------------------- */

	const [state, setstate] = useState({
		password:'',
		reset_key:getresetid()
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
			setspinner(true);CloseAlert(false);
			let formData = new FormData();
			formData.append('type','merchant_newpassword');
			formData.append('info',JSON.stringify(values));
			axios.post('/merchant/login/request.php',formData)
			.then(function (response) {
				let obj = response.data;
				setspinner(false);
				if(obj==1){
					resetForm();setsuccess(true);
					setTimeout(function() {returnUrl('login')},3000);
					return false;
				}
				if(obj==0){resetForm();seterror(true);return false;}
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



	function checkresetid(id){
		 let formData = new FormData();
		 formData.append('type','merchant_checkreset');
		 formData.append('id',id);
		 axios.post('/merchant/login/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 if(obj==0){returnUrl('login');}
		 })
		 .catch(function (error) {});
	}

	useEffect(()=>{
	 if(getresetid()==null||getresetid()==''){
		 returnUrl('login');
	 }else{
		 checkresetid(getresetid());
	 }
	},[]);


	return (
		<div className="login-wrapper">

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

						{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Congratulations! Password successfully change.'/>}
						{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Error! Unable to change password'/>}

						<div className="login-input">
							<div className="inside-padding">
								<h2>New Password</h2>
								<h3 className="text-blur">Enter your new password</h3>
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
											<div style={{'padding-bottom':'10px'}}><Button fluid className='blue' size='big' icon  loading={spinner} onClick={handleSubmit}>Confirm Password</Button></div>
                      <div><Button as="a" href={process.env.PUBLIC_URL+'/login'} fluid className='basic' size='big' icon><Icon name='lock' /> Back to Login</Button></div>
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
