import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import {LinkURL} from '../../config/settings'
import {SuccessLogin} from '../../config/spinner'
import {windowLocation} from '../../config/settings'
import Profile from '../../../assets/images/profile.png'
import Logo from '../../../assets/images/logo.jpg'
export default function LoginAdmin(props) {


  const [seen, setseen] = useState(false);
  const [success, setsuccess] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
    email:'',
    password:'',
    remember:''
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_login');
		formData.append('info',JSON.stringify(values));
		axios.post('/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				setsuccess(true);
        setTimeout(function() {
          setsuccess(false);
          windowLocation('/dashboard')},1000);
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

   function isManagerLogin(){
   		let formData = new FormData();
   		formData.append('type','admin_islogin');
   		axios.post('/login/request.php',formData)
   		.then(function (response) {
   			let obj = response.data;
   			if(obj!='0'){windowLocation('/dashboard');return false;}
   		})
   		.catch(function (error) {setspinner(false);return false;});
 	}

   useEffect(()=>{
       isManagerLogin();
   },[]);

	return (
    <Formik
       initialValues={state}
       validationSchema={getvalidations}
       onSubmit={handleSubmitForm}
       render={formProps => {
       const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
       return(
    		<div className="admin-login">
              <div className="admin-logo"><img src={Logo} alt='Hivefiliate Logo'/></div>
                <div className="wrapperlogin">
                  {success&&SuccessLogin()}
                  <div className="loginheading">
                    <div className="columns is-mobile">
                      <div className="column is-one-fifth"><img src={Profile}/></div>
                      <div className="column">
                        <h3>Administrator Login</h3>
                        <p className="text-blur">Login to your account</p>
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
                    <Form>
                      <Form.Group widths='equal'>
                         <Form.Field>
                           <Checkbox label='Remember me' id="remember" onClick={(e)=>setFieldValue('remember',e.target.checked)}/>
                         </Form.Field>
                      </Form.Group>
                   </Form>
                    <Button fluid size='large' icon className='blue' onClick={handleSubmit}><Icon name='lock' /> Login Account</Button>
                    <Button as='a' href={LinkURL('/reset')} fluid size='large' icon className='basic'>Forgot Password</Button>
                  </div>
                </div>
                <p className="textfooter">Hivefiliate All © Copyright by . All Rights Reserved.</p>
          </div>
      )}}/>
	)
}
