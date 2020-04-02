import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import { Formik, Field } from 'formik'

import {Spinning} from '../../../../include/circlespin'

import PaypalCheckout from './paypal'
import DatePicker from "react-datepicker"
import moment from 'moment'
import Cleave from 'cleave.js/react'

import AlertModal from './alertmodal'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'
import {windowReload,returnUrl} from '../../../../include/merchant_redirect'
import {UserContext} from '../../../layout/userContext'

import {affiliateid,id,month,year} from '../../../../include/queryurl'
import logo from '../../../../../assets/image/logoblack.jpg'


export default function AffPaymentTotal(props) {

	  /* User Context */
	const usersContext = useContext(UserContext);
	let stafflog	 		 = 0;
  let view_aff 			 = true;
	let view_edit 		 = true;
	let view_pay 			 = true;
	let view_delete 	 = true;
	if(usersContext){
		  stafflog	 				= usersContext.stafflog;
			if(stafflog!=0){
				view_aff  		  = usersContext.staff_permission.affiliate.view=='true'?true:false;
				view_edit  		  = usersContext.staff_permission.affiliate.edit=='true'?true:false;
				view_pay  		  = usersContext.staff_permission.affiliate.pay=='true'?true:false;
				view_delete  		= usersContext.staff_permission.affiliate.delete=='true'?true:false;
			}
	}

  /* Spinner and Alert */
	const [alermodal,setalermodal] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

  const [spinner, setspinner] = useState(false);

	/* For Paypal */
	const [ispaypal, setispaypal] = useState(false);
	const [clientid, setclientid] = useState('');
	function checkpaymentpaypal(){
		let formData = new FormData();
		formData.append('type','merchant_ispaypal');
		axios.post('/merchant/account/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){return false;}
			if(obj.is_live=='true'||obj.is_live==1){setispaypal(true);}
			setclientid(obj.paypal_clientid);
		})
		.catch(function (error) {return false;});
	}



	/* Information Payment Processing*/
	const [state, setstate] = useState({
		id:affiliateid(),
    payment_date:new Date(),
		comments1:'',
		comments2:'',
		orderid:'',
		transactionid:'',
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		/*const getvalue = {
			id:affiliateid(),
			payment_date:moment(new Date(values.payment_date)).format('YYYY-MM-DD'),
			comments1:values.comments1,
			comments2:values.comments2,
		}*/
		/*setbtnspin(true);

		let formData = new FormData();
		formData.append('type','merchant_affaddedsum');
		formData.append('info',JSON.stringify(getvalue));
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				showalert('You have successfully added sum');
			}
			setbtnspin(false);
			if(obj==0){resetForm();seterror(true);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});*/
   }


  const [listpay, setlistpay] = useState([]);
	const [infopay, setinfopay] = useState({});
	function listdetailspayment(){
		if((month()==null||month()=='')||(year()==null||year()=='')){
			returnUrl('mrcaffiliates/affpayment');
			return false;
		}
		setspinner(true);
		let formData = new FormData();
		formData.append('type','listpayment_details');
		formData.append('month',month());
		formData.append('year',year());
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj.list.length==0){
				returnUrl('mrcaffiliates/affpayment');
				return false;
			}
			setlistpay(obj.list);
			setinfopay(obj.info);
			setspinner(false);

		})
		.catch(function (error) {
			setspinner(true);
			return false;
		});
	}

  function SuccessPaymentProcess(data,info){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_paymentprocessing');
		formData.append('info',JSON.stringify(info));
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setspinner(false);
			if(obj==1){
				//setsuccess(true);
				setalermodal(true);
				//setTimeout(function(){ returnUrl('mrcaffiliates/affpayment') }, 2000);
			}else{

			}
		})
		.catch(function (error) {
			setspinner(true);
			return false;
		});
	}
	function CancelPayment(data){
	}
	function ErrorPayment(data){
	}


  useEffect(()=>{
		listdetailspayment();
		checkpaymentpaypal();
  },[]);



	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">

                <div className="table-action bottommargin">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column segment-title">
															<h2>Payment Details</h2>
															<p>For the month of {infopay.month}</p>
														</div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}><Icon name='arrow alternate circle left outline' /> Back to Affiliate</Button>
                                </div>
                            </div>
                        </div>
                    </div>
										<div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'}><Icon name='calendar alternate outline'/>Monthly Payment</Menu.Item>
                            <Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'}><Icon name='copy outline'/>Payment History</Menu.Item>
                        </Menu>
                    </div>
                </div>

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Congratulations! Payment sucessfully process'/>}

								{listpay.length>0&&<Message
									warning
									icon='info circle'
									header='Paying earnings monthly'
									content='It is best way to pay unpaid earnings after the end of the month so that only one(1) Invoice generate on specific month'
								/>}

                {listpay.length>0&&<div className="wrapper-affpayment">
									  {spinner&&Spinning()}
                    <div className="invoice-description">
                        <Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Month</Table.HeaderCell>
                              <Table.HeaderCell>Affiliate</Table.HeaderCell>
                              <Table.HeaderCell>Unpaid Earnings</Table.HeaderCell>
                              <Table.HeaderCell>Total</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {listpay.map(function(data, key){
                              return <Table.Row key={key}>
                                  <Table.Cell>{data.month}</Table.Cell>
                                  <Table.Cell>{data.name}</Table.Cell>
                                  <Table.Cell>{data.total}</Table.Cell>
                                  <Table.Cell>{data.total}</Table.Cell>
                              </Table.Row>
                            })}
                          </Table.Body>
                          <Table.Footer>
                            <Table.Row>
                              <Table.HeaderCell className="totalfooter" textAlign='right' colSpan='3'>Amount to Pay:</Table.HeaderCell>
                              <Table.HeaderCell className="totalfooter">{infopay.total}</Table.HeaderCell>
                            </Table.Row>
                          </Table.Footer>
                        </Table>

													<Formik
								 	            initialValues={state}
								 	            onSubmit={handleSubmitForm}
								 	            render={formProps => {
								 	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps


															function SuccessPayment(data){
																const getvalue = {
																	month:month(),
																	year:year(),
																	payment_date:moment(new Date(values.payment_date)).format('YYYY-MM-DD'),
																	comments1:values.comments1,
																	comments2:values.comments2,
																	orderid:data.orderID,
																	transactionid:data.orderID
																}
																SuccessPaymentProcess(data,getvalue);
															}

															/*function manualpay(){
																const getvalue = {
																	id:affiliateid(),
																	payment_date:moment(new Date(values.payment_date)).format('YYYY-MM-DD'),
																	comments1:values.comments1,
																	comments2:values.comments2,
																}
																SuccessPaymentProcess('',getvalue);
															}*/

								 		          return(
															  <div className="formpayment">
																	<Form>
																		<Form.Group widths='equal'>
																			<Field name="payment_date">
																				{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<label>Payment Date</label>
																					<div className="date-wrapper">
																						<DatePicker
																							showMonthDropdown
																							showYearDropdown
																							selected={values.payment_date}
																							name="payment_date"
																							{...field}
																							onChange={date => setFieldValue('payment_date',date)}
																							placeholderText="Enter date"/>
																						</div>
																						{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																				)}
																			</Field>
																		</Form.Group>
																		<Form.Group widths='equal'>
																			<Field name="comments1">
																				{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<label>Comments</label>
																					<TextArea {...field} onChange={handleChange} placeholder='Enter comments here'/>
																					{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i className="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																				)}
																			</Field>
																		</Form.Group>
																		<Form.Group widths='equal'>
																			<Field name="comments2">
																				{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					<label>Admin Comments</label>
																					<TextArea {...field} onChange={handleChange} placeholder='Comments visible only to you'/>
																					{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i className="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				</Form.Field>
																				)}
																			</Field>
																		</Form.Group>
																	</Form>


																	{ispaypal&&<div className="paypalbutton">
																		<Message
																			positive
																	    icon='shield'
																	    header='Payment Secured'
																	    content= 'You will redirected to paypal secured website'
																	  />
																		<div className="paywrapper">
																			<PaypalCheckout
																				price={infopay.total_int}
																				callbackSuccess={SuccessPayment}
																				callbackCancel={CancelPayment}
																				callbackError={ErrorPayment}
																				clientid={clientid}/>
																		</div>
																	</div>}


																</div>


													)}}/>

                    </div>
                  </div>}

									{alermodal&&<AlertModal/>}

            </div>
		</React.Fragment>
	)
}
