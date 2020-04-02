import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {resetvalidations} from './validate'

import {LinkURL} from '../../config/settings'
import AlertMessage from '../../config/alert'

import {SuccessLogin} from '../../config/spinner'
import {windowLocation} from '../../config/settings'
import Profile from '../../../assets/images/user.png'
import Logo from '../../../assets/images/logo.jpg'
export default function ResetAdmin(props) {

  const [open, setopen] = useState(true);
  const [alert, setalert] = useState('');
  function closeAlert(){
		setopen(false);
	}
	function callalert(data,text){
		setalert(text);
		setopen(data);
	}


  const [seen, setseen] = useState(false);
  const [success, setsuccess] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
    email:'',
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_reset');
		formData.append('info',JSON.stringify(values));
		axios.post('/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
        callalert(true,{text:'Your almost done! Check your email to continue the process.',type:'success',size:'small',open:true});
        resetForm();
				return false;
			}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {
      resetForm();
      setspinner(false);
      return false;
    });
   }


	return (
    <Formik
       initialValues={state}
       validationSchema={resetvalidations}
       onSubmit={handleSubmitForm}
       render={formProps => {
       const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
       return(
    		<div className="admin-login">
              <div className="admin-logo"><img src={Logo} alt='Hivefiliate Logo'/></div>
                <div className="wrapperlogin">

                  {open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

                  <div className="loginheading">
                    <div className="columns is-mobile">
                      <div className="column is-one-fifth"><img src={Profile}/></div>
                      <div className="column">
                        <h3>Reset Password</h3>
                        <p className="text-blur">Enter your correct email</p>
                      </div>
                    </div>
                  </div>
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
                  </Form>
                  <div className="loginaccount">
                    <Button fluid size='large' loading={spinner} icon className='blue' onClick={handleSubmit}>Confirm Reset</Button>
                    <Button as='a' href={LinkURL('/login')} fluid size='large' icon className='basic'><Icon name='lock' /> Back to Login</Button>
                  </div>
                </div>
                <p className="textfooter">Hivefiliate All © Copyright by . All Rights Reserved.</p>
          </div>
      )}}/>
	)
}
