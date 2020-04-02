import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import {windowReload} from '../../../include/merchant_redirect'

export default function AccountInfo(props) {

    /* Spinner and Alert */

  const [isdisabled, setisdisabled] = useState(true);
	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

   /* Modal close */
    function closeModal(data){
		props.closeTrigger(data);
    }

   /* Form state and Submit  */
    const [seen1, setseen1] = useState(false);
    const [seen2, setseen2] = useState(false);
    const [isoff, setisoff] = useState('off');
	  const [state, setstate] = useState({
        store_name:props.idStorename,
        email:props.idEmail,
		    old_password:'',
		    new_password:'',
        is_change:'false',
        id:props.idCallback,
    });

    function PasswordView(par){
        if(par==1){
            if(seen1==true){setseen1(false);}
            if(seen1==false){setseen1(true);}
        }
        if(par==2){
            if(seen2==true){setseen2(false);}
            if(seen2==false){setseen2(true);}
        }
    }

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
  		setspinner(true);
  		CloseAlert(false);
  		let formData = new FormData();
  		formData.append('type','merchant_updateaccount');
  		formData.append('info',JSON.stringify(values));
  		axios.post('/merchant/account/request.php',formData)
  		.then(function (response) {
  			let obj = response.data;
  			if(obj==1){
            setsuccess(true);
            setspinner(false);
            setTimeout(function() {windowReload();},1000);
  				return false;
  			}
  			setspinner(false);
  			if(obj==0){seterror(true);return false;}
  			Object.keys(obj).forEach(function(key) {setErrors(obj)});
  		})
  		.catch(function (error) {seterror(true);return false;});
   }



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
						<Modal open={true} size='tiny'>
					        <Modal.Header>Update account<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Account successfully updated'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='small' TextAlert='Account not successfully updated'/>}

						    	<Form>
						    	   <Form.Group widths='equal'>
								      <Field name="store_name">
										{({ field, form }) => (
									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									        <label>Store Name</label>
									        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
									      </Form.Field>
										)}
									  </Field>
								    </Form.Group>
						      </Form>

							  <Form>
									<Form.Group inline>
										<Field name="is_change">
											{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                            <Checkbox className="labelagree" toggle id="change_pass" label='Change account password?' defaultChecked={false}
                                onChange={(e)=>{



                                    let disabledthis = true;
                                    let ischecked = 'false';
                                    if(e.target.checked==true){
                                        disabledthis = false;
                                        ischecked = 'true';
                                    }

                                    setFieldValue('old_password','');
                                    setFieldValue('new_password','');
                                    setFieldValue('confirm_password','');
                                    setisdisabled(disabledthis);
                                    setFieldValue('is_change',ischecked);

                                    }}
                            />
												</Form.Field>
											)}
										</Field>
									</Form.Group>
								</Form>

                    <Form>
                        <Form.Group widths='equal'>
                            <Field name="old_password">
                                {({ field, form }) => (
                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                    <label>Enter your old password</label>
                                    <Input
                                        type={seen1==true?'text':'password'}
                                        fluid
                                        {...field}
                                        onChange={handleChange}
                                        autoComplete={isoff}
                                        disabled={isdisabled}
                                        icon={<Icon name={seen1==true?'eye':'eye slash'} link onClick={()=>PasswordView(1)}/>}
                                    />
                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                </Form.Field>
                                )}
                            </Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Field name="new_password">
                                {({ field, form }) => (
                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                    <label>Enter your new password</label>
                                    <Input
                                        type={seen2==true?'text':'password'}
                                        fluid
                                        {...field}
                                        onChange={handleChange}
                                        autoComplete={isoff}
                                        disabled={isdisabled}
                                        icon={<Icon name={seen2==true?'eye':'eye slash'} link onClick={()=>PasswordView(2)}/>}
                                    />
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
  						              color='blue'
  						              icon='check circle'
  						              labelPosition='right'
  						              content="Save Account"
  						              onClick={handleSubmit}
						            />
								</div>
						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
