import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import DatePicker from "react-datepicker"
import moment from 'moment'
import Cleave from 'cleave.js/react'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

export default function Add(props) {

	
	/* Spinner and Alert */
	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

   /* Button Element Click */
   const buttonEl = useRef(null);
   const [buttonclick, setbuttonClick] = useState(0);
   function buttonSubmit(arg){
        setbuttonClick(arg);
        buttonEl.current.click();
    }

   
   /* Modal close */
    function closeModal(data){
		props.closeTrigger(data);
	}
	function reloadList(){
		props.reloadTrigger(true);
	}
	function showAlert(data){
		props.showAlertMessage(data);
		props.textalertMessage('Order successfully added');
	}
	

   /* Form state and Submit  */
    const [isoff, setisoff] = useState('off');
    const [date_dummy, setdate_dummy] = useState('');
	const [state, setstate] = useState({
		affiliate_id:'',
		order_id:'',
		tracking_method:'Tracking by link',
        order_price:'',
        aff_earnings:'',
		date_order:'',
		order_status:'Paid',
		landing_page:'',
		referal_page:'',
		notes:'',
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){

        const datavlues = {
            affiliate_id:values.affiliate_id,
            order_id:values.order_id,
            tracking_method:values.tracking_method,
            order_price:values.order_price,
            aff_earnings:values.aff_earnings,
            date_order: moment(new Date(values.date_order)).format('YYYY-MM-DD'),
            order_status:values.order_status,
            landing_page:values.landing_page,
            referal_page:values.referal_page,
            notes:values.notes,
        }
        
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_addorder');
		formData.append('info',JSON.stringify(datavlues));
		axios.post('/merchant/orders/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				resetForm();
				if(buttonclick==1){reloadList();showAlert(true);closeModal(false);}
				if(buttonclick==2){reloadList();setsuccess(true);}
				setspinner(false);
				return false;
			}
			setspinner(false);
			if(obj==0){resetForm();seterror(true);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});
   }
   
   const [arraff, setarraff] = useState([]);
   function getAffiliate(){
        let formData = new FormData();
        formData.append('type','merchant_getaffiliate');
        axios.post('/merchant/orders/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setarraff(obj);
        })
        .catch(function (error) {return false;});
   }

   
    useEffect(()=>{
        getAffiliate();
    },[]);

	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<Modal open={true} size='tiny'>
					        <Modal.Header>Add order<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent modalorder">

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order successfully added'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order not successfully added'/>}

						    	<Form>
                                   <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Affiliate</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                                <Field name="affiliate_id">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Select fluid 
                                                            selectOnBlur={false}
                                                            options={arraff} 
                                                            {...field}
                                                            onChange={(e, { value }) => setFieldValue(field.name, value)}
                                                            placeholder="Choose affiliate"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Order ID</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                                <Field name="order_id">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Input fluid {...field} onChange={handleChange} autoComplete={isoff}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Tracking Method</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="tracking_method">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Select fluid 
                                                        options={[
                                                            { key: '0', text: 'Tracking by link', value: 'Tracking by link' },
                                                            { key: '1', text: 'Tracking by code', value: 'Tracking by code' },
                                                            { key: '2', text: 'Tracking by qr', value: 'Tracking by qr' },
                                                            { key: '3', text: 'Tracking by sku', value: 'Tracking by sku' },
                                                            { key: '4', text: 'Tracking by email', value: 'Tracking by email' },
                                                        ]} 
                                                        {...field}
                                                        onChange={(e, { value }) => setFieldValue(field.name, value)}/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Order Price</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="order_price">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input iconPosition='left'>
                                                        <Icon name='dollar' />
                                                        <Cleave {...field} options={{numeral: true,numeralThousandsGroupStyle: 'thousand'}} onChange={handleChange} autoComplete={isoff}/>
                                                    </Input>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Affiliate Earnings</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="aff_earnings">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input iconPosition='left'>
                                                        <Icon name='dollar' />
                                                        <Cleave {...field} options={{numeral: true,numeralThousandsGroupStyle: 'thousand'}} onChange={handleChange} autoComplete={isoff}/>
                                                        <Button
                                                            color='green'
                                                            icon='calculator'
                                                            labelPosition='left'
                                                            content="Calculate"
                                                            style={{margin:'0 0 0 5px'}}
                                                        />
                                                    </Input>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Date</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="date_order">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <div className="date-wrapper">
                                                        <DatePicker 
                                                            selected={date_dummy}
                                                            onChange={date => {
                                                                if(date==null||date==''){
                                                                    setdate_dummy('');
                                                                    setFieldValue('date_order','');
                                                                    return false;
                                                                }
                                                                var fromdate     = moment(new Date(date)).format('MM/DD/YYYY');
                                                                fromdate         = new Date(fromdate);
                                                                setdate_dummy(fromdate);
                                                                setFieldValue('date_order',fromdate);
                                                            }} 
                                                        />
                                                    </div>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Order Status</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                                <Field name="order_status">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Select fluid 
                                                            options={[
                                                                { key: '0', text: 'Paid', value: 'Paid' },
                                                                { key: '1', text: 'Not paid', value: 'Not paid' },
                                                                { key: '2', text: 'Incomplete', value: 'Incomplete' },
                                                                { key: '3', text: 'Cancelled', value: 'Cancelled' },
                                                                { key: '4', text: 'Refunded', value: 'Refunded' },
                                                                { key: '5', text: 'Hidden', value: 'Hidden' },
                                                            ]} 
                                                            {...field}
                                                            onChange={(e, { value }) => setFieldValue(field.name, value)}/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Landing Page</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="landing_page">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="The first page client open, optional"/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Referal Page</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="referal_page">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="From where the client came, optional"/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    

                                    <div className="columns is-mobile">
                                        <div className="column is-one-quarter"><label className="inlinelabel">Notes</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="notes">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <TextArea fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Order notes if neccessary, visible only to you"/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    
						      </Form>
						    </Modal.Content>
						    <Modal.Actions>
						        <div className="positionright">
	                                 <Button
									  loading={spinner}
						              color='black'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and exit"
						              onClick={() => buttonSubmit(1)}
						            />
	                                 <Button
									  loading={spinner}
						              color='blue'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and stay on modal"
						              onClick={() => buttonSubmit(2)}
						            />
									<button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
								</div>
						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}