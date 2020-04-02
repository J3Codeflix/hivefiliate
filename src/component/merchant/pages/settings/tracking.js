import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image, Popup } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import {getvalidations} from './validate'
import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import axios from 'axios'
import Cleave from 'cleave.js/react'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'



export default function Tracking(props) {

    function scrollToTop(){
        document.querySelector('body').scrollTop = 0;
    }

    const [spinner, setspinner] = useState(false);
    const [isoff, setisoff] = useState('off');
    const [state, setstate] = useState({
        cookie_duration:'',
        commission_type:'1',
        flat_rate:'',
        commission_percent:'',
        typecom_update:false,
        cookie_update:false,
        coupon_code:'',
        coupon_update:false,
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
		    formData.append('type','merchant_settings_tracking');
		    formData.append('info',JSON.stringify(values));
		    axios.post('/merchant/settings/request.php',formData)
    		.then(function (response) {
    			let obj = response.data;
    			if(obj==1){
            SettingsTracking();
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

   function SettingsTracking(){
        let formData = new FormData();
        formData.append('type','merchant_settingstracking');
        axios.post('/merchant/settings/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            if(obj==0){return false;}
            setstate({
                ...state,
                cookie_duration:obj.cookie_duration,
                commission_type:obj.commission_type,
                flat_rate:obj.flat_rate,
                commission_percent:obj.commission_percent,
                typecom_update:obj.typecom_update==1?true:false,
                cookie_update:obj.cookie_update==1?true:false,
                coupon_code:obj.coupon_code,
                coupon_update:obj.coupon_update==1?true:false,
            });

        })
        .catch(function (error) {seterror(true);return false;});
   }

   useEffect(()=>{
         SettingsTracking();
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
                            <div className="column"><h2 className="titlewrapper">Settings > <span className="text-blur">Tracking</span></h2></div>
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
                            <Menu.Item as='a' onClick={()=>Public_URL('/settings/tracking')} active><Icon name='location arrow'/>Tracking</Menu.Item>
                            {/*<Menu.Item as='a' onClick={()=>Public_URL('/settings/payment')}><Icon name='credit card'/>Payment</Menu.Item>*/}
                        </Menu>
                    </div>


                    <Formik
                        enableReinitialize
                        initialValues={state}
                        validationSchema={getvalidations}
                        onSubmit={handleSubmitForm}
                        render={formProps => {
                        const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
                        return(
                            <div className="segment-wrapper">



                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Default Cookie Duration</h2>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="cookie_duration">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input
                                                            fluid
                                                            {...field}
                                                            onChange={handleChange}
                                                            autoComplete={isoff}
                                                            label={{ content: 'days' }}
                                                            labelPosition='right'
                                                            maxLength='3'
                                                            />
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group inline>
                                              <Field name="cookie_update">
                                                {({ field, form }) => (

                                                  <Form.Field
                        														id="cookie_update"
                        														className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}
                        														control={Checkbox}
                                                    toggle
                        														label={<label>Update to all active affiliates <Popup wide='very' inverted trigger={<Icon name='info circle' />}>
                                                          <p>If the toggle checkbox is on and you click save changes button, All active affiliates associated to your account the cookie duration
                                                          will be updated.</p><p> Otherwise, If the checkbox is off it will apply only to new incoming registered affiliate and
                                                          old affiliates will not be affected for the new configuration of cookie duration.</p>
                                                          <p style={{'padding-top':'10px'}}>To set cookie duration for specific affiliate, just go to affiliate page.</p>

                                                        </Popup></label>}
                        														checked={values.cookie_update}
                        														onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>
                                                )}
                                              </Field>
                                            </Form.Group>
                                        </Form>
                                        <div className="textdescription text-blur">
                                            <p>By default the cookie is active for 7 days. This means that if the referred visitor makes a purchase during those 7 days, his purchase will be associated with the referring affiliate.</p>
                                            <p>When the 7 days pass, the visitor will no longer be associated with the affiliate and future purchases will not be associated with the referring affiliate.</p>
                                            <p>From the field for cookie duration you can set duration from 1 to 365 days - whatever suits your needs.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Commission type for tracking</h2>
                                        <h3>Choose how the affiliate's commission will be calculated.</h3>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="commission_type">
                                                    {({ field, form }) => (
                                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Select
                                                                fluid
                                                                selectOnBlur={false}
                                                                options={[
                                                                    {key:'1',text:'Percent from purchase',value:'1'},
                                                                    {key:'2',text:'Flat rate per purchase',value:'2'}
                                                                ]}
                                                                {...field}
                                                                onChange={(e, { value }) => {
                                                                  setFieldValue(field.name, value);
                                                                }}/>
                                                            { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                                        </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Default commission for tracking</h2>
                                        <h3>The commission percent that will be used to calculate the affiliate's earnings based on the amount of the purchase.</h3>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="commission_percent">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <div className="textdescription text-blur">For percentage</div>
                                                        <Input
                                                            fluid
                                                            {...field}
                                                            onChange={handleChange}
                                                            autoComplete={isoff}
                                                            label={{ content: '%' }}
                                                            labelPosition='right'
                                                            />
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                            <Field name="flat_rate">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <div className="textdescription text-blur">For flat rate</div>
                                                    <Input iconPosition='right'>
                                                        <Icon name='dollar' />
                                                        <Cleave {...field} options={{numeral: true,numeralThousandsGroupStyle: 'thousand'}} onChange={handleChange}/>
                                                    </Input>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                            <Form.Group inline>
                      												<Field name="typecom_update">
                      													{({ field, form }) => (

                                                  <Form.Field
                        														id="typecom_update"
                        														className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}
                        														control={Checkbox}
                                                    toggle
                        														label={<label>Update to all active affiliates <Popup wide='very' inverted trigger={<Icon name='info circle' />}>
                                                          <p>If the toggle checkbox is on and you click save changes changes button, All active affiliates associated to your account the commission for tracking
                                                          will be updated.</p><p> Otherwise, If the checkbox is off it will apply only to new incoming registered affiliate and
                                                          old affiliates will not be affected for the new configuration of commission for tracking.</p>
                                                          <p style={{'padding-top':'10px'}}>To set commission tracking for specific affiliate, just go to affiliate page.</p>

                                                        </Popup></label>}
                        														checked={values.typecom_update}
                        														onChange={(e)=>setFieldValue(field.name,e.target.checked)}/>


                      													)}
                      												</Field>
                      											</Form.Group>
                                        </Form>
                                    </div>
                                </div>

                                {/*<div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Coupon code</h2>
                                        <h3>You can assign coupon code for specific affiliate under the affliate page.</h3>
                                    </div>
                                    <div className="column iscontent">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="coupon_code">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input
                                                            fluid
                                                            {...field}
                                                            onChange={handleChange}
                                                            />
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                            <Form.Group inline>
                      												<Field name="coupon_update">
                      													{({ field, form }) => (
                      														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                      															<Checkbox className="labelagree" toggle id="coupon_update" label="Update to all active affiliates" checked={values.coupon_update}
                      																onChange={(e)=>{
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
