import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import {getvalidations} from './validate'
import {shopifyinstallurl} from '../../../../include/merchant_redirect'
import axios from 'axios'
export default function EasyShopify(props) {

    const [spinner, setspinner] = useState(false);
	const [isoff, setisoff] = useState('off');
	const [state, setstate] = useState({
		shopify_store:''
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_installshopify');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/integration/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				shopifyinstallurl(values.shopify_store+'.myshopify.com');
			}
			if(obj==0){resetForm();return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();return false;});
   }

	const list = [
		'Do not include https, http, www or extension of shopify store.',
		'If your shopify url is yourstorename.myshopify.com, Just enter "yourstorename" only.',
	]

	return (
		<React.Fragment>
	        <div class="ui bottom attached segment active tab">
					<Formik
					initialValues={state}
					validationSchema={getvalidations}
					onSubmit={handleSubmitForm}
					render={formProps => {
					const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
					return(<div className="tab-wrapper">
						<Message
							icon='info circle'
							warning
							header='Integrate Shopify'
							list={list}
						/>
						<Form>
							<Form.Group widths='equal'>
								<Field name="shopify_store">
								{({ field, form }) => (
									<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
									<Input
										fluid
										action={{
											color: 'blue',
											labelPosition: 'right',
											icon: 'cloud upload',
											content: 'Install',
											loading: spinner,
											onClick: ()=> handleSubmit()
										}}
										placeholder='yourstorename'
										{...field}
										onChange={handleChange}
										autoComplete={isoff}
									/>
									{ form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
									</Form.Field>
								)}
								</Field>
							</Form.Group>
						</Form>
					</div>
					)}}/>

			</div>
		</React.Fragment>
	)
}
