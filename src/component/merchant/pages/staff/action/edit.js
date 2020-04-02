import _ from 'lodash'
import React, {useState,useRef,useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

export default function EditStaff(props) {


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
		props.textalertMessage('Staff successfully updated');
	}


   /* Form state and Submit  */
  const [isoff, setisoff] = useState('off');
	const [state, setstate] = useState({
		id:0,
		email:'',
		status:'Active',
		first_name:'',
		last_name:'',
		dash_view:'',
		aff_view:'',
		aff_edit:'',
		aff_pay:'',
		aff_delete:'',
		order_view:'',
		order_edit:'',
		bann_view:'',
		bann_edit:'',
		bann_delete:'',
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
	   //console.log(values);return false;
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_updatestaff');
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

   function DetailsAccountStaff(){
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_staffdetails');
		formData.append('id',props.idCallback);
		axios.post('/merchant/staff/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setstate({
				...state,
				id:obj.id,
				email:obj.email,
				status:obj.status,
				first_name:obj.first_name,
				last_name:obj.last_name,
				dash_view:obj.dash_view,
				aff_view:obj.aff_view,
				aff_edit:obj.aff_edit,
				aff_pay:obj.aff_pay,
				aff_delete:obj.aff_delete,
				order_view:obj.order_view,
				order_edit:obj.order_edit,
				bann_view:obj.bann_view,
				bann_edit:obj.bann_edit,
				bann_delete:obj.bann_delete,
			})
			setspinner(false);
		})
		.catch(function (error) {return false;});
   }

	 /* Reset Password */
	 const [chk_isend, setchk_isend] = useState(true);
	 const [password, setpassword] = useState('');
	 const [isreset, setisreset] = useState(false);
	 const [errorreset, seterrorreset] = useState(false);
	 const [loadingreset, setloadingreset] = useState(false);


	 function SendChangePassword(password,chk_isend){
		 setloadingreset(true);
		 let formData = new FormData();
		 formData.append('type','merchant_staffchangepassword');
		 formData.append('password',password);
		 formData.append('chk_isend',chk_isend);
		 formData.append('id',props.idCallback);
		 axios.post('/merchant/staff/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 if(obj==1){
				 setsuccess(true);
				 setpassword('');
			 }
			 setloadingreset(false);
		 })
		 .catch(function (error) {return false;});
	 }

	 function onchangeCheck(val){
		 seterrorreset(false);
		 if(val.length<5){
			 seterrorreset(true);
			 return false;
		 }
	 }
	 function savePassword(){
		  seterrorreset(false);
		  if(password.length<5){
				seterrorreset(true);
				return false;
			}
			SendChangePassword(password,chk_isend);
	 }

   useEffect(()=>{
			DetailsAccountStaff();
   },[]);


	return (
		<div className="modalwrapper">
		     <Formik
			    enableReinitialize
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<Modal open={true} size='small'>

					      <Modal.Header>Update staff account<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Staff successfully updated'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Staff not successfully updated'/>}

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
									        <Input readOnly={true} fluid {...field} autoComplete={isoff}/>
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


										{isreset&&<div>
											<Form.Group widths='equal'>
										      <Form.Field className={errorreset?'error':''}>
										        <label>Password</label>
										        <Input fluid name="password" autoComplete={isoff}
															onChange={(e)=>{
																  setpassword(e.target.value);
																	onchangeCheck(e.target.value);
															}}/>
														  {errorreset&&<Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i> Password is required and must be 5 char minimum</Label>}
										      </Form.Field>
											</Form.Group>
											<Form.Group inline className="top-space">
													<Form.Field>
															<Checkbox className="labelagree" toggle id="is_send" label="Send a email with the new password to the staff member" checked={chk_isend}
																	onChange={(e)=>{
																			setchk_isend(e.target.checked);
																	}}
															/>
													</Form.Field>
											</Form.Group>
											<Button
												loading={loadingreset}
												color='green'
												content="Save Password"
												onClick={() => savePassword()}
											/>
											<Button
												color='red'
												content="Cancel"
												onClick={() => {
													setFieldValue('password','');
													setisreset(false);
													seterrorreset(false);
												}}
											/>
										</div>}

										{isreset==false&&<Button
											color='green'
											content="Reset Password"
											onClick={() => setisreset(true)}
									  />}


						      </Form>

							    <div className="staff-permission">
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
															<Checkbox className="labelagree" id="dash_view" label='View'  checked={state.dash_view} disabled={true}/>
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
															<Checkbox className="labelagree" id="aff_view" label='View'  checked={state.aff_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_edit" label='Edit'  checked={state.aff_edit} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_pay">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_pay" label='Pay'  checked={state.aff_pay} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
														</Form.Field>
														)}
													</Field>
													<Field name="aff_delete">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="aff_delete" label='Delete'  checked={state.aff_delete} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
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
															<Checkbox className="labelagree" id="order_view" label='View'  checked={state.order_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="order_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="order_edit" label='Edit'  checked={state.order_edit} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
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
															<Checkbox className="labelagree" id="bann_view" label='View'  checked={state.bann_view} disabled={true}/>
														</Form.Field>
														)}
													</Field>
													<Field name="bann_edit">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" id="bann_edit" label='Edit'  checked={state.bann_edit} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
														</Form.Field>
														)}
													</Field>
													<Field name="bann_delete">
														{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox type="checkbox" className="labelagree" id="bann_delete" label='Delete'  checked={state.bann_delete} onChange={(e)=>setstate({...state,[field.name]:e.target.checked})}/>
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
