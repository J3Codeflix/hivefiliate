import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

//import {DeleteSuccess, SuccessSave, ErrorSave, DeleteError} from './alert'

export default function Addstaff(props) {


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
			props.textalertMessage('Staff successfully added');
		}


   /* Form state and Submit  */
	  const [isoff, setisoff] = useState('off');
		const [state, setstate] = useState({
			email:'',
			status:'Active',
			first_name:'',
			last_name:'',
			dash_view:true,
			aff_view:true,
			aff_edit:false,
			aff_pay:false,
			aff_delete:false,
			order_view:true,
			order_edit:false,
			bann_view:true,
			bann_edit:false,
			bann_delete:false,
		});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_addstaff');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/staff/request.php',formData)
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
			if(obj==0){resetForm();seterror(true);return false;}
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
						<Modal open={true} size='small'>
					        <Modal.Header>Add staff account<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Staff successfully added'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Staff not successfully added'/>}

						    	<Form>
						    	   <Form.Group widths='equal'>
								      <Field name="first_name">
										{({ field, form }) => (
									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									        <label>First name</label>
									        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
									      </Form.Field>
										)}
									  </Field>
									  <Field name="last_name">
										{({ field, form }) => (
									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									        <label>Last name</label>
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
									  <Field name="status">
										{({ field, form }) => (
									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									        <label>Status</label>
											<Select fluid
												options={[
													{ key: '0', text: 'Active', value: 'Active' },
													{ key: '1', text: 'In-Active', value: 'In-Active' },
												]}
												{...field}
												onChange={(e, { value }) => setFieldValue(field.name, value)}/>
									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
									      </Form.Field>
										)}
									  </Field>
								    </Form.Group>
						      </Form>

							  <div className="staff-permission">
							  		<div className="columns is-mobile">
										<div className="column">
											<h2 className="subtitle">Password</h2>
											<h3 className="text-blur">The staff member will receive an email containing the generated password. Note, They are allowed to change their password.</h3>
										</div>
									</div>

									<div className="persmission-title">
										<Message
										    info
											icon='key'
											header='Choose Permission'
											list={[
												'Staff will acess the information depends on sets of permission',
												'By default the permission of staff is only view.',
											]}
										/>
									</div>

									<div className="columns is-mobile">
										<div className="column">
											<h2 className="subtitle">Dashboard</h2>
											<h3 className="text-blur">The staff member can see your official program dashboard</h3>
											<Form>
												<Form.Group widths='equal'>
													<Field name="dash_view">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="dash_view" label='View'  defaultChecked={state.dash_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
												</Form.Group>
											</Form>
										</div>
									</div>

									<div className="columns is-mobile">
										<div className="column">
											<h2 className="subtitle">Affiliates</h2>
											<h3 className="text-blur">The staff member can view/modify/delete affiliates.</h3>
											<Form>
												<Form.Group inline>
													<Field name="aff_view">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_view" label='View'  defaultChecked={state.aff_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_edit" label='Edit'  defaultChecked={state.aff_edit} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_pay">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_pay" label='Pay'  defaultChecked={state.aff_pay} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_delete">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_delete" label='Delete'  defaultChecked={state.aff_delete} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
												</Form.Group>
											</Form>
										</div>
									</div>

									<div className="columns is-mobile">
										<div className="column">
											<h2 className="subtitle">Orders</h2>
											<h3 className="text-blur">The staff members can read/modify orders</h3>
											<Form>
												<Form.Group inline>
													<Field name="order_view">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="order_view" label='View'  defaultChecked={state.order_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="order_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="order_edit" label='Edit'  defaultChecked={state.order_edit} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
												</Form.Group>
											</Form>
										</div>
									</div>

									<div className="columns is-mobile">
										<div className="column">
											<h2 className="subtitle">Banners</h2>
											<h3 className="text-blur">The staff member can view/modify/upload banners</h3>
											<Form>
												<Form.Group inline>
													<Field name="bann_view">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="bann_view" label='View'  defaultChecked={state.bann_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="bann_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="bann_edit" label='Edit'  defaultChecked={state.bann_edit} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
													<Field name="bann_delete">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="bann_delete" label='Delete'  defaultChecked={state.bann_delete} onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
														</Form.Field>
														)}
													</Field>
												</Form.Group>
											</Form>
										</div>
									</div>


							  </div>



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
