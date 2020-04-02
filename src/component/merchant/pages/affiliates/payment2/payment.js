import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import { Formik, Field } from 'formik'

import {Spinning} from '../../../../include/circlespin'

import PaypalCheckout from './paypal'
import DatePicker from "react-datepicker"
import moment from 'moment'
import Cleave from 'cleave.js/react'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'
import {windowReload,returnUrl} from '../../../../include/merchant_redirect'
import {UserContext} from '../../../layout/userContext'

import {affiliateid} from '../../../../include/queryurl'
import logo from '../../../../../assets/image/logoblack.jpg'

export default function ToaffiliatePayment(props) {

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
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

  const [spinner, setspinner] = useState(false);
  const [list, setlist] = useState([]);
  const [info, setinfo] = useState({});
  function UnpaidOrder(){
    if(affiliateid()==null){returnUrl('mrcaffiliates/active');}
    setspinner(true);
    let formData = new FormData();
    formData.append('type','affiliate_unpaidorder');
    formData.append('id',affiliateid());
    axios.post('/merchant/affiliate/request.php',formData)
    .then(function (response) {
        let obj = response.data;
				setspinner(false);
				setinfo(obj.info);
				if(obj.list.length==0){return false;}
        setlist(obj.list);
    })
    .catch(function (error) {
        console.log(error);
    });
  }


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
		comments2:''
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

  function SuccessPaymentProcess(data,info){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_paymentus');
		formData.append('info',JSON.stringify(info));
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setspinner(false);
			if(obj==1){
				setsuccess(true);
				setTimeout(function(){ windowReload() }, 2000);
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
    UnpaidOrder();
		checkpaymentpaypal();
  },[]);



	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column segment-title">
															<h2>{info.name}</h2>
															<p>Earnings information about affiliate # {affiliateid()}</p>
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
                          <Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payment/?affiliate='+affiliateid()}><Icon name='file alternate outline'/>Unpaid Earnings</Menu.Item>
                          <Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory/?affiliate='+affiliateid()}><Icon name='calendar alternate outline'/>Payment History</Menu.Item>
                        </Menu>
                    </div>
                </div>


                {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Congratulations! Payment sucessfully process'/>}
								{list.length==0&&<div className="noearnings">
										<Message
											warning
											icon='info circle'
											header='No earnings yet to pay for this affiliate'
											content= 'We found that affiliate are no earnings yet to pay. Unpaid earnings are automatically shown below if they had.'
										/>
								</div>}

                {list.length>0&&<div className="wrapper-affpayment">
									  {spinner&&Spinning()}
                    <div className="invoice-description">
                        <Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Date Order</Table.HeaderCell>
                              <Table.HeaderCell>Order ID</Table.HeaderCell>
                              <Table.HeaderCell>Tracking</Table.HeaderCell>
                              <Table.HeaderCell>Order Price</Table.HeaderCell>
                              <Table.HeaderCell>Earnings</Table.HeaderCell>
                              <Table.HeaderCell>Total</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {list.map(function(data, key){
                              return <Table.Row key={key}>
                                  <Table.Cell>{data.date_order}</Table.Cell>
                                  <Table.Cell>{data.order_id}</Table.Cell>
                                  <Table.Cell>{data.tracking_method}</Table.Cell>
                                  <Table.Cell>{data.order_price}</Table.Cell>
                                  <Table.Cell>{data.aff_earnings}</Table.Cell>
                                  <Table.Cell>{data.aff_earnings}</Table.Cell>
                              </Table.Row>
                            })}
                          </Table.Body>
                          <Table.Footer>
                            <Table.Row>
                              <Table.HeaderCell className="totalfooter" textAlign='right' colSpan='5'>Total:</Table.HeaderCell>
                              <Table.HeaderCell className="totalfooter">{info.total}</Table.HeaderCell>
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
																	id:affiliateid(),
																	payment_date:moment(new Date(values.payment_date)).format('YYYY-MM-DD'),
																	comments1:values.comments1,
																	comments2:values.comments2,
																}
																SuccessPaymentProcess(data,getvalue);
															}

															function manualpay(){
																const getvalue = {
																	id:affiliateid(),
																	payment_date:moment(new Date(values.payment_date)).format('YYYY-MM-DD'),
																	comments1:values.comments1,
																	comments2:values.comments2,
																}
																SuccessPaymentProcess('',getvalue);
															}

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
																				price={info.total_int}
																				callbackSuccess={SuccessPayment}
																				callbackCancel={CancelPayment}
																				callbackError={ErrorPayment}
																				clientid={clientid}/>
																		</div>
																	</div>}

																	{/*<Button className="green" onClick={()=>manualpay()}>Dummy Pay Button (For Testing Purposes)</Button>*/}
																</div>


													)}}/>

                    </div>
                  </div>}

            </div>
		</React.Fragment>
	)
}
