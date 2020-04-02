import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidations} from './validate'
import axios from 'axios'

import DropzoneComponent from 'react-dropzone-component'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

export default function UpdateBanner(props) {

	function toTop(){
		document.querySelector('body').scrollTop = 0;
	}


	/* Spinner and Alert */
	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

	 const [isending, setisending] = useState(props.arrayCallback.is_show=='false'?'':true);

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
	function showAlert(data,text){
		props.showAlertMessage(data);
		props.textalertMessage(text);
		toTop();
	}


   /* Form state and Submit  */
    const [statefile, setstatefile] = useState('');
    const [isoff, setisoff] = useState('off');
		const [state, setstate] = useState({
        id:props.arrayCallback.id,
				is_show:props.arrayCallback.is_show=='flase'?'false':true,
				bann_category:props.arrayCallback.bann_category,
				url_banner:props.arrayCallback.url_banner,
        banner_width:props.arrayCallback.banner_width,
        banner_height:props.arrayCallback.banner_height,
        note_banner:props.arrayCallback.note_banner,
        file_name:props.arrayCallback.file_name
	});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){

				setspinner(true);
				CloseAlert(false);
				let formData = new FormData();
				formData.append('type','merchant_updatebanner');
        formData.append('info',JSON.stringify(values));
        formData.append('file',statefile);
				axios.post('/merchant/banners/request.php',formData)
				.then(function (response) {
            let obj = response.data;
            if(obj=='image_exist'){
                if(buttonclick==1){reloadList();showAlert(false,'Banner with this name is already inserted, the current upload failed!');closeModal(false);}
								if(buttonclick==2){reloadList();setsuccess(true);}
                return false;
            }
            if(obj=='image_required'){
                if(buttonclick==1){reloadList();showAlert(false,'Banner image is required, the current upload failed!');closeModal(false);}
								if(buttonclick==2){reloadList();setsuccess(true);}
                return false;
            }
			if(obj==1){
				resetForm();
				if(buttonclick==1){reloadList();showAlert(true,'Your banner was updated successfully');closeModal(false);}
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

   const [category, setcategory] = useState([]);
   function getcategory(){
        let formData = new FormData();
        formData.append('type','merchant_getcategory');
        axios.post('/merchant/banners/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setcategory(obj);
        })
        .catch(function (error) {return false;});
    }


    /* Upload Image
    ----------------------------------------------------------------------*/
 	var myDropzone;
     const [dropmessage, setdropmessage] = useState(true);
     const [configDropzone, setconfigDropzone] = useState('');
     function initCallback (dropzone) {
         myDropzone = dropzone;
         setconfigDropzone(dropzone);
     }
     function removeFile (file) {
         if (myDropzone) {
             myDropzone.removeFile(file);
         }
     }
     function disableDropzone(){
         myDropzone.removeEventListeners();
     }
     function enableDropzone(){
         myDropzone.setupEventListeners();
     }
     let componentConfig = {
         postUrl: 'no-url',
         addRemoveLinks:true,
     }

     let djsConfig = {
         acceptedFiles : 'image/jpeg, images/jpg, image/png, image/gif',
         addRemoveLinks:true,
         autoProcessQueue: false,
         parallelUploads : 1,
         maxFiles:1,
     }

     let eventHandlers = {
         init: function(dropzone) {
             initCallback(dropzone);
         },
         addedfile(file){
             setdropmessage(false);
             disableDropzone();
             setstatefile(file);
         },
         maxfilesexceeded(file){
             setdropmessage(false);
             removeFile(file);
             disableDropzone();
         },
         removedfile(file){
             if(myDropzone.getQueuedFiles().length==0){
                 setdropmessage(true);
                 enableDropzone();
             }
             setstatefile('');
         },
         sending(file, xhr, formData) {
               formData.append('type', 'uploadfile');
         },
         error(errorMessage){
             console.log(errorMessage);
         }
     }


    useEffect(()=>{
        getcategory();
    },[]);

	return (
		<div className="modalwrapper">
		     <Formik
                enableReinitialize
	            initialValues={state}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						<Modal open={true} size='small'>
					      <Modal.Header>Update Banner {props.arrayCallback.is_show}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

								{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order successfully added'/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Order not successfully added'/>}

						    	<Form>
                                    <div className="dropzone-container">
                                        <div className="dropzone-wrapper">
                                            <DropzoneComponent
                                            className="dropzone"
                                            config={componentConfig}
                                            eventHandlers={eventHandlers}
                                            djsConfig={djsConfig}
                                            >
                                            {dropmessage&&<div className="dz-message" data-dz-message>
                                                    <div className="dropIcon"><i className="ti-image"></i></div>
                                                    <div className="dropText">Drop or click image file to change the upload</div>
                                            </div>}
                                            </DropzoneComponent>
                                        </div>
                                        <div className="ishow">
                                            <Form.Group inline>
                                                <Field name="is_show">
                                                    {({ field, form }) => (
                                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                            <Checkbox className="labelagree" toggle id="is_show" label='Show the banner to your affiliates' checked={isending}
																															onChange={(e)=>{
																																	let ischecked = 'false';
																																	let ischecked2 = '';
																																	if(e.target.checked==true){
																																			ischecked  = 'true';
																																			ischecked2 = true;
																																	}
																																	setisending(ischecked2);
																																	setFieldValue('is_show',ischecked);
																															}}
                                                            />
                                                        </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </div>
                                    </div>


                                    <div className="columns is-mobile">
                                        <div className="column is-two-fifths"><label className="inlinelabel">Banner Category</label></div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="bann_category">
                                                {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <Select
                                                            fluid
                                                            selectOnBlur={false}
                                                            options={category}
                                                            {...field}
                                                            onChange={(e, { value }) => setFieldValue(field.name, value)} placeholder="All"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-two-fifths">
                                            <label className="inlinelabel">Set specific URL</label>
                                            <h3 className="text-blur">entering a URL, will lock the banner for it, click for more info</h3>
                                        </div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="url_banner">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input fluid {...field} onChange={handleChange} autoComplete={isoff} placeholder="Set's store url"/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-two-fifths">
                                            <label className="inlinelabel">Set specific Width in pixels</label>
                                            <h3 className="text-blur">If you leave the width and height fields empty, then the actual banner's width and height will be taken</h3>
                                        </div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="banner_width">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input
                                                        fluid
                                                        {...field}
                                                        onChange={handleChange}
                                                        autoComplete={isoff}
                                                        placeholder="Banners width"
                                                        label={{ content: 'px' }}
                                                        labelPosition='right'
                                                        />
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-two-fifths">
                                            <label className="inlinelabel">Set specific Height in pixels</label>
                                            <h3 className="text-blur">If you leave the width and height fields empty, then the actual banner's width and height will be taken</h3>
                                        </div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="banner_height">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <Input
                                                        fluid {...field}
                                                        onChange={handleChange}
                                                        autoComplete={isoff}
                                                        label={{ content: 'px' }}
                                                        labelPosition='right'
                                                        placeholder="Banners Height"/>
                                                    { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                </Form.Field>
                                                )}
                                            </Field>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="columns is-mobile">
                                        <div className="column is-two-fifths">
                                            <label className="inlinelabel">Notes for this banner</label>
                                            <h3 className="text-blur">Will be shown to your affiliates too</h3>
                                        </div>
                                        <div className="column">
                                            <Form.Group widths='equal'>
                                            <Field name="note_banner">
                                                {({ field, form }) => (
                                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                    <TextArea fluid {...field} onChange={handleChange} autoComplete={isoff}/>
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
