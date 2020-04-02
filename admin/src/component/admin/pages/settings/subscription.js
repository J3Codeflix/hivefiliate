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

import {subvalidation} from './action/validate'


export default function Subscription(props) {

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
		plan_professional:'',
		plan_enterprise:''
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		console.log(values);
		setspinner(true);
		let formData = new FormData();
		formData.append('type','subscription_updatesetting');
		formData.append('info',JSON.stringify(values));
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){openAlert(true,{text:'Setting successfully save',type:'success',size:'full',open:true});}
			if(obj==0){openAlert(true,{text:'Setting not successfully save',type:'error',size:'full',open:true});}
			if(obj==1||obj==0){setTimeout(function() {windowReload();},1000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {return false;});
  }

	function subscriptionSettingsInfo(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','subscription_settingsinfo');
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){return false;}
			setstate({
					...state,
					plan_professional:obj.plan_professional,
					plan_enterprise:obj.plan_enterprise,
			});
			setspinner(false);
		})
		.catch(function (error) {return false;});
	}

	useEffect(()=>{
		subscriptionSettingsInfo();
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Subscription Price</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Subscription Details</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<Formik
								  enableReinitialize
									initialValues={state}
									validationSchema={subvalidation}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<div className="form-wrapper">

											  <div className="columns is-mobile wrapp_professional">
													<div className="column formcolumn">
															<div className="subscriptionlabel">
																<label className="inlinelabel">Professional Plan | Price Per month in US$</label>
																<p className="text-blur">Unlimited Activities Track, Unlimited Activities Track, Extensive Settings</p>
															</div>
															<Form.Group widths='equal'>
																	<Field name="plan_professional">
																			{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<Input fluid {...field} onChange={handleChange}
																					label={{ content: '$',color:'green' }}
																					labelPosition='left'/>
																					{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																			)}
																	</Field>
															</Form.Group>
													</div>
												</div>

												<div className="columns is-mobile wrapp_enterprise">
													<div className="column formcolumn">
															<div className="subscriptionlabel">
																<label className="inlinelabel">Enterprise Plan | Price Per month in US$</label>
																<p className="text-blur">Best for businesses who need customized tracking and functionality to support large partner channels and referral networks.</p>
															</div>
															<Form.Group widths='equal'>
																	<Field name="plan_enterprise">
																			{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<Input fluid {...field} onChange={handleChange}
																					label={{ content: '$',color:'orange' }}
																					labelPosition='left'/>
																					{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																			)}
																	</Field>
															</Form.Group>
													</div>
												</div>

												<div className="columns nopadding is-mobile">
													<div className="column nopadding">
															<Button
															  loading={spinner}
																color='blue'
																icon='check circle'
																labelPosition='right'
																content="Save Subscription"
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
