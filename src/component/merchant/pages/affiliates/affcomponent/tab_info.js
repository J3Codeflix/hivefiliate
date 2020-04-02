import React,{useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'
import axios from 'axios'
import Cleave from 'cleave.js/react'

import PaypalLogo from '../../../../../assets/image/paypal.png'
export default function TabInfo(props) {

	/* -------- Scroll to Top ------------------------*/
	function scrollToTop(){
			document.querySelector('body').scrollTop = 0;
	}

	const [spinner, setspinner] = useState(false);
	const [data, setdata]= useState({});

	const [btnspin, setbtnspin] = useState(false);
	const [isoff, setisoff] = useState('off');
	const [state, setstate] = useState({
		id:0,
		first_name:'',
		last_name:'',
		min_payment:'',
		com_percent:'',
		cookie_duration:'',
		merchant_notes:'',
		type_com:1,
		flat_rate:'',
		coupon_code:'',
		type_discount:'',
		discount_description:''
	});

	/* Spinner and Alert */
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}


	function reloadlist(){
		props.reloadTrigger(true);
	}
	function showalert(text){
		reloadlist();
		props.showAlertMessage(true);
		props.messageAlert(text);
		props.closeTrigger(false);
	}

	function AffInfo(){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_affinformation');
        formData.append('id',props.idffiliate);
        axios.post('/merchant/affiliate/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setdata({
							name:obj.name,
							email:obj.email,
							afflink:obj.aff_links,
							dateaff:obj.dateadded,
							notes:obj.merchant_notes,
							status:obj.status,
							paypal_email:obj.paypal_email
						});
						setstate({
							...state,
							id:props.idffiliate,
							first_name:obj.first_name,
							last_name:obj.last_name,
							merchant_notes:obj.merchant_notes,
							min_payment:obj.min_payment,
							com_percent:obj.com_percent,
							cookie_duration:obj.cookie_duration,
							type_com:obj.type_com,
							flat_rate:obj.flat_rate,
							coupon_code:obj.coupon_code,
							type_discount:obj.type_discount,
							discount_description:obj.discount_description
						});
						setspinner(false);
        })
        .catch(function (error) {});
	}

    /* Save update infor */
	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
			setbtnspin(true);
			CloseAlert(false);
			let formData = new FormData();
			formData.append('type','merchant_updateaffinfo');
			formData.append('info',JSON.stringify(values));
			axios.post('/merchant/affiliate/request.php',formData)
			.then(function (response) {
				let obj = response.data;
				if(obj==1){
					setsuccess(true);
					reloadlist();
					scrollToTop();
				}
				setbtnspin(false);
				if(obj==0){resetForm();seterror(true);return false;}
				Object.keys(obj).forEach(function(key) {setErrors(obj)});
			})
			.catch(function (error) {resetForm();seterror(true);return false;});
   }

   /* Delete Affiliate */
   const [spindelet, setspindelet] = useState(false);
   function deleteAffiliate(){
		setspindelet(true);
		let formData = new FormData();
		formData.append('type','merchant_deleteaffiliate');
		formData.append('id',props.idffiliate);
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				showalert('Affiliate successfully Deleted');
			}
			setspindelet(false);
			if(obj==0){return false;}
		})
		.catch(function (error) {return false;});
   }


	 /*--------------- Status Affiliate------------------------------------------------- */
	 const [spinstatus, setspinstatus] = useState(false);
   function AffChangeStatus(stat){
		setspinstatus(true);
		let formData = new FormData();
		formData.append('type','merchant_affstatus');
		formData.append('id',props.idffiliate);
		formData.append('status',stat);
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				if(stat=='is_block'){showalert('Affiliate successfully block');}
				if(stat=='is_denied'){showalert('Affiliate successfully denied application');}
				if(stat=='is_active'){showalert('Affiliate successfully accepted application');}
				if(stat=='is_deleted'){showalert('Affiliate successfully deleted temporarily, If this is a mistake then you can recover it. Just goto the deleted affiliates.');}
				if(stat=='is_deletedmerpanently'){showalert('Affiliate successfully deleted completely including the associated information.');}
			}
			setspinstatus(false);
		})
		.catch(function (error) {return false;});
   }

	 function DeletePermanently(status){
		 setspinstatus(true);
		 let formData = new FormData();
		 formData.append('type','merchant_affdeleteCompletly');
		 formData.append('id',props.idffiliate);
		 formData.append('status',status);
		 axios.post('/merchant/affiliate/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 if(obj==1){
				 showalert('Affiliate successfully deleted completely including the associated information.');
			 }
			 setspinstatus(false);
		 })
		 .catch(function (error) {return false;});
	 }

	useEffect(()=>{
		AffInfo();
	},[]);

	return (
		<div className={spinner?'tablsegment ui bottom attached segment active tab loading':'tablsegment ui bottom attached segment active tab'}>
			{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Affiliate information successfully updated'/>}
			{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Affiliate failed to update information'/>}
			<Formik
			    enableReinitialize
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<div className="tab-wrapper">
							<Form>
								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"><h2>ID</h2></div>
									<div className="column iscontent">{props.idffiliate}</div>
								</div>
								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"><h2>Name</h2></div>
									<div className="column iscontent">
										<Form.Group widths='equal'>
											<Field name="first_name">
												{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
													<label>First Name</label>
													<Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder='Enter first name'/>
													{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
												</Form.Field>
												)}
											</Field>
										</Form.Group>
										<Form.Group widths='equal'>
											<Field name="last_name">
												{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
													<label>Last Name</label>
													<Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder='Enter last name'/>
													{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
												</Form.Field>
												)}
											</Field>
										</Form.Group>
									</div>
								</div>


								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"><h2>Email</h2></div>
									<div className="column iscontent">{data.email}</div>
								</div>

								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"><h2>Cookie Duration</h2></div>
									<div className="column iscontent">
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
											</Form>
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
														<Field name="type_com">
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
										<h2>Percent from purchase via tracking</h2>
										<h3>(used when the comission is % from the order and for orders made from clients referred by affiliate's link)</h3>
									</div>
									<div className="column iscontent">
										<Form>

											<Form.Group widths='equal'>
													<Field name="com_percent">
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

										</Form>
									</div>
								</div>


								<div className="columns iscolumns is-mobile">
										<div className="column is-one-third">
												<h2>Coupon code</h2>
												<h3>This coupon will able to track sales</h3>
										</div>
										<div className="column iscontent">
												<Form>
														<Form.Group widths='equal'>
																<Field name="coupon_code">
																		{({ field, form }) => (
																		<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																		    <label>Enter Coupon Code</label>
																				<Input
																						fluid
																						{...field}
																						onChange={handleChange}
																						/>

																				{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				<div className="textdescription text-blur">Avoid any special character on coupon code</div>
																		</Form.Field>
																		)}
																</Field>
														</Form.Group>
														<Form.Group widths='equal'>
																<Field name="type_discount">
																		{({ field, form }) => (
																				<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																					  <label>Type Discount</label>
																						<Select
																								fluid
																								selectOnBlur={false}
																								options={[
																										{key:'1',text:'Percentage',value:'Percentage'},
																										{key:'2',text:'Fix Amount',value:'Fix Amount'},
																										{key:'3',text:'Free Shipping',value:'Free Shipping'},
																										{key:'4',text:'Buy X get Y',value:'Buy X get Y'}
																								]}
																								{...field}
																								onChange={(e, { value }) => {
																									setFieldValue(field.name, value);
																								}}/>
																								<div className="textdescription text-blur">When you create discount code on shopify you will see the specific type details. For more info kindly visit the link: <a href="https://help.shopify.com/en/manual/promoting-marketing/discount-codes/create-discount-codes" target="_blank">https://help.shopify.com/en/manual/promoting-marketing/discount-codes/create-discount-codes</a></div>
																						{ form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
																				</Form.Field>
																		)}
																</Field>
														</Form.Group>
														<Form.Group widths='equal'>
																<Field name="discount_description">
																		{({ field, form }) => (
																		<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
																		    <label>Description</label>
																				<TextArea
																						fluid
																						{...field}
																						onChange={handleChange}
																						/>

																				{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
																				<div className="textdescription text-blur">Please indicate the details about the coupon code for the affiliate</div>
																		</Form.Field>
																		)}
																</Field>
														</Form.Group>
												</Form>
										</div>
								</div>




								{/*<div className="columns iscolumns is-mobile">
									<div className="column is-one-third">
										<h2>Minimum payment sum</h2>
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
								</div>*/}

								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third">
										<h2>Prefered Payment Method</h2>
										<h3>Affiliate paypal email</h3>
										<img src={PaypalLogo}/>
									</div>
									<div className="column iscontent">
										{data.paypal_email}
									</div>
								</div>

								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third">
										<h2>Affiliate's referal link</h2>
										<h3>(also visible on the Information page in the affiliate's panel)</h3>
									</div>
									<div className="column iscontent">{data.afflink}</div>
								</div>


								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"><h2>Date of first referred visit</h2></div>
									<div className="column iscontent">{data.dateaff}</div>
								</div>
								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third">
										<h2>Notes</h2>
										<h3>(visible only to you)</h3>
									</div>
									<div className="column iscontent">
										<Form.Group widths='equal'>
											<Field name="merchant_notes">
												{({ field, form }) => (
												<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
													<TextArea fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder='Enter notes'/>
													{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
												</Form.Field>
												)}
											</Field>
										</Form.Group>
									</div>
								</div>


								<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"></div>
									<div className="column iscontent">

										  {data.status=='is_active'&&props.edit==true&&<Button className='red' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_block')}><Icon name='lock' /> Block Affiliate</Button>}

											{data.status=='is_pending'&&<React.Fragment>
												 {props.edit==true&&<Button className='green' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_active')}><Icon name='check circle outline' /> Accept Affiliate</Button>}
												 {props.edit==true&&<Button className='red' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_denied')}><Icon name='dont' /> Denied Affiliate</Button>}
												</React.Fragment>
											}
											{data.status=='is_denied'&&<React.Fragment>
												{props.edit==true&&<Button className='green' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_active')}><Icon name='check circle outline' /> Accept Affiliate</Button>}
												{props.edit==true&&<Button className='red' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_block')}><Icon name='lock' /> Block Affiliate</Button>}
												</React.Fragment>
											}
											{data.status=='is_block'&&<React.Fragment>
												{props.edit==true&&<Button className='green' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_active')}><Icon name='check circle outline' /> Accept Affiliate</Button>}
												</React.Fragment>
											}

											{data.status=='is_deleted'&&<React.Fragment>
												{props.edit==true&&<Button className='green' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_active')}><Icon name='check circle outline' /> Accept Affiliate</Button>}
												{props.delete==true&&<Button className='red' icon loading={spinstatus} onClick={()=>DeletePermanently('single')}><Icon name='lock' /> Delete Permanently</Button>}
												</React.Fragment>
											}

											{data.status!='is_deleted'&&props.delete==true&&<Button className='red' icon loading={spinstatus} onClick={()=>AffChangeStatus('is_deleted')}><Icon name='trash alternate outline' /> Delete</Button>}

									</div>
								</div>

								{props.edit==true&&<div className="columns iscolumns is-mobile">
									<div className="column is-one-third"></div>
									<div className="column iscontent">
										<Button className='blue' icon onClick={handleSubmit} loading={btnspin}><Icon name='save outline' /> Save Information</Button>
									</div>
								</div>}

							</Form>
						</div>
				 )}}/>
        </div>
	)
}
