import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function ProcessComponent(props) {

  /* For Modal */
  function closeModal(data){
      props.close(data);
  }
  function callalert(open,data){
      props.alert(open,data);
  }
  function reloadlist(){
      props.reload();
  }

  /* Form Submit */
  const [seen, setseen] = useState(false);
  const buttonEl = useRef(null);
  const [buttonclick, setbuttonClick] = useState(0);
  function buttonSubmit(arg){
      setbuttonClick(arg);
      buttonEl.current.click();
	}

  const [isucess,setisucess] = useState(false);
  const [iserror,setiserror] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
      id:props.data.id,
      admin_notes:'',
      is_payment:false,
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_invoiceprocess');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Payment Successfully process',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
				return false;
			}
			if(obj==0){resetForm();setiserror(true);setTimeout(function() {setiserror(false);},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();setiserror(true);setspinner(false);return false;});
   }

	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
					        <Modal.Header>Payment to Affiliate<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent">
                  {isucess&&Success()}
                  {iserror&&Error()}

                  <Message
                    positive
                    icon='info circle'
                    header='Payment Proccesing to affiliate'
                    content='This only put on record that the payment to affiliate has been process.'
                  />


						    	<Form>
                    <Form.Group widths='equal'>
								      <Field name="admin_notes">
										    {({ field, form }) => (
  									      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
  									        <label>Notes</label>
  									        <TextArea fluid {...field} onChange={handleChange} placeholder="You can enter notes here"/>
  									        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
  									      </Form.Field>
										   )}
									     </Field>
								    </Form.Group>
                    <Form.Group inline>
                        <Field name="is_payment">
                            {({ field, form }) => (
                                <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                    <Checkbox className="labelagree" toggle id="is_payment" label="I am fully understand that the payment to affiliate is already process." checked={values.is_payment}
                                        onChange={(e)=>{
                                            setFieldValue(field.name,e.target.checked);
                                        }}
                                    />
                                </Form.Field>
                            )}
                        </Field>
                    </Form.Group>
						      </Form>
						    </Modal.Content>
  						    <Modal.Actions>
  						        <div className="positionright">
  	                        <Button
                              disabled={values.is_payment==false}
    									        loading={spinner}
    						              color='green'
    						              icon='check circle'
    						              labelPosition='right'
    						              content="Confirm Process"
  						                onClick={() => buttonSubmit(1)}
  						            />
  									   <button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
  								    </div>
  						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
