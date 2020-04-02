import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function AddComponent(props) {

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
      fullname:'',
      email:'',
      password:'',
      status:'Active',
      description:'',
      is_view:false,
      is_edit:false,
      is_delete:false
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_adduser');
		formData.append('info',JSON.stringify(values));
		axios.post('/users/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'User successfully added',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
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
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
					        <Modal.Header>Add User<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent">
                  {isucess&&Success()}
                  {iserror&&Error()}
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

                    {/*<Form.Group inline className="permission-wrapper">
                      <label className="labelpermission">Permission User: </label>
                      <Form.Checkbox label='View' id='is_view'
                        onChange={(e)=>{
                          setFieldValue('is_view',e.target.checked);
                      }}/>
                      <Form.Checkbox label='Edit' id='is_edit'
                        onChange={(e)=>{
                        setFieldValue('is_edit',e.target.checked);
                      }}/>
                      <Form.Checkbox label='Delete' id='is_delete'
                        onChange={(e)=>{
                          setFieldValue('is_delete',e.target.checked);
                      }}/>
                    </Form.Group>*/}

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
