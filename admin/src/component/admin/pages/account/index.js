import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Checkbox, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'


import AlertMessage from '../../../config/alert'
import {LinkURL} from '../../../config/settings'
import {windowReload} from '../../../config/settings'

import {Spinning} from '../../../config/spinner'
import axios from 'axios'
import {validations} from './validate'

export default function AdminAccount(props) {

	/* For Alert */
	function toTop(){document.querySelector('body').scrollTop = 0;}
	const [seen, setseen] = useState(false);
	const [spinner, setspinner] = useState(false);
	const [open, setopen] = useState(false);
	const [alert, setalert] = useState('');

	const [isdisabled, setisdisabled] = useState(true);

	function closeAlert(){
		setopen(false);
	}

	function callalert(isopen,data){
		setopen(isopen);
		setalert(data);
	}


	const [state, setstate] = useState({
		email:'',
		password:'',
		fullname:'',
		status:'Active',
		description:'',
		is_change:false,
	});


	const buttonEl = useRef(null);
	const [buttonclick, setbuttonClick] = useState(0);
	function buttonSubmit(arg){
			setbuttonClick(arg);
			buttonEl.current.click();
	}


	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		console.log(values);
    setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_updateaccount');
		formData.append('info',JSON.stringify(values));
		axios.post('/users/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setspinner(false);
			if(obj==1){
				callalert(true,{text:'Account successfully added',type:'success',size:'full',open:true});
				return false;
			}
			if(obj==0){resetForm();return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();setspinner(false);return false;});
	 }

	 function AccountInfo(){
		let formData = new FormData();
		formData.append('type','admin_account');
 		axios.post('/users/request.php',formData)
 		.then(function (response) {
 			let obj = response.data;
 			setstate({
				...state,
				email:obj.email,
				fullname:obj.fullname,
				status:obj.status,
				description:obj.description,
			});
 		})
 		.catch(function (error) {return false;});
	 }

	useEffect(()=>{
		AccountInfo();
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Account</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Account</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<div className="table-wrapper">
									<Formik
										  enableReinitialize
				 	            initialValues={state}
				 	            validationSchema={validations}
				 	            onSubmit={handleSubmitForm}
				 	            render={formProps => {
				 	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
				 		          return(
												<div className="account-wrapper">
													<Form>
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
																				disabled={isdisabled}
																				fluid {...field} onChange={handleChange}
																				type={seen==true?'text':'password'}
																				icon={<Icon name={seen==true?'eye':'eye slash'} link onClick={()=>{
																					setseen(seen?false:true);
																				}}/>}
																				/>
																			{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																		</Form.Field>
																)}
														</Field>
														</Form.Group>
														<Form.Group inline>
				                        <Field name="is_change">
				                            {({ field, form }) => (
				                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
				                                    <Checkbox className="labelagree" toggle id="is_change" label='Change password?' checked={values.is_change}
				                                        onChange={(e)=>{
				                                            setFieldValue('password','');
																										setseen(false);
				                                            setFieldValue('is_change',e.target.checked);
				                                            if(e.target.checked==true){
				                                              setisdisabled(false);
				                                            }else{
				                                              setisdisabled(true);
				                                            }
				                                        }}
				                                    />
				                                </Form.Field>
				                            )}
				                        </Field>
				                    </Form.Group>
														<Form.Group widths='equal'>
															<Field name="fullname">
																{({ field, form }) => (
																	<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																		<label>Fullname</label>
																		<Input fluid {...field} onChange={handleChange}/>
																		{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																	</Form.Field>
															 )}
														</Field>
														</Form.Group>
														<Form.Group widths='equal'>
												      <Field name="status">
				    										{({ field, form }) => (
				    									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
				    									        <label>Status</label>
				                              <Select fluid selectOnBlur={false}
				                                  {...field}
				                                  options={[
				                                      { key: '0', text: 'Active', value: 'Active' },
				                                      { key: '1', text: 'In-Active', value: 'In-Active' },
				                                  ]}
				                                  onChange={(e, { value }) => setFieldValue(field.name,value)}/>
				    									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
				    									      </Form.Field>
				    										)}
													  </Field>
												    </Form.Group>


														<Form.Group widths='equal'>
												      <Field name="description">
														    {({ field, form }) => (
				  									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
				  									        <label>Description</label>
				  									        <TextArea fluid {...field} onChange={handleChange}/>
				  									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
				  									      </Form.Field>
														   )}
													  </Field>
													</Form.Group>
													<Button
														 loading={spinner}
														 color='blue'
														 icon='check circle'
														 labelPosition='right'
														 content="Save Account"
														 onClick={() => buttonSubmit(2)}
													 />
											 		<button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
													</Form>
												</div>
									)}}/>

							</div>
          </div>



		</React.Fragment>
	)
}
