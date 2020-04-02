import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Checkbox, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import ReactToPrint from 'react-to-print'

import {LinkURL,windowLocation,windowReload} from '../../../../config/settings'
import {getid} from '../../../../config/queryurl'
import AlertMessage from '../../../../config/alert'

import {Spinning} from '../../../../config/spinner'
import renderHTML from 'react-render-html'
import axios from 'axios'


export default function PaymentApproval(props) {

	const componentRef = useRef();

	const [successalert, setsuccessalert] = useState({text:'Payment Successfully process',type:'success',size:'full',open:true});
	function closeAlert(){
		setisucess(false);
	}

	const [spinner,setspinner] = useState(false);
	const [list,setlist] = useState([]);
	const [info,setinfo] = useState({});


	const buttonEl = useRef(null);
	const [buttonclick, setbuttonClick] = useState(0);
	function buttonSubmit(arg){
			setbuttonClick(arg);
			buttonEl.current.click();
	}
	const [isucess,setisucess] = useState(false);
	const [iserror,setiserror] = useState(false);
	const [state, setstate] = useState({
			id:getid(),
			admin_notes:'',
			is_payment:false,
	});

	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','payment_processapproval');
		formData.append('info',JSON.stringify(values));
		formData.append('click',buttonclick);
		axios.post('/merchant/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){
					setsuccessalert({text:'Payment Successfully process',type:'success',size:'full',open:true});
					setisucess(true);
					setTimeout(function() {windowLocation('/merchant/affpayment')},2000);
				}
				if(buttonclick==2){
					setsuccessalert({text:'Payment Successfully unapproved',type:'success',size:'full',open:true});
					setisucess(true);
					setTimeout(function() {windowLocation('/merchant/affpayment')},2000);
				}
				return false;
			}
			//if(obj==0){resetForm();setiserror(true);setTimeout(function() {setiserror(false);},2000);return false;}
			//Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {
			//resetForm();setiserror(true);setspinner(false);
			//return false;
		});
	 }


	function InvoiceDetails(){
    if(getid()==null||getid()==''){windowLocation('/merchant/affpayment');}
    setspinner(true);
    let formData = new FormData();
    formData.append('type','payment_approval');
		formData.append('id',getid());
    axios.post('/merchant/request.php',formData)
    .then(function (response) {
      let obj = response.data;
			setspinner(false);
			if(obj.list==0){windowLocation('/merchant/affpayment');}
			setinfo(obj.info);
      setlist(obj.list);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


	useEffect(()=>{
		InvoiceDetails();
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">
												<Button className='teal' icon as="a" href={LinkURL('/merchant/affpayment')}><Icon name='arrow alternate circle left outline' /> Back to Payment </Button>
											</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Affiliate Payment</span>
											</div>
									</div>
							</div>

							<div className="alret">
								{isucess&&<AlertMessage close={closeAlert} htmltemplate={successalert}/>}
								{info.is_process==1&&<div className="approved"><Message
									positive
							    icon='info circle'
							    header='Payment Approved'
							    content='This payment is already approved. If you want to revert it back to unapproved please click the unapprove button below.'
							  /></div>}
							</div>


							<div className="invoice-wrapper">
								<div className="invoice-header">
									<div className="invoice-company">
										<div className="columns is-mobile">
											<div className="column paymentapprovaltext">
												<h2>Payment Approval</h2>
											</div>
											<div className="column"></div>
										</div>
									</div>
									<div className="invoice-to">
										<div className="columns is-mobile">
											<div className="column invoice-column1">
												<p>Payment to</p>
												<h2>The following Affiliates</h2>
											</div>
											<div className="column invoice-column2">
                        <Table basic='very' className="tableinvoice">
                         <Table.Body>
                           <Table.Row className="borderbottom">
                             <Table.Cell textAlign='right' collapsing><h4>Invoice No.:</h4></Table.Cell>
                             <Table.Cell textAlign='right'>{info.invoice_number}</Table.Cell>
                           </Table.Row>
                           <Table.Row>
                             <Table.Cell textAlign='right' collapsing><h4>Invoice Date:</h4></Table.Cell>
                             <Table.Cell textAlign='right'>{info.payment_date}</Table.Cell>
                           </Table.Row>
                         </Table.Body>
                        </Table>
                      </div>
										</div>
									</div>
								</div>

								<div className="invoice-table">
										<Table celled>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>Month</Table.HeaderCell>
													<Table.HeaderCell>Affiliate</Table.HeaderCell>
													<Table.HeaderCell>Paypal Email</Table.HeaderCell>
													<Table.HeaderCell>Order Price</Table.HeaderCell>
													<Table.HeaderCell>Affiliate Earnings</Table.HeaderCell>
													<Table.HeaderCell>Paid Earnings</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{list.map(function(data, key){
													return <Table.Row key={key}>
															<Table.Cell>{info.month_invoice}</Table.Cell>
															<Table.Cell>{data.affiliate}</Table.Cell>
															<Table.Cell>{data.paypal_email}</Table.Cell>
															<Table.Cell>{data.order_price}</Table.Cell>
															<Table.Cell>{data.aff_earnings}</Table.Cell>
															<Table.Cell>{data.aff_earnings}</Table.Cell>
													</Table.Row>
												})}
											</Table.Body>
											<Table.Footer>
												<Table.Row>
													<Table.HeaderCell className="totalfooter" textAlign='right' colSpan='5'>Amount Total Paid</Table.HeaderCell>
													<Table.HeaderCell className="totalfooter">{info.total}</Table.HeaderCell>
												</Table.Row>
											</Table.Footer>
										</Table>
								</div>

								<div className="formapproval">
									<Formik
				 	            initialValues={state}
				 	            onSubmit={handleSubmitForm}
				 	            render={formProps => {
				 	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
				 		          return(
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
																						<Checkbox className="labelagree" disabled={info.is_process==1} toggle id="is_payment" label="I am fully understand and agreed." checked={values.is_payment}
																								onChange={(e)=>{
																										setFieldValue(field.name,e.target.checked);
																								}}
																						/>
																				</Form.Field>
																		)}
																</Field>
														</Form.Group>
														<Button
															disabled={values.is_payment==false||info.is_process==1}
															loading={spinner}
															color='green'
															icon='check circle'
															labelPosition='right'
															content="Confirm Approve"
															onClick={() => buttonSubmit(1)}
													/>
													{info.is_process==1&&<Button
															loading={spinner}
															color='red'
															icon='check circle'
															labelPosition='right'
															content="Unapproved"
															onClick={() => buttonSubmit(2)}
													/>}
												  <button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
													</Form>
											)}}/>
								</div>


              </div>
          </div>
		</React.Fragment>
	)
}
