import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Checkbox, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import axios from 'axios'
import {getvalidationsstaff} from './validate'
import {UserContext} from '../../layout/userContext'
import {ProgramAffLink} from '../../../include/merchant_redirect'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'

export default function AccountStaff(props) {

	const usersContext = useContext(UserContext);
	let store_id 					= null;
	let staffemail 			  = null;
	let storename   			= null;
	let username 					= null;
	let merchant_id 			= null;
	let date_expiration 	= null;
	let stafflog 				  = 0;
	let staff_firstname 	= null;
	let staff_lastname 		= null;


	if(usersContext){
			storename 					= usersContext.store_name;
			username 						= usersContext.username;
			merchant_id 				= usersContext.merchant_id;
			store_id 						= usersContext.id;
			staffemail 				  = usersContext.staffemail;
			date_expiration 		= usersContext.date_expiration;
			stafflog	 				  = usersContext.stafflog;
			staff_firstname	 		= usersContext.staff_firstname;
			staff_lastname	 	  = usersContext.staff_lastname;
	}
  const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	const [textsuccess, settextsuccess] = useState('');
	const [texterror, settexterror] = useState('');


	const [state, setstate] = useState({
		first_name:staff_firstname,
		last_name:staff_lastname,
		password:''
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		 setspinner(true);
		 setsuccess(false);
		 seterror(false);
		 let formData = new FormData();
		 formData.append('type','merchant_staffaccount');
		 formData.append('info',JSON.stringify(values));
		 axios.post('/merchant/account/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 setspinner(false);
			 if(obj==1){setsuccess(true);settextsuccess('Account successfully updated');return false;}
			 if(obj==0){seterror(true);settexterror('Account not successfully updated');return false;}
			 Object.keys(obj).forEach(function(key) {setErrors(obj)});
		 })
		 .catch(function (error) {setspinner(false);return false;});
	}


	const [isdelete, setisdelete] = useState(false);
	function deleteConfirmProcess(){
		 setspinner(true);
		 setsuccess(false);
		 seterror(false);
		 let formData = new FormData();
		 formData.append('type','merchant_staffaccountdelete');
		 axios.post('/merchant/account/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 setspinner(false);
			 closeModal();
			 if(obj==1){setsuccess(true);settextsuccess('Account successfully deleted');return false;}
			 if(obj==0){seterror(true);settexterror('Account not successfully deleted');return false;}
		 })
		 .catch(function (error) {setspinner(false);return false;});
	}

	function closeModal(){
		  setisdelete(false);
	}
	function DeleteAccount(){
			setisdelete(true);
	}


	return (
		<React.Fragment>
			<div className="account pagecontent">
					<h1 className="titlewrapper">Account</h1>

						<Formik
	 	            initialValues={state}
	 	            validationSchema={getvalidationsstaff}
	 	            onSubmit={handleSubmitForm}
	 	            render={formProps => {
	 	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
	 		          return(
								      <div className="segment-wrapper">

												{successmsg&&<AlertSuccess sizeWidth='full' TextAlert={textsuccess}/>}
											  {errormsg&&<AlertError sizeWidth='full' TextAlert={texterror}/>}

												<div className="columns iscolumns is-mobile">
													<div className="column is-one-third"><h2>Your name</h2></div>
													<div className="column iscontent text-blue">
														<Form>
															<Form.Group widths='equal'>
																	<Field name="first_name">
																		{({ field, form }) => (
																			<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																				<label>First Name</label>
																				<Input fluid {...field} onChange={handleChange}/>
																				{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																			</Form.Field>
																		)}
																   </Field>
																	 <Field name="last_name">
 																		{({ field, form }) => (
 																			<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
 																				<label>Last Name</label>
 																				<Input fluid {...field} onChange={handleChange}/>
 																				{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
 																			</Form.Field>
 																		)}
 																   </Field>
																</Form.Group>
														</Form>
													</div>
												</div>
												<div className="columns iscolumns is-mobile">
													<div className="column is-one-third"><h2>Email</h2></div>
													<div className="column iscontent">{staffemail}</div>
												</div>

												<div className="columns iscolumns is-mobile">
													<div className="column is-one-third"><h2>New Password</h2></div>
													<div className="column iscontent text-blue">
														<Form>
															<Form.Group widths='equal'>
																	<Field name="password">
																		{({ field, form }) => (
																			<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																				<Input type="password" fluid {...field} onChange={handleChange}/>
																				{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																			</Form.Field>
																		)}
																   </Field>
																</Form.Group>
														</Form>
													</div>
												</div>

												<div className="columns iscolumns is-mobile">
													<div className="column is-one-third"></div>
													<div className="column iscontent">
														<Button
															loading={spinner}
															color='blue'
															icon='check circle'
															labelPosition='right'
															content="Update Account"
															onClick={handleSubmit}
														/>
														<Button
															loading={spinner}
															color='red'
															icon='check circle'
															labelPosition='right'
															content="Delete your account and data"
															onClick={()=>DeleteAccount()}
														/>
													</div>
												</div>
											</div>
								)}}/>

							  {isdelete&&<Modal open={true} size='mini' onClose={()=>closeModal()}>
				          <Modal.Content className="iconaction iconwarning" >
				            <i className="ti-info-alt"></i>
				            <p>Are you sure you want to delete this record? You can't revert this proccess.</p>
				          </Modal.Content>
				          <Modal.Actions className="positioncenter">
				            <Button color='red' onClick={()=> closeModal()}>Cancel</Button>
				            <Button
											loading={spinner}
				              color='green'
				              icon='checkmark'
				              labelPosition='right'
				              content='Yes, Confirm'
				              onClick={()=>deleteConfirmProcess()}
				            />
				          </Modal.Actions>
				        </Modal>}


	        </div>

		</React.Fragment>
	)
}
