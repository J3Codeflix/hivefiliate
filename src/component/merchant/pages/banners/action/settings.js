import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'
import CKEditor from "react-ckeditor-component"

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

export default function Settings(props) {


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
		props.textalertMessage('Banner settings successfully saved');
	}



	 const [isending, setisending] = useState(true);


   /* Form state and Submit  */
    const [statefile, setstatefile] = useState('');
    const [isoff, setisoff] = useState('off');
		const [state, setstate] = useState({
			is_shown:'false',
			text_description:'',
		});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_bannersettings');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/banners/request.php',formData)
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


   const [text_description, settext_description] = useState('');
   function EventDescription(evt){
		var newContent = evt.editor.getData();
		settext_description(newContent);
	}


	function getdetailssettings(){
		let formData = new FormData();
    formData.append('type','merchant_bannersettingstext');
    axios.post('/merchant/banners/request.php',formData)
    .then(function (response) {
		let obj = response.data;
		if(obj==0){return false;}
      setstate({
				...state,
				is_shown:obj.is_shown,
				text_description:obj.text_description,
			});
			settext_description(obj.text_description);
			setisending(obj.is_shown=='false'?'':true);
    })
    .catch(function (error) {return false;});
	}


    useEffect(()=>{
			getdetailssettings();
    },[]);

	return (
		<div className="modalwrapper">
		     <Formik
			    		enableReinitialize
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
									<Modal open={true} size='small'>
					        	<Modal.Header>Banners settings<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    		<Modal.Content className="modalcontent">

										{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order successfully added'/>}
										{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order not successfully added'/>}

              			<Message warning>On this page, you can setup a text that will be shown to your affiliates at the top of the banners page.</Message>
										<Form>
											<Form.Group inline>
												<Field name="is_shown">
													{({ field, form }) => (
														<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
															<Checkbox className="labelagree" toggle id="change_pass" label="Show the banners page in your affiliates' panels?" checked={isending}

																onChange={(e)=>{
																		let ischecked = 'false';
																		let ischecked2 = '';
																		if(e.target.checked==true){
																				ischecked  = 'true';
																				ischecked2 = true;
																		}
																		setisending(ischecked2);
																		setFieldValue('is_shown',ischecked);
																}}

															/>
														</Form.Field>
													)}
												</Field>
											</Form.Group>
										</Form>

										<Message negative>Enter text below to be shown on the affiliate's banners page. You must enter text if you want to save.</Message>
										<CKEditor
											activeClass="p10"
											content={text_description}
											events={{
												"blur": (evt)=> {
													EventDescription(evt);
													setFieldValue('text_description',evt.editor.getData());
												},
												"afterPaste": (evt)=> {
													EventDescription(evt);
													setFieldValue('text_description',evt.editor.getData());
												},
												"change": (evt)=> {
													EventDescription(evt);
													setFieldValue('text_description',evt.editor.getData());
												}
											}}
										/>

								    </Modal.Content>
								    <Modal.Actions>
								        {props.edit==true&&<div className="positionright">
			                                 <Button
											  loading={spinner}
								              color='blue'
								              icon='check circle'
								              labelPosition='right'
								              content="Save and exit"
								              onClick={() => buttonSubmit(1)}
								            />
											<button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
										</div>}
								    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
