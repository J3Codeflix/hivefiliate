import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import axios from 'axios'
import {getvalidations} from './validate'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'
import DeleteAffAccount from './delete'
import renderHTML from 'react-render-html'
import PaypalLogo from '../../../../assets/image/paypal.png'

export default function Account(props) {


    /* -------- Scroll to Top ------------------------*/
    function scrollToTop(){
        document.querySelector('body').scrollTop = 0;
    }


    /*--------- Password seen and unseen------------ */

	const [seen,setseen] = useState(false);
	const [seen2,setseen2] = useState(false);
    function PasswordView(){
    	if(seen==true){
    		setseen(false);
    	}else{
    		setseen(true);
    	}
	}
	function PasswordView2(){
    	if(seen2==true){
    		setseen2(false);
    	}else{
    		setseen2(true);
    	}
    }

    const [spinner, setspinner] = useState(false);
    const [isoff, setisoff] = useState('off');
    const [state, setstate] = useState({
        email:'',
        first_name:'',
        last_name:'',
        website_blog:'',
        facebook:'',
        instagram:'',
        youtube:'',
        other_social:'',
        comments:'',
        min_payment:'',
        old_password:'',
        new_password:'',
        is_change:false,
        paypal_email:'',
        terms:''

    });
    const [chk_ischange, setchk_ischange] = useState(false);
    const [disabledpass, setdisabledpass] = useState(true);

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
		      formData.append('type','affiliates_accountchanges');
      		formData.append('info',JSON.stringify(values));
      		axios.post('/affiliates/account/request.php',formData)
      		.then(function (response) {
      			let obj = response.data;
      			  if(obj==1){
                 AffiliatesAccount();
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

   function AffiliatesAccount(){
        let formData = new FormData();
        formData.append('type','affiliates_accountdata');
        axios.post('/affiliates/account/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            if(obj==0){return false;}

            setstate({
                ...state,
                email:obj.email,
                first_name:obj.first_name,
                last_name:obj.last_name,
                email:obj.email,
                website_blog:obj.website_blog,
                facebook:obj.facebook,
                instagram:obj.instagram,
                youtube:obj.youtube,
                other_social:obj.other_social,
                comments:obj.comments,
                min_payment:obj.min_payment,
                new_password:obj.new_password,
                paypal_email:obj.paypal_email,
                terms:obj.terms
            });
        })
        .catch(function (error) {seterror(true);return false;});
   }

   /* Action Modal
    ---------------------------------------------*/
    const [isdelete, setisdelete] = useState(false);
    const [isemail, setisemail] = useState(false);
    function DeleteAccount(){
        setisdelete(true);
        setisemail(state.email);
    }
    function closeDelete(){
        setisdelete(false);
    }

   useEffect(()=>{
        AffiliatesAccount();
   },[]);

	return (
		<React.Fragment>
	        <div className="settings pagecontent">

                    <div className="elementScroll">
                        {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Successfully saved changes'/>}
                        {errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Not successfully save changes'/>}
                    </div>

                    <Formik
                        enableReinitialize
                        validationSchema={getvalidations}
                        initialValues={state}
                        onSubmit={handleSubmitForm}
                        render={formProps => {
                        const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
                        return(
                            <div className="segment-wrapper">

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"><h2>Name</h2></div>
                                    <div className="column iscontent text-blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="first_name">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <label>First Name</label>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                                <Field name="last_name">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <label>Last Name</label>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"><h2>Email</h2></div>
                                    <div className="column iscontent">{state.email}</div>
                                </div>

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"><h2>Website / Social Media Site(s)</h2></div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="website_blog">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Website / Blog"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Field name="facebook">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Facebook"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Field name="instagram">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Instagram"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Field name="youtube">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Youtube"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Field name="other_social">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Other social network"/>
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
                                        <h2>Comments</h2>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="comments">
                                                    {({ field, form }) => (
                                                      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <TextArea fluid {...field} onChange={handleChange} autoComplete={isoff}/>
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
                                        <h2>Program terms</h2>
                                    </div>
                                    <div className="column iscontent">{values.terms}</div>
                                </div>

                                {/*<div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Minimum Payment Sum</h2>
                                        <h3>It cannot be lower than $10</h3>
                                    </div>
                                    <div className="column iscontent">
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
                                                                labelPosition='left'
                                                                maxLength='6'
                                                            />

                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>*/}


                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Prefered Payment Method</h2>
                                        <img src={PaypalLogo}/>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="paypal_email">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Input
                                                              icon='mail'
                                                              iconPosition='left'
                                                              fluid
                                                              {...field}
                                                              onChange={handleChange}
                                                              placeholder="Enter your Paypal email"
                                                            />
                                                            { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                        <p>This will be use for your earnings payment.</p>
                                    </div>
                                </div>

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Password</h2>
                                        <h3>Leave empty if you dont want to change your password</h3>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="old_password">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <label>Current Password</label>
                                                        <Input
															                              type={seen==true?'text':'password'}
															                              fluid {...field}
                                                            onChange={handleChange}
                                                            disabled={disabledpass}
															                              icon={<Icon name={seen==true?'eye':'eye slash'} link onClick={()=>PasswordView()}/>}
															                              autoComplete={isoff}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                                <Field name="new_password">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <label>New Password</label>
                                                        <Input
															                              type={seen2==true?'text':'password'}
															                              fluid {...field}
                                                            onChange={handleChange}
                                                            disabled={disabledpass}
															                              icon={<Icon name={seen2==true?'eye':'eye slash'} link onClick={()=>PasswordView2()}/>}
															                              autoComplete={isoff}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                        <Form className="top-space">
                                            <Form.Group inline>
                                                <Field name="is_change">
                                                    {({ field, form }) => (
                                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Checkbox className="labelagree" toggle id="is_change" label="Change your password?" checked={chk_ischange}
                                                                onChange={(e)=>{

                                                                    if(e.target.checked==false){
                                                                        setFieldValue('old_password','');
                                                                        setFieldValue('new_password','');
                                                                        setdisabledpass(true);
                                                                    }else{
                                                                        setFieldValue('old_password','');
                                                                        setFieldValue('new_password','');
                                                                        setdisabledpass(false);
                                                                    }
                                                                    setchk_ischange(e.target.checked);
                                                                    setFieldValue(field.name,e.target.checked);

                                                                }}
                                                            />
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
                                        <Button
                                            loading={spinner}
                                            color='red'
                                            icon='check circle'
                                            labelPosition='right'
                                            content="Delete Account"
                                            onClick={()=>DeleteAccount()}
                                        />
                                    </div>
                                </div>
                            </div>
                     )}}/>

                     {isdelete&&<DeleteAffAccount closeTrigger={closeDelete} Emaildata={isemail}/>}


            </div>
		</React.Fragment>
	)
}
