import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Button, Icon, Label, Form, Input, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {shopifyvalidation} from './validate'
import AlertSuccess from '../../include/alertsuccess'
import AlertError from '../../include/alerterror'
import {windowReload,returnUrl,shopifyinstallurl} from '../../include/merchant_redirect'
import {Spinning} from '../../include/circlespin'


import Logo from '../../../assets/image/logo.png'
import Shopify from '../../../assets/image/shopify.png'
import Shopify2 from '../../../assets/image/apps/shopify-logo.png'

import '../../../assets/css/merchant.css'


export default function ShopifyRegister(props) {

	/*------- alert message and spinner--------- */

	const [spinner, setspinner] = useState(false);

	/*-------- Form Data--------------------- */
	const [state, setstate] = useState({
		shopify_url:''
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		shopifyinstallurl(values.shopify_url+'.myshopify.com');
	}

	/* Check Login Merchant */
	const [iswait,setiswait] = useState(false);
	function isMerchantLogin(){
		setiswait(true);
		let formData = new FormData();
		formData.append('type','merchant_islogin');
		axios.post('/merchant/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setiswait(false);
			if(obj!=0){returnUrl('dashboard');}
		})
		.catch(function (error) {setiswait(false);return false;});
	}

	useEffect(()=>{
		isMerchantLogin();
	},[]);


	return (
		<div className="register-wrapper">
			{iswait&&Spinning()}
			<div className="topheading">
				<div className="register-grid">
					<div className="columns is-mobile is-vcentered">
						<div className="column"><a href={process.env.PUBLIC_URL+'/'}><img src={Logo}/><span>Hivefiliate</span></a></div>
						<div className="column is-clearfix">
							<div className="position-right">
								<Button as="a" href={process.env.PUBLIC_URL+'/signup'} className='blue'>Register</Button>
								<Button as="a" href={process.env.PUBLIC_URL+'/login'} className='green' icon><Icon name='lock' /> Login</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="register-form">
				<div className="register-grid">

					<div className="columns registration">
						<div className="column information">
							<div className="inside-padding">
								<h2>Start your 14-day free trial</h2>
								<p>Best for businesses new or just getting started with affiliate marketing and have a stable amount of affiliates & sales.</p>
								<ul>
									<li><Icon name='check circle'/>Unlimited affiliates.</li>
									<li><Icon name='check circle'/>Unlimited visits and clicks.</li>
									<li><Icon name='check circle'/>Dedicated, onsite support staff.</li>
									<li><Icon name='check circle'/>Free Test Account for Shopify Partners</li>
									<li><Icon name='check circle'/>Set commission by product or SKU</li>
									<li><Icon name='check circle'/>Track sales with coupon codes, emails, and SKUs</li>
									<li><Icon name='check circle'/>Custom reporting</li>
									<li><Icon name='check circle'/>Integration assistance</li>
								</ul>
							</div>
						</div>
						<div className="column register-input">
							<div className="inside-padding">
							  <img src={Shopify2}/>
								<h2>Integrate your Shopify store</h2>
								<Formik
									initialValues={state}
									validationSchema={shopifyvalidation}
									onSubmit={handleSubmitForm}
									render={formProps => {
									const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
									return(
										<Form>
											<Form.Group widths='equal'>
												<Field name="shopify_url">
													{({ field, form }) => (
													<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
														<label>Enter Your Shopify Subdomain</label>
														<Input fluid
														  {...field}
														  onChange={handleChange}
															placeholder="storename"
															label={{ content: '.myshopify.com' }}
    													labelPosition='right'
															/>
														{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
													</Form.Field>
													)}
												</Field>
											</Form.Group>
											<Button className='blue' loading={spinner} size='big' icon onClick={handleSubmit}>Continue the process <Icon name='arrow alternate circle right outline' /></Button>
										</Form>

								)}}/>
							</div>
						</div>
					</div>
					<p className="copyright onform"><a href={process.env.PUBLIC_URL+'/'}>Hivefiliate All</a> © Copyright by . All Rights Reserved.</p>
				</div>
			</div>
		</div>
	)
}
