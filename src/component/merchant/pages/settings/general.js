import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import CKEditor from "react-ckeditor-component"
import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import axios from 'axios'
import {getsitevalidation} from './validate'

import {windowReload,Public_URL} from '../../../include/merchant_redirect'



export default function Settings(props) {

    function scrollToTop(){
        document.querySelector('body').scrollTop = 0;
    }

    const [activeItem, setactiveItem] = useState('general');
    const [spinner, setspinner] = useState(false);
    const [isoff, setisoff] = useState('off');
    const [state, setstate] = useState({
        terms:'',
        is_send:false,
        auto_approved:false,
        site_address:'',
        site_type:0,
    });
    const [chk_isend, setchk_isend] = useState(false);
    const [chk_autoapproved, setchk_autoapproved] = useState(false);

    const [terms_text, setterms_text] = useState([]);
    function EventDescription(evt){
		var newContent = evt.editor.getData();
		setterms_text(newContent);
    }
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
		formData.append('type','merchant_settings_general');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/settings/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
                SettingsGeneral();
                resetForm();setsuccess(true);
                scrollToTop();
				setspinner(false);
				return false;
			}
			setspinner(false);
			if(obj==0){resetForm();return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();return false;});
   }

   function SettingsGeneral(){
        let formData = new FormData();
        formData.append('type','merchant_settingsgeneral');
        axios.post('/merchant/settings/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            if(obj==0){return false;}
            setstate({
                ...state,
                terms:obj.terms,
                is_send:obj.is_send=='true'?true:false,
                auto_approved:obj.auto_approved=='true'?true:false,
                site_address:obj.site_address,
                site_type:obj.site_type
            });
            setterms_text(obj.terms);
            setchk_isend(obj.is_send=='true'?true:false);
            setchk_autoapproved(obj.auto_approved=='true'?true:false);

        })
        .catch(function (error) {return false;});
   }

   useEffect(()=>{
        SettingsGeneral();
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
                            <div className="column"><h2 className="titlewrapper">Settings > <span className="text-blur">General</span></h2></div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
                                </div>
                            </div>
                        </div>
                    </div>
					<div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' onClick={()=>Public_URL('/settings/general')} active><Icon name='cog'/>General</Menu.Item>
                            <Menu.Item as='a' onClick={()=>Public_URL('/settings/tracking')}><Icon name='location arrow'/>Tracking</Menu.Item>
                            {/*<Menu.Item as='a' onClick={()=>Public_URL('/settings/payment')}><Icon name='credit card'/>Payment</Menu.Item>*/}
                        </Menu>
                    </div>


                    <Formik
                        enableReinitialize
                        initialValues={state}
                        validationSchema={getsitevalidation}
                        onSubmit={handleSubmitForm}
                        render={formProps => {
                        const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
                        return(
                            <div className="segment-wrapper">
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                      <h2>Your site address</h2>
                                      <h3>A site address or store url is required for tracking</h3>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="site_address">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input disabled={values.site_type==1||values.site_type==2} fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="https://www.yourstoreurl.com"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Program Terms</h2>
                                        <h3>This will show to all active affiliates</h3>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <CKEditor
                                            activeClass="p10"
                                            content={terms_text}
                                            events={{
                                                "blur": (evt)=> {
                                                    EventDescription(evt);
                                                    setFieldValue('terms',evt.editor.getData());
                                                },
                                                "afterPaste": (evt)=> {
                                                    EventDescription(evt);
                                                    setFieldValue('terms',evt.editor.getData());
                                                },
                                                "change": (evt)=> {
                                                    EventDescription(evt);
                                                    setFieldValue('terms',evt.editor.getData());
                                                }
                                            }}
                                        />
                                      {/*<Form className="top-space">
                                            <Form.Group inline>
                                                <Field name="is_send">
                                                    {({ field, form }) => (
                                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Checkbox className="labelagree" toggle id="is_send" label="Send email to all active affiliates?" checked={chk_isend}
                                                                onChange={(e)=>{
                                                                    setchk_isend(e.target.checked);
                                                                    setFieldValue(field.name,e.target.checked);
                                                                }}
                                                            />
                                                        </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>*/}
                                    </div>
                                </div>
                                {/*<div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Auto approve affiliate applications</h2>
                                        <h3>Checked the checkbox if you want to automatically approved affiliate applications</h3>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <Form className="top-space">
                                            <Form.Group inline>
                                                <Field name="auto_approved">
                                                    {({ field, form }) => (
                                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Checkbox className="labelagree" toggle id="auto_approved" label="Auto approved?" checked={chk_autoapproved}
                                                                onChange={(e)=>{
                                                                    setchk_autoapproved(e.target.checked);
                                                                    setFieldValue(field.name,e.target.checked);
                                                                }}
                                                            />
                                                        </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>*/}
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"><h2>Banners settings</h2></div>
                                    <div className="column iscontent text-blue" onClick={()=>Public_URL('/banners')}><a>View banners settings</a></div>
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
