import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidationsdelete} from './validate'
import axios from 'axios'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import {returnUrl} from '../../../include/merchant_redirect'

export default function DeleteAffAccount(props) {


	/* Spinner and Alert */
  const [spinner, setspinner] = useState(false);
  const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);

   /* Modal close */
  function closeModal(data){
		props.closeTrigger(data);
	}

   /* Form state and Submit  */
  const [isoff, setisoff] = useState('off');
	const [state, setstate] = useState({
        password:'',
        email:props.Emaildata,
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','affiliates_deleteaccount');
		formData.append('info',JSON.stringify(values));
		axios.post('/affiliates/account/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
                setsuccess(true);
                setTimeout(function(){ returnUrl(''); }, 2000);
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
	            validationSchema={getvalidationsdelete}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
					        <Modal.Header>Deleting Account<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">


                                {successmsg&&<AlertSuccess sizeWidth='small' TextAlert='Account successfully deleted. Please wait while closing your account.'/>}
								{errormsg&&<AlertError sizeWidth='small' TextAlert='Account not successfully deleted'/>}


								<div className="form-note-addafiliate">
									<Message
										warning
										header='Delete Confirmation'
										list={[
										'Deleting account is ireversible, It will remove all information associated this account.',
										'Please enter your current password to proceed the process',
										]}
									/>
								</div>

						    	<Form>
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
						      </Form>
						    </Modal.Content>
						    <Modal.Actions>
						        <div className="positionright">
	                                 <Button
									  loading={spinner}
						              color='red'
						              icon='check circle'
						              labelPosition='right'
						              content="Confirm Delete"
						              onClick={handleSubmit}
						            />
								</div>
						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
