import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {passwordvalidations} from './validate'

import {LinkURL} from '../../config/settings'
import AlertMessage from '../../config/alert'
import {getresetid} from '../../config/queryurl'

import {SuccessLogin} from '../../config/spinner'
import {windowLocation} from '../../config/settings'
import Profile from '../../../assets/images/user.png'
import Logo from '../../../assets/images/logo.jpg'
export default function NewPassword(props) {

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
    password:'',
    reset_key:getresetid()
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_newpassword');
		formData.append('info',JSON.stringify(values));
		axios.post('/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
        callalert(true,{text:'Successfully change password. You can now login.',type:'success',size:'small',open:true});
        setTimeout(function() {windowLocation('/login')},3000);
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

   function checkresetid(id){
      let formData = new FormData();
   		formData.append('type','admin_checkreset');
   		formData.append('id',id);
   		axios.post('/login/request.php',formData)
   		.then(function (response) {
   			let obj = response.data;
   			if(obj==0){windowLocation('/login');}
   		})
   		.catch(function (error) {});
   }

   useEffect(()=>{
    if(getresetid()==null||getresetid()==''){
      windowLocation('/login');
    }else{
      checkresetid(getresetid());
    }
   },[]);


	return (
    <Formik
       initialValues={state}
       validationSchema={passwordvalidations}
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
                        <h3>New Password</h3>
                        <p className="text-blur">Enter your new password</p>
                      </div>
                    </div>
                  </div>
                  <Form>
                    <Form.Group widths='equal'>
                     <Field name="password">
                         {({ field, form }) => (
                         <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                           <label>Password</label>
                           <Input fluid {...field} onChange={handleChange}
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
                  </Form>
                  <div className="loginaccount">
                    <Button fluid size='large' loading={spinner} icon className='blue' onClick={handleSubmit}>Confirm Password</Button>
                    <Button as='a' href={LinkURL('/login')} fluid size='large' icon className='basic'><Icon name='lock' /> Back to Login</Button>
                  </div>
                </div>
                <p className="textfooter">Hivefiliate All © Copyright by . All Rights Reserved.</p>
          </div>
      )}}/>
	)
}
