import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal, Checkbox, Table } from 'semantic-ui-react'
import axios from 'axios'
import {accountvalidations} from './validate'
import renderHTML from 'react-render-html'
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
      email:props.data.email,
      password:'',
      store_name:props.data.store_name,
      description:props.data.description,
      is_send:false,
      is_change:false,
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_merchantupdate');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Store successfully updated',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
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
						      <Modal open={true} size='large' onClose={()=>closeModal(false)}>
					        <Modal.Header>Account: {props.data.store_name}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent colormodal">
                  {isucess&&Success()}
                  {iserror&&Error()}

                  <div className="columns">
                    <div className="column">
                      <div className="package-currentplan boxplan">
                         <Table celled striped>
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> ID</Table.Cell>
                                <Table.Cell>{props.data.id}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Email</Table.Cell>
                                <Table.Cell>{props.data.email}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Store Name</Table.Cell>
                                <Table.Cell>{props.data.store_name}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Date Registered</Table.Cell>
                                <Table.Cell>{props.data.dateadded}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Type Plan</Table.Cell>
                                <Table.Cell>{renderHTML(props.data.type_plan)}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Price Plan</Table.Cell>
                                <Table.Cell>{props.data.price_plan}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Status</Table.Cell>
                                <Table.Cell>{renderHTML(props.data.status)}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Date Expiration</Table.Cell>
                                <Table.Cell>{props.data.plan_expire}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell collapsing><Icon name='bullseye' /> Rem. Days</Table.Cell>
                                <Table.Cell>{props.data.days_remaining}</Table.Cell>
                              </Table.Row>
                            </Table.Body>
                         </Table>
                      </div>
                    </div>
                    <div className="column">
                      <div className="boxform">
        						    	<Form>
        						    	   <Form.Group widths='equal'>
        								      <Field name="email">
        										      {({ field, form }) => (
          									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
          									        <label>Email</label>
          									        <Input disabled={true} fluid {...field} onChange={handleChange}/>
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
                                        disabled={values.is_change==false}
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
                                            <Checkbox className="labelagree" toggle id="is_change" label="Change password?" checked={values.is_change}
                                                onChange={(e)=>{
                                                    setFieldValue(field.name,e.target.checked);
                                                    setFieldValue('is_send',false);
                                                    setFieldValue('password','');
                                                }}
                                            />
                                        </Form.Field>
                                    )}
                                </Field>
                                <Field name="is_send">
                                    {({ field, form }) => (
                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                            <Checkbox disabled={values.is_change==false} className="labelagree" toggle id="is_send" label="Send login password to email" checked={values.is_send}
                                                onChange={(e)=>{
                                                    setFieldValue(field.name,e.target.checked);
                                                }}
                                            />
                                        </Form.Field>
                                    )}
                                </Field>
                            </Form.Group>
        								    <Form.Group widths='equal'>
        								      <Field name="store_name">
        										    {({ field, form }) => (
          									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
          									        <label>Store Name</label>
          									        <Input fluid {...field} onChange={handleChange}/>
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
        						      </Form>
                        </div>
                      </div>
                    </div>
						    </Modal.Content>
  						    <Modal.Actions>
  						        <div className="positionright">
  	                       <Button
  									        loading={spinner}
  						              color='blue'
  						              icon='check circle'
  						              labelPosition='right'
  						              content="Save and exit"
  						              onClick={() => buttonSubmit(1)}
  						            />
  									   <button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
  								    </div>
  						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
