import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import {ProgramAffLink} from '../../../../include/merchant_redirect'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'
import {UserContext} from '../../../layout/userContext'

//import {DeleteSuccess, SuccessSave, ErrorSave, DeleteError} from './alert'

export default function AddAffiliate(props) {

	/* User Context */
	const usersContext = useContext(UserContext);
	let merchant_id = null;
	if(usersContext){
		merchant_id = usersContext.merchant_id;
	}

	/* Spinner and Alert */
	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

   /* Button Element Click */
   const buttonEl = useRef(null);
   const [buttonclick, setbuttonClick] = useState(0);
   function buttonSubmit(arg){
        setbuttonClick(arg);
        buttonEl.current.click();
	}


   /* Modal close */
    function closeModal(data){
		props.closeTrigger(data);
	}
	function reloadList(){
		props.reloadTrigger(true);
	}
	function showAlert(data){
		props.showAlertMessage(data);
		props.textalertMessage('Affiliate successfully added');
	}


   /* Form state and Submit  */
    const [isoff, setisoff] = useState('off');
	const [state, setstate] = useState({
		email:'',
		password:'',
		first_name:'',
		last_name:''
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','marchant_addaffiliate');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				resetForm();
				if(buttonclick==1){reloadList();showAlert(true);closeModal(false);}
				if(buttonclick==2){reloadList();setsuccess(true);}
				setspinner(false);
				return false;
			}
			setspinner(false);
			if(obj==0){resetForm();seterror(true);setspinner(false);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});
   }


	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<Modal open={true} size='tiny'>
					        <Modal.Header>Add Affiliate<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent" scrolling>

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Affiliate successfully added'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Affiliate not successfully registered'/>}

								<div className="form-note-addafiliate">
									<Message
										warning
										header='You can add affiliates to your program by two ways:'
										list={[
										'Link to/give this address ' + ProgramAffLink('register?merchant='+merchant_id),
										'or add the affiliate manually',
										]}
									/>
									<div className="columns is-variable is-1 is-mobile">
										<div className="column is-one-fifth"><span>NOTICE:</span></div>
										<div className="column">After adding the affiliate, an email about the registration will be send to his/her email.</div>
									</div>
									<div className="columns">
										<div className="column is-one-fifth"></div>
										<div className="column">Manually added affiliates, must accept our Terms of Service when they login into their panels, otherwise they won't be able to use their account.</div>
									</div>
								</div>

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
									        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
									      </Form.Field>
										)}
									  </Field>
								    </Form.Group>
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
								    </Form.Group>
									<Form.Group widths='equal'>
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
						      </Form>
						    </Modal.Content>
						    <Modal.Actions>
						        <div className="positionright">
	                                 <Button
									  loading={spinner}
						              color='black'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and exit"
						              onClick={() => buttonSubmit(1)}
						            />
	                                 <Button
									  loading={spinner}
						              color='blue'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and stay on modal"
						              onClick={() => buttonSubmit(2)}
						            />
									<button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
								</div>
						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
