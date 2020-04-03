import React, { useState, useEffect, useContext } from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Checkbox, Message, Modal, Header, Icon, Image, Radio } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

import axios from 'axios'

import PaypalCheckout from './paypal'
import renderHTML from 'react-render-html'
import NumberFormat from 'react-number-format'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'

import { UserContext } from '../../layout/userContext'
import { Spinning } from '../../../include/circlespin'

import { ProgramAffLink } from '../../../include/merchant_redirect'
import AlertModal from './alertmodal'

import { windowReload, returnUrl } from '../../../include/merchant_redirect'

import PaypalLogo from '../../../../assets/image/paypal-logo.png'

export default function AccountPlan(props) {

	const usersContext = useContext(UserContext);

	let store_id = null;
	let store_email = null;
	let storename = null;
	let username = null;
	let merchant_id = null;
	let date_expiration = null;
	let priceplan = 79;
	let currency = null;
	let prtotal = null;
	let type_platform = '';

	if (usersContext) {
		storename = usersContext.store_name;
		username = usersContext.username;
		merchant_id = usersContext.merchant_id;
		store_id = usersContext.id;
		store_email = usersContext.email;
		date_expiration = usersContext.date_expiration;

		priceplan = usersContext.pricing_plan.price_professional;
		prtotal = usersContext.pricing_plan.pro_price;
		currency = usersContext.pricing_plan.currency;
		type_platform = usersContext.type_platform;
	}

	const [state, setstate] = useState({
		type_plan: 2,
		subs_plan: 1,
		pay_method: 1,
	});

	const [alertmode, setalertmodal] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data) {
		setsuccess(data);
		seterror(data);
	}

	const [spinner, setspinner] = useState(false);

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }) {
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type', 'merchant_paymentprocess');
		formData.append('info', JSON.stringify(values));
		axios.post('/merchant/account/request.php', formData)
			.then(function (response) {
				let obj = response.data;
				setspinner(false);
				if (obj == 1) { setsuccess(true); return false; }
				if (obj == 0) { seterror(true); return false; }
				Object.keys(obj).forEach(function (key) { setErrors(obj) });
			})
			.catch(function (error) { resetForm(); return false; });
	}

	function ConfirmSubmitForm(values) {
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type', 'merchant_paymentprocess');
		formData.append('info', JSON.stringify(values));
		axios.post('/merchant/account/request.php', formData)
			.then(function (response) {
				let obj = response.data;
				setspinner(false);
				if (obj == 1) {
					setalertmodal(true);
					//setsuccess(true);
					return false;
				}
				if (obj == 0) { seterror(true); return false; }
				//Object.keys(obj).forEach(function(key) {setErrors(obj)});
			})
			.catch(function (error) { return false; });
	}



	const [datadesc, setdatadesc] = useState('');
	const [datatotal, setdatatotal] = useState('');
	const [totalpay, settotalpay] = useState(0);

	function ComputePlan(plan, sub, price, curr) {

		if (plan == 2) {
			var price = price;
			var subtotal = price * sub;
			var total = subtotal;
		}

		settotalpay(total);
		var totalall = curr + total.toFixed(2);
		setdatatotal(totalall);
		if (sub == 1) { setdatadesc('Professional Plan - 1 month subscription'); }
		if (sub == 12) { setdatadesc('Professional Plan - 1 year subscription'); }
		if (sub == 24) { setdatadesc('Professional Plan - 2 years subscription'); }
	}

	const [ispaypal, setispaypal] = useState(false);
	const [clientid, setclientid] = useState(null);
	function checkpaymentpaypal() {
		let formData = new FormData();
		formData.append('type', 'merchant_ispaypal');
		axios.post('/merchant/account/request.php', formData)
			.then(function (response) {
				let obj = response.data;
				if (obj == 0) { return false; }
				if (obj.is_live == 'true' || obj.is_live == 1) { setispaypal(true); }
				setclientid(obj.paypal_clientid);
				console.log(obj.paypal_clientid);
			})
			.catch(function (error) { return false; });
	}


	function CancelPayment(data) {
	}
	function ErrorPayment(data) {
	}

	useEffect(() => {
		checkpaymentpaypal();
	}, []);

	return (
		<React.Fragment>
			<Formik
				enableReinitialize
				initialValues={state}
				onSubmit={handleSubmitForm}
				render={formProps => {
					const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps

					ComputePlan(values.type_plan, values.subs_plan, priceplan, currency);
					function SuccessPayment(data) {
						setspinner(true);
						ConfirmSubmitForm(values);
					}


					if (type_platform == 'shopify') {
						returnUrl('account');
						return false;
					}


					return (
						<div className="account-plan pagecontent">
							<h1>Payment Subscription</h1>
							{spinner && Spinning()}
							{successmsg && <AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Congratulations! Payment successfully process.' />}
							{errormsg && <AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Payment not successfully process. Contact us for more information.' />}
							<div className="columns">

								{/* ----------------left side  Pricing summary-------------------------*/}
								<div className="column">
									<Message
										icon='info circle'
										warning
										header='PRICING PLAN DETAILS'
										list={[
											'Professional Plan: Unlimited Activities Track, Unlimited Activities Track, Extensive Settings',
											'Enterprise Plan: Best for businesses who need customized tracking and functionality to support large partner channels and referral networks. You need to contact us for this plan.',
										]}
									/>
									<div className="pricingpanel">
										<div className="pricingheader">Professional Plan</div>
										<div className="pricingbody">
											<div className="columns is-mobile is-vcentered">
												<div className="column">
													<Form>
														<Form.Field>
															<Radio
																label='1 month subscription'
																name='radioGroup'
																value='1'
																checked={values.subs_plan === 1}
																onChange={() => {
																	ComputePlan(2, 1, priceplan, currency);
																	setFieldValue('subs_plan', 1);

																}}
															/>
														</Form.Field>
													</Form>
												</div>
												<div className="column is-one-quarter planprice"><span>{prtotal}</span>/month</div>
											</div>
										</div>

										{/*<div className="pricingbody">
															 <div className="columns is-mobile is-vcentered">
																 <div className="column">
																	 <Form>
																		 <Form.Field>
																			 <Radio
																				 label='1 year subscription'
																				 name='radioGroup'
																				 value='12'
																				 checked={values.subs_plan === 12}
																				 onChange={()=>{

																					 ComputePlan(2,12,priceplan,currency);
																					 setFieldValue('subs_plan',12);

																				 }}
																			 />
																		 </Form.Field>
																	 </Form>
																 </div>
																 <div className="column is-one-quarter planprice"><span>{prtotal}</span>/month</div>
															 </div>
													 </div>
													 <div className="pricingbody">
															<div className="columns is-mobile is-vcentered">
																<div className="column">
																	<Form>
																		<Form.Field>
																			<Radio
																				label='2 year subscription'
																				name='radioGroup'
																				value='24'
																				checked={values.subs_plan === 24}
																				onChange={()=>{

																					ComputePlan(2,24,priceplan,currency);
																					setFieldValue('subs_plan',24);

																				}}
																			/>
																		</Form.Field>
																	</Form>
																</div>
																<div className="column is-one-quarter planprice"><span>{prtotal}</span>/month</div>
															</div>
													</div>*/}
									</div>

									<div className="pricingpanel">
										<div className="pricingheader">Enterprise Plan</div>
										<div className="pricingbody">
											<Message
												positive
												content='Best for businesses who need customized tracking and functionality to support large partner channels and referral networks. You need to contact us for this plan.'
											/>
											{/*<div className="text-center"><Button className="blue" content='Contact us for this plan' icon='right arrow' labelPosition='right' /></div>*/}
										</div>
									</div>


								</div>
								{/* ----------------left side  Pricing summary end-------------------------*/}

								{/* ----------------Right side order summary -------------------------*/}
								<div className="column is-two-fifths">
									<div className="pricingpanel">
										<div className="pricingheader">Payment Method</div>
										<div className="pricingbody">
											<div className="columns is-mobile is-vcentered">
												<div className="column">
													<Form>
														<Form.Field>
															<Radio
																label='Paypal'
																name='radioGroupPayment'
																value='1'
																checked={values.pay_method === 1}
																onChange={() => setFieldValue('pay_method', 1)}
															/>
														</Form.Field>
													</Form>
												</div>
												<div className="column is-one-quarter"><img src={PaypalLogo} /></div>
											</div>
										</div>
									</div>

									<div className="pricingpanel">
										<div className="pricingheader">Order Summary</div>
										<div className="pricingbody orderitem">
											<div className="columns is-mobile">
												<div className="column"><h2>{datadesc}</h2></div>
												<div className="column is-one-quarter"><span>{datatotal}</span></div>
											</div>
										</div>

										<div className="pricingbody ordersubtotal">
											<div className="columns is-mobile">
												<div className="column"><h2>Subtotal</h2></div>
												<div className="column is-one-quarter"><span>{datatotal}</span></div>
											</div>
										</div>

										<div className="pricingbody ordertotal">
											<div className="columns is-mobile">
												<div className="column"><h2>Total</h2></div>
												<div className="column is-one-quarter"><span>{datatotal}</span></div>
											</div>
										</div>
									</div>

									{ispaypal && <Message positive visible><Icon name='lock' /> You will be redirected to paypal secured website.</Message>}
									{ispaypal == false && <Message negative visible><Icon name='info circle' /> Paypal payment is not available. Please contact us for more information.</Message>}

									{ispaypal && <div className="paybutton-wrapper">
										<PaypalCheckout
											price={totalpay}
											callbackSuccess={SuccessPayment}
											callbackCancel={CancelPayment}
											callbackError={ErrorPayment} />
									</div>}

									{/*<Button className="blue" content='Manual Pay' icon='right arrow' labelPosition='right' onClick={()=>SuccessPayment()}/>*/}


								</div>
								{/* ----------------Right side order summary end-------------------------*/}

							</div>
							{alertmode && <AlertModal />}
						</div>

					)
				}} />
		</React.Fragment>
	)
}
