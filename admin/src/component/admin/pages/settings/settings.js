import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table, Checkbox } from 'semantic-ui-react'
import { Formik, Field } from 'formik'


import AlertMessage from '../../../config/alert'
import {LinkURL} from '../../../config/settings'
import {windowReload} from '../../../config/settings'

import {Spinning} from '../../../config/spinner'
import renderHTML from 'react-render-html'
import axios from 'axios'
import Cleave from 'cleave.js/react'

import {getvalidations} from './action/validate'


export default function Settings(props) {

	/* For Alert */
	function toTop(){document.querySelector('body').scrollTop = 0;}
	const [alert,setalert] = useState({});
	const [open,setopen] = useState(false);

	function closeAlert(){
		setopen(false);
	}
	function openAlert(data,text){
		setalert(text);
		setopen(true);
		toTop();
	}

  const [spinner, setspinner] = useState(false);
	const [state, setstate] = useState({
		notif_slsaff:true,
		notif_slsmerc:true,
		notif_paysentaff:true
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		console.log(values);
		setspinner(true);
		let formData = new FormData();
		formData.append('type','app_configuration');
		formData.append('info',JSON.stringify(values));
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){openAlert(true,{text:'Configuration successfully save',type:'success',size:'full',open:true});}
			if(obj==0){openAlert(true,{text:'Configuration not successfully save',type:'error',size:'full',open:true});}
			if(obj==1||obj==0){setTimeout(function() {windowReload();},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {return false;});
  }

	function AppConfigInfo(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','app_configinfo');
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){return false;}
			setstate({
					...state,
					notif_slsaff:obj.notif_slsaff==1?true:false,
					notif_slsmerc:obj.notif_slsmerc==1?true:false,
					notif_paysentaff:obj.notif_paysentaff==1?true:false,
			});
			setspinner(false);
		})
		.catch(function (error) {return false;});
	}

	useEffect(()=>{
		AppConfigInfo();
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Settings</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Settings</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<Formik
								  enableReinitialize
									initialValues={state}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form className="formconfig">
											<div className="form-wrapper">


												<div className="columns nopadding is-mobile">
													<div className="column nopadding is-one-quarter"></div>
													<div className="column nopadding">
															<Message
																info
																icon='cog'
																header='Configurations'
																content='The settings below will change the behavior of the notifications.'
															/>
												  </div>
												</div>

											  <div className="columns is-mobile">
													<div className="column is-one-quarter">
														<label className="inlinelabel">Affiliate notification for generating sales</label>
														<p className="text-blur">Enable notifications email to affiliate when sales are generated.</p>
													</div>
													<div className="column formcolumn">
														<Form.Group inline>
																<Field name="notif_slsaff">
																		{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																						<Checkbox className="labelagree" toggle id="notif_slsaff" label="Enable Notification Email" checked={values.notif_slsaff}
																								onChange={(e)=>{
																										setFieldValue(field.name,e.target.checked);
																								}}
																						/>
																				</Form.Field>
																		)}
																</Field>
														</Form.Group>
													</div>
												</div>
												<div className="columns is-mobile">
													<div className="column is-one-quarter">
														<label className="inlinelabel">Merchant notification for generating sales</label>
														<p className="text-blur">Enable notifications email to merchant when sales are generated.</p>
													</div>
													<div className="column formcolumn">
														<Form.Group inline>
																<Field name="notif_slsmerc">
																		{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																						<Checkbox className="labelagree" toggle id="notif_slsmerc" label="Enable Notification Email" checked={values.notif_slsmerc}
																								onChange={(e)=>{
																										setFieldValue(field.name,e.target.checked);
																								}}
																						/>
																				</Form.Field>
																		)}
																</Field>
														</Form.Group>
													</div>
												</div>
												<div className="columns is-mobile">
													<div className="column is-one-quarter">
														<label className="inlinelabel">Payment Sum Affiliate notification</label>
														<p className="text-blur">Enable notifications email to affiliate when merchant added sum of payment.</p>
													</div>
													<div className="column formcolumn">
														<Form.Group inline>
																<Field name="notif_paysentaff">
																		{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																						<Checkbox className="labelagree" toggle id="notif_paysentaff" label="Enable Notification Email" checked={values.notif_paysentaff}
																								onChange={(e)=>{
																										setFieldValue(field.name,e.target.checked);
																								}}
																						/>
																				</Form.Field>
																		)}
																</Field>
														</Form.Group>
													</div>
												</div>


												<div className="columns nopadding is-mobile">
													<div className="column nopadding is-one-quarter"></div>
													<div className="column nopadding">
															<Button
															  loading={spinner}
																color='blue'
																icon='check circle'
																labelPosition='right'
																content="Save Configurations"
																onClick={handleSubmit}
															/>
												  </div>
												</div>


				              </div>
									</Form>
							)}}/>
				</div>


		</React.Fragment>
	)
}
