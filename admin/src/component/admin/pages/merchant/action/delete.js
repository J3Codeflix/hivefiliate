import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal, Checkbox, Table } from 'semantic-ui-react'
import axios from 'axios'
import {accountvalidations} from './validate'
import renderHTML from 'react-render-html'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function DeleteAccount(props) {

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
      email:props.data.email,
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_merchantdelete');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Store successfully deleted temporarily',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
				if(buttonclick==2){setisucess(true);reloadlist();setTimeout(function() {setisucess(false);},2000);}
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
				        <Modal.Header>Delete Confirmation<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
					      <Modal.Content className="modalcontent colormodal">
                {isucess&&Success()}
                {iserror&&Error()}

                <Message
                  negative
                  icon='trash alternate outline'
                  header='Delete Account'
                  list={[
                    'The account will deleted temporarily and will be place on deleted merchant under settings menu. However, take note that the account will no longer works on any transaction like login, tracking etc.',
                    "The account will be kept on the deleted merchant so that if you have change your mind and suddenly needed it back we can revert it.",
                    'If you are so sure that this account will no longer needed, then you can remove instantly on deleted merchant under settings menu.',
                  ]}
                />

						    </Modal.Content>
  						    <Modal.Actions>
  						        <div className="positionright">
  	                       <Button
  									        loading={spinner}
  						              color='red'
  						              icon='check circle'
  						              labelPosition='right'
  						              content="I am fully understand & confirm"
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
