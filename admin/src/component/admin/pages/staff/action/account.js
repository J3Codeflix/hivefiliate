import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {accountvalidations} from './validate'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function AccountComponent(props) {

  /* For Modal */
  function closeModal(data){
      props.close(data);
  }
  function callalert(open,data){
      props.alert(open,data);
  }
  function reloadlist(){
      props.reload();
  }

  /* Form Submit */
  const [seen, setseen] = useState(false);
  const buttonEl = useRef(null);
  const [buttonclick, setbuttonClick] = useState(0);
  function buttonSubmit(arg){
      setbuttonClick(arg);
      buttonEl.current.click();
	}

  const [isucess,setisucess] = useState(false);
  const [iserror,setiserror] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
      id:props.data.id,
      id_merchant:props.data.id_merchant,
      email:props.data.email,
      password:'',
  		status:props.data.status,
  		first_name:props.data.first_name,
  		last_name:props.data.last_name,
  		dash_view:props.data.permission.dash_view=='true'?true:false,
  		aff_view:props.data.permission.aff_view=='true'?true:false,
  		aff_edit:props.data.permission.aff_edit=='true'?true:false,
  		aff_pay:props.data.permission.aff_pay=='true'?true:false,
  		aff_delete:props.data.permission.aff_delete=='true'?true:false,
  		order_view:props.data.permission.order_view=='true'?true:false,
  		order_edit:props.data.permission.order_edit=='true'?true:false,
  		bann_view:props.data.permission.bann_view=='true'?true:false,
  		bann_edit:props.data.permission.bann_edit=='true'?true:false,
  		bann_delete:props.data.permission.bann_delete=='true'?true:false,
      is_change:false
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_updatestaff');
		formData.append('info',JSON.stringify(values));
		axios.post('/staff/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Staff successfully updated',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
				if(buttonclick==2){setisucess(true);reloadlist();setTimeout(function() {setisucess(false);},2000);}
				return false;
			}
			if(obj==0){resetForm();setiserror(true);setTimeout(function() {setiserror(false);},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();setiserror(true);setspinner(false);return false;});
   }

	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            validationSchema={accountvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
					        <Modal.Header>Update Staff<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent">
                  {isucess&&Success()}
                  {iserror&&Error()}


                  <Form>

                    <Form.Group widths='equal'>
                     <Field name="id_merchant">
                         {({ field, form }) => (
                         <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                           <label>Choose Store</label>
                             <Select fluid selectOnBlur={false}
                                 {...field}
                                 search
                                 selection
                                 options={props.data.list}
                                 onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Merchant Store"/>
                           { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                         </Form.Field>
                         )}
                     </Field>
                   </Form.Group>


						    	   <Form.Group widths='equal'>
								      <Field name="first_name">
										    {({ field, form }) => (
  									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
  									        <label>First name</label>
  									        <Input fluid {...field} onChange={handleChange}/>
  									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
  									      </Form.Field>
										    )}
									  </Field>
									  <Field name="last_name">
										{({ field, form }) => (
									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									        <label>Last name</label>
									        <Input fluid {...field} onChange={handleChange}/>
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
                                disabled={values.is_change==true?false:true}
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
                    <Form.Group widths='equal'>
                      <Field name="is_change">
                        {({ field, form }) => (
                        <Form.Field>
                          <Checkbox className="labelagree" id="is_change" toggle label='Change Password?'  checked={values.is_change}
                          onChange={(e)=>{
                            setFieldValue(field.name,e.target.checked);
                            setFieldValue('password','');
                          }}
                          />
                        </Form.Field>
                        )}
                      </Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
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

                  <Message warning content='If password change, it will send automatically the new password to email'/>

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
