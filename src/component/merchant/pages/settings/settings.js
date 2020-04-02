import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import {getvalidationsPayment} from './validate'
import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import axios from 'axios'

import {windowReload,Public_URL} from '../../../include/merchant_redirect'

export default function Settings(props) {
    function scrollToTop(){
        document.querySelector('body').scrollTop = 0;
    }

    const [spinner, setspinner] = useState(false);
    const [isoff, setisoff] = useState('off');
    const [state, setstate] = useState({
        min_payment:'',
    });


    const [successmsg, setsuccess] = useState(false);
	  const [errormsg, seterror] = useState(false);
    function CloseAlert(){
        setsuccess(false);
        seterror(false);
    }

    function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
        setspinner(true);
        CloseAlert();
    		let formData = new FormData();
    		formData.append('type','merchant_settings_payment');
    		formData.append('info',JSON.stringify(values));
    		axios.post('/merchant/settings/request.php',formData)
    		.then(function (response) {
    			let obj = response.data;
    			if(obj==1){
          SettingsPayment();
          resetForm();setsuccess(true);
          scrollToTop();
				  setspinner(false);
				  return false;
			}
			setspinner(false);
			if(obj==0){resetForm();seterror(true);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});
   }

   function SettingsPayment(){
        let formData = new FormData();
        formData.append('type','merchant_settingspayment');
        axios.post('/merchant/settings/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            if(obj==0){return false;}
            setstate({
                ...state,
                min_payment:obj.min_payment,
            });

        })
        .catch(function (error) {return false;});
   }

   useEffect(()=>{
        SettingsPayment();
   },[]);

	return (
		<React.Fragment>
	        <div className="settings pagecontent">

                    <div className="elementScroll">
                        {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Successfully saved changes'/>}
                        {errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Not successfully save changes'/>}
                    </div>

					          <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column"><h2 className="titlewrapper">Settings > <span className="text-blur">Payment</span></h2></div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
                                </div>
                            </div>
                        </div>
                    </div>
					          <div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' onClick={()=>Public_URL('/settings/general')}><Icon name='cog'/>General</Menu.Item>
                            <Menu.Item as='a' onClick={()=>Public_URL('/settings/tracking')}><Icon name='location arrow'/>Tracking</Menu.Item>
                            {/*<Menu.Item as='a' onClick={()=>Public_URL('/settings/payment')}><Icon name='credit card'/>Payment</Menu.Item>*/}
                        </Menu>
                    </div>

                    <Formik
                        enableReinitialize
                        initialValues={state}
                        validationSchema={getvalidationsPayment}
                        onSubmit={handleSubmitForm}
                        render={formProps => {
                        const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
                        return(
                            <div className="segment-wrapper">
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Default minimum payment</h2>
                                        <h3>How much is the minimum amount, an affiliate must generate, before he can get paid</h3>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="min_payment">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input
                                                            fluid
                                                            {...field}
                                                            onChange={handleChange}
                                                            autoComplete={isoff}
                                                            label={{ content: '$' }}
                                                            labelPosition='right'
                                                            maxLength='6'
                                                            />
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"></div>
                                    <div className="column iscontent text-blue">
                                       <Button
                                            loading={spinner}
                                            color='blue'
                                            icon='check circle'
                                            labelPosition='right'
                                            content="Save Changes"
                                            onClick={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                     )}}/>


            </div>
		</React.Fragment>
	)
}
