import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

import PaymentHistoryComponent from './action/payhistory'
import AccountComponent from './action/account'
import DeleteAccount from './action/delete'
import RetrieveAccount from './action/retrieve'


import AlertMessage from '../../../../config/alert'
import {LinkURL} from '../../../../config/settings'
import {windowReload} from '../../../../config/settings'

import Paginations from '../../../../config/pagination'
import EntryList from '../../../../config/showentries'
import {Spinning} from '../../../../config/spinner'
import renderHTML from 'react-render-html'

import axios from 'axios'
import Cleave from 'cleave.js/react'


export default function DeletedMerchant(props) {

	/* For Alert */
	function toTop(){document.querySelector('body').scrollTop = 0;}
	const [open, setopen] = useState(false);
	const [alert,setalert] = useState({});
	const [isdelete, setisdelete] = useState(false);
	const [isid, setisid] = useState(0);

	function closeAlert(){
		setopen(false);
	}
	function openAlert(data,text){
		setalert(text);
		setopen(data);
		toTop();
	}

	/* For modal */
	const [add, setadd] = useState(false);
	const [update, setupdate] = useState(false);
	const [payment, setpayment] = useState(false);
	const [payhistory, setpayhistory] = useState(false);
	const [account, setaccount] = useState(false);
	const [retrieve, setretrieve] = useState(false);
	const [data, setdata] = useState({});

	function close(data){
		setadd(data);
		setisdelete(data);
		setupdate(data);
		setpayment(data);
		setpayhistory(data);
		setaccount(data);
		setretrieve(data);
	}
	function UpdateProcess(data){
		setupdate(true);
		setdata(data);
	}
	function DeleteProcess(data){
		setisdelete(true);
		setdata(data);
	}
	/* For payment */
	function ForPayment(data){
		setpayment(true);
		setdata(data);
	}
	function ForPaymentHistory(data){
		setpayhistory(true);
		setdata(data);
	}
	function ForAccount(data){
		setaccount(true);
		setdata(data);
	}
	function ForRetrieve(data){
		setretrieve(true);
		setdata(data);
	}


	/* List with paginations
	---------------------------------------------*/
	const [spinner,setspinner] = useState(false);
	const [search, setsearch]  = useState({
			search_field:'1',
			search_keywords:'',
			is_deleted:1,
	});

	const [list, setlist] = useState([]);
	const [pagenumber, setpagenumber] = useState(1);
	const [totaldata, settotaldata] = useState(0);
	const [entry, setentry] = useState(0);
	const [entrytype, setentrytype] = useState('');

	const [paginations, setpaginations] = useState({
			paginations:[{
			listnav:[],
			pageinfo:'',
			limit_page:'',
			total_page:'',
			total_records:'',
			current_page:'',
			startPage:'',
			endPage:'',
			ellipseLeft:'',
			ellipseRight:'',
			}]
	});

	function pagenumberfunction(page){
			TableList(page,search);
	}
	function listreload(){
			TableList(pagenumber,search);
	}
	function searchProcess(){
		  TableList(pagenumber,search);
	}
	function TableList(page,searchstr){
		  console.log(searchstr);
			setspinner(true);
			let formData = new FormData();
			formData.append('type','merchant_list');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/merchant/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setentry(obj.entries.val);
					setentrytype(obj.entries.type);
					setlist(obj.listtable);
					setpaginations(obj.paginations);
					settotaldata(obj.paginations.paginations.total_records);
					setspinner(false);
			})
			.catch(function (error){
					console.log(error);
			});
	}

	/* Search Script Table */
	const [isfield, setisfield] = useState(1);
	function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		if(values.search_keywords==''){return false;}
		TableList(pagenumber,values);
   }

	useEffect(()=>{
			TableList(pagenumber,search);
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Deleted Merchant Store</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Deleted Merchant Store</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<Message
								negative
						    icon='info circle'
						    header='Information about the deleted list store below'
						    list={[
									"The deleted store below will be kept! if you've change your mind we can revert it back. However, the account will no longer works on any transaction like login, tracking etc.",
									'If you are so sure that this account will no longer needed, then you can remove instantly below.',
									'Removing store below will wipe the entire information associated to this account.'
								]}
						  />

							<div className="table-wrapper">
                  {spinner&&Spinning()}

									<div className="table-search">
										<div className="searchgrid">
											<Formik
						 	            initialValues={search}
						 	            onSubmit={handleSubmitForm}
						 	            render={formProps => {
						 	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
						 		          return(
															<div className="columns is-mobile">
																<div className="column">
																	<Form>
																		<Form.Group widths='equal'>
																      <Field name="search_field">
								    										{({ field, form }) => (
								    									      <Form.Field>
								    									        <label>Filter Field</label>
								                              <Select fluid selectOnBlur={false}
								                                  {...field}
								                                  options={[
																										{ key: '1', text: 'Store Name', value: '1' },
																										{ key: '2', text: 'Email', value: '2' },
																										{ key: '3', text: 'Type Plan', value: '3' },
																										{ key: '4', text: 'Date Registered', value: '4' },
																										{ key: '5', text: 'Date Expiration', value: '5' },
								                                  ]}
								                                  onChange={(e, { value }) => {
																										setisfield(value);
																										setFieldValue(field.name,value);
																										setFieldValue('search_keywords','');
																									}}/>
								    									      </Form.Field>
								    										)}
																	  	</Field>
																			<Field name="search_keywords">
																			    {({ field, form }) => (
									  									      <Form.Field>
									  									        {isfield==1&&<label>Enter Store Name</label>}
																							{isfield==2&&<label>Enter Email</label>}
																							{isfield==3&&<label>Type Plan</label>}
																							{isfield==4&&<label>Date Registered <span className='text-blur'>(Year-Month-Day)</span></label>}
																							{isfield==5&&<label>Date Expiration <span className='text-blur'>(Year-Month-Day)</span></label>}
									  									        {(isfield==1||isfield==2)&&<Input fluid {...field} onChange={handleChange}/>}
																							{isfield==3&&<Select fluid selectOnBlur={false}
								                                  {...field}
								                                  options={[
																										{ key: '1', text: 'Trial', value: 'Trial' },
																										{ key: '2', text: 'Professional', value: 'Professional' },
																										{ key: '3', text: 'Enterprise', value: 'Enterprise' },
								                                  ]}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Choose plan"/>}
																						  {(isfield==4||isfield==5)&&<Cleave options={{date: true,delimiter: '-',datePattern: ['Y', 'm', 'd']}} fluid {...field} onChange={handleChange} placeholder="YYYY-MM-DD"/>}
									  									      </Form.Field>
																			   )}
																		  </Field>
																    </Form.Group>
																  </Form>
																</div>
																<div className="column is-1 searchformbutton">
																	<Button icon className='blue' fluid labelPosition='left' onClick={handleSubmit}>Search<Icon name='search' /></Button>
																</div>
														</div>
													)}}/>
										</div>
									</div>

								  <div className="table-entries">
										<div className="columns is-vcentered is-mobile">
												<div className="column"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={listreload}/>}</div></div>
												<div className="column">
														<div className="text-right">
															<Button icon className='basic' onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
														</div>
												</div>
										</div>
									</div>

									<div className="table-responsive">
										<Table celled unstackable>
									    <Table.Header>
									      <Table.Row>
													<Table.HeaderCell>ID</Table.HeaderCell>
													<Table.HeaderCell>Date Registered</Table.HeaderCell>
									        <Table.HeaderCell>Email</Table.HeaderCell>
									        <Table.HeaderCell>Store Name</Table.HeaderCell>
													<Table.HeaderCell>Type Plan</Table.HeaderCell>
													<Table.HeaderCell>Current Paid</Table.HeaderCell>
													<Table.HeaderCell>Status</Table.HeaderCell>
													<Table.HeaderCell>Date Expiration</Table.HeaderCell>
													<Table.HeaderCell>Rem. Days</Table.HeaderCell>
													<Table.HeaderCell></Table.HeaderCell>
									      </Table.Row>
									    </Table.Header>
											<Table.Body>
													{list.length==0&&<Table.Row negative><Table.Cell  colSpan='10' textAlign="center">No record found</Table.Cell></Table.Row>}
													{list.map(function(data, key){
														return <Table.Row key={key} negative>
															  <Table.Cell collapsing>{data.id}</Table.Cell>
															  <Table.Cell>{data.dateadded}</Table.Cell>
																<Table.Cell>{data.email}</Table.Cell>
																<Table.Cell>{data.store_name}</Table.Cell>
																<Table.Cell>{renderHTML(data.type_plan)}</Table.Cell>
																<Table.Cell><strong>{data.price_plan}</strong></Table.Cell>
																<Table.Cell>{renderHTML(data.status)}</Table.Cell>
																<Table.Cell>{data.plan_expire}</Table.Cell>
																<Table.Cell>{data.days_remaining}</Table.Cell>
																<Table.Cell collapsing>
																	<Button className='teal' size='tiny' icon onClick={()=>{
																				ForAccount({
																					id:data.id,
																					dateadded:data.dateadded,
																					email:data.email,
																					store_name:data.store_name,
																					type_plan:data.type_plan,
																					price_plan:data.price_plan,
																					status:data.status,
																					plan_expire:data.plan_expire,
																					days_remaining:data.days_remaining,
																					currency:data.currency,
																					currentplan:data.type_plantext,
																					description:data.description,
																				});

																	}}><Icon name='cog' /> Account</Button>
																<Button className='green' size='tiny' disabled={data.ispayment==0} icon onClick={()=>{
																			ForPaymentHistory({
																				id:data.id,
																				dateadded:data.dateadded,
																				email:data.email,
																				store_name:data.store_name,
																				type_plan:data.type_plan,
																				price_plan:data.price_plan,
																				status:data.status,
																				plan_expire:data.plan_expire,
																				days_remaining:data.days_remaining,
																				currency:data.currency,
																				currentplan:data.type_plantext,
																				description:data.description,
																			});
																}}><Icon name='dollar sign' /> Payment</Button>
															<Button className='orange' size='tiny' icon onClick={()=>{
																	ForRetrieve({
																		id:data.id,
																		dateadded:data.dateadded,
																		email:data.email,
																		store_name:data.store_name,
																		type_plan:data.type_plan,
																		price_plan:data.price_plan,
																		status:data.status,
																		plan_expire:data.plan_expire,
																		days_remaining:data.days_remaining,
																		currency:data.currency,
																		currentplan:data.type_plantext,
																		description:data.description,
																	});
																}}><Icon name='redo' /> Retrive</Button>
															<Button className='red' size='tiny' icon onClick={()=>{
																DeleteProcess({
																	id:data.id,
																	dateadded:data.dateadded,
																	email:data.email,
																	store_name:data.store_name,
																	type_plan:data.type_plan,
																	price_plan:data.price_plan,
																	status:data.status,
																	plan_expire:data.plan_expire,
																	days_remaining:data.days_remaining,
																	currency:data.currency,
																	currentplan:data.type_plantext,
																	description:data.description,
																});
															}}><Icon name='trash alternate outline' /> Delete</Button>
																</Table.Cell>
														</Table.Row>
													})}
											</Table.Body>
											{list.length>0&&
												<Table.Footer fullWidth>
														<Table.Row>
														<Table.HeaderCell colSpan='10'>
																<div className="dash-footer"><Paginations callbackPagination={paginations} callbackPagenumber={pagenumberfunction}/></div>
														</Table.HeaderCell>
														</Table.Row>
												</Table.Footer>
											}
									  </Table>
									</div>
							</div>
          </div>


					{isdelete&&<DeleteAccount close={close} reload={listreload} alert={openAlert} data={data}/>}
					{retrieve&&<RetrieveAccount close={close} reload={listreload} alert={openAlert} data={data}/>}
					{account&&<AccountComponent close={close} reload={listreload} alert={openAlert} data={data}/>}
					{payhistory&&<PaymentHistoryComponent close={close} reload={listreload} alert={openAlert} data={data}/>}

		</React.Fragment>
	)
}
