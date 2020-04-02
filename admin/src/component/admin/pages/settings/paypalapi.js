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


export default function PaypalAPI(props) {

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
		paypal_clientid:'',
		is_live:true
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		console.log(values);
		setspinner(true);
		let formData = new FormData();
		formData.append('type','paypal_setting');
		formData.append('info',JSON.stringify(values));
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){openAlert(true,{text:'Setting successfully save',type:'success',size:'full',open:true});}
			if(obj==0){openAlert(true,{text:'Setting not successfully save',type:'error',size:'full',open:true});}
			if(obj==1||obj==0){setTimeout(function() {windowReload();},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {return false;});
  }

	function paypalsettingsInfo(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','paypal_settingsinfo');
		axios.post('/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){return false;}
			setstate({
					...state,
					paypal_clientid:obj.paypal_clientid,
					is_live:obj.is_live==1?true:false
			});
			setspinner(false);
		})
		.catch(function (error) {return false;});
	}

	useEffect(()=>{
		paypalsettingsInfo();
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Paypal Setting</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Paypal API</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<Formik
								  enableReinitialize
									initialValues={state}
									validationSchema={getvalidations}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<div className="form-wrapper">


												<div className="columns nopadding is-mobile">
													<div className="column nopadding is-one-quarter"></div>
													<div className="column nopadding">
															<Message
																positive
																icon='paypal'
																header='Paypal Client ID'
																content='In order to get paypal client id, Go to your business paypal developer account.'
															/>
												  </div>
												</div>

											  <div className="columns is-mobile">
													<div className="column is-one-quarter">
														<label className="inlinelabel">Paypal Client ID</label>
														<p className="text-blur">Enter the correct Paypal Client ID Provided by PayPal.</p>
													</div>
													<div className="column formcolumn">
															<Form.Group widths='equal'>
																	<Field name="paypal_clientid">
																			{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<Input fluid {...field} onChange={handleChange}/>
																					{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																			)}
																	</Field>
															</Form.Group>
													</div>
												</div>

												<div className="columns nopadding is-mobile">
													<div className="column nopadding is-one-quarter"></div>
													<div className="column nopadding">
															<Form.Group inline>
																	<Field name="is_live">
																			{({ field, form }) => (
																					<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																							<Checkbox className="labelagree" toggle id="is_live" label="Enable Paypal Payment" checked={values.is_live}
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
																content="Save Paypal Setting"
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
