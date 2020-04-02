import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox, Table } from 'semantic-ui-react'
import axios from 'axios'
import renderHTML from 'react-render-html'
import {accountvalidations} from './validate'
import {Spinning, Success, Error} from '../../../../../config/spinner'

export default function AccountComponent(props) {

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

  const [isdisabled, setisdisabled] = useState(true);
  const [isucess,setisucess] = useState(false);
  const [iserror,setiserror] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
      id:props.data.id,
      id_merchant:props.data.id_merchant,
      email:props.data.email,
      password:'',
      first_name:props.data.first_name,
      last_name:props.data.last_name,
      is_change:false,
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_affiliateupdate');
		formData.append('info',JSON.stringify(values));
		axios.post('/affiliates/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Affiliate successfully updated',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
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
	            validationSchema={accountvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='small' onClose={()=>closeModal(false)}>
					        <Modal.Header>Affiliate Account: {props.data.name}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent colormodal">
                  {isucess&&Success()}
                  {iserror&&Error()}

                  <div className="columns">
                      <div className="column boxplan">
                        <div className="package-currentplan">
                           <Table celled striped>
                              <Table.Body>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Merchant Store</Table.Cell>
                                  <Table.Cell>{props.data.store}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Affiliate Name</Table.Cell>
                                  <Table.Cell>{props.data.name}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Email</Table.Cell>
                                  <Table.Cell>{props.data.email}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Status</Table.Cell>
                                  <Table.Cell>{renderHTML(props.data.status)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Unique Visitor</Table.Cell>
                                  <Table.Cell>{props.data.visitor}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Approved Orders</Table.Cell>
                                  <Table.Cell>{props.data.approved_orders}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Pending Orders</Table.Cell>
                                  <Table.Cell>{props.data.pending_orders}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Paid Earnings</Table.Cell>
                                  <Table.Cell>{props.data.paid_earnings}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell collapsing><Icon name='bullseye' /> Unpaid Earnings</Table.Cell>
                                  <Table.Cell>{props.data.unpaid_earnings}</Table.Cell>
                                </Table.Row>
                              </Table.Body>
                           </Table>
                        </div>
                      </div>



                  </div>
						    </Modal.Content>
					     </Modal>
				 )}}/>
		</div>
	)
}
