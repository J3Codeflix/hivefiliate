import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

import AddComponent from './action/add'
import DetailsComponent from './action/details'
import DeleteAccount from './action/delete'


import AlertMessage from '../../../config/alert'
import {LinkURL} from '../../../config/settings'
import {windowReload} from '../../../config/settings'

import Paginations from '../../../config/pagination'
import EntryList from '../../../config/showentries'
import {Spinning} from '../../../config/spinner'
import renderHTML from 'react-render-html'
import axios from 'axios'
import Cleave from 'cleave.js/react'


export default function Orders(props) {

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
	const [pay, setpay] = useState(false);
	const [deletes, setdeletes] = useState(false);
	const [account, setaccount] = useState(false);
	const [data, setdata] = useState({});

	function close(data){
		setadd(data);
		setaccount(data);
		setdeletes(data);
		setpay(data);
	}

	function addForm(data){
		setadd(true);
		setdata(data);
	}

	function ForAccount(data){
		setdata(data);
		setaccount(true);
	}

	function ForDelete(data){
		setdata(data);
		setdeletes(true);
	}

	function ForPayment(data){
		setdata(data);
		setpay(true);
	}



	/* List with paginations
	---------------------------------------------*/
	const [affiliate, setaffiliate] = useState([]);
	const [merchant, setmerchant] = useState([]);
	const [spinner,setspinner] = useState(false);
	const [search, setsearch]  = useState({
			search_field:'1',
			search_keywords:'',
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
			setspinner(true);
			let formData = new FormData();
			formData.append('type','order_list');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/orders/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setmerchant(obj.store);
					setaffiliate(obj.affiliate);
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
											<div className="column page-title">Order List</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Order list</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

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
																										{ key: '1', text: 'Merchant Store', value: '1' },
																										{ key: '2', text: 'Affiliate', value: '2' },
																										{ key: '3', text: 'Order ID', value: '3' },
																										{ key: '4', text: 'Order Status', value: '4' },
																										{ key: '5', text: 'Tracking Method', value: '5' },
																										{ key: '6', text: 'Date Order', value: '6' },
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
									  									        {isfield==1&&<label>Search for Merchant Store</label>}
																							{isfield==2&&<label>Search for Affiliate</label>}
																							{isfield==3&&<label>Search for Order ID</label>}
																							{isfield==4&&<label>Search for Order Status</label>}
																							{isfield==5&&<label>Search for Tracking Method</label>}
																							{isfield==6&&<label>Search for Date Order (Year-Month-Day)</label>}

									  									        {isfield==3&&<Input fluid {...field} onChange={handleChange}/>}
																							{isfield==6&&<Cleave options={{date: true,delimiter: '-',datePattern: ['Y', 'm', 'd']}} fluid {...field} onChange={handleChange} placeholder="YYYY-MM-DD"/>}
																							{isfield==1&&<Select fluid selectOnBlur={false}
								                                  {...field}
																									search
																									selection
								                                  options={merchant}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Merchant"/>}
																							{isfield==2&&<Select fluid selectOnBlur={false}
								                                  {...field}
																									search
																									selection
								                                  options={affiliate}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Affiliate"/>}
																							{isfield==4&&<Select fluid selectOnBlur={false}
								                                  {...field}
																									search
																									selection
																									options={[
																										{ key: '1', text: 'Paid', value: 'Paid' },
																										{ key: '2', text: 'Not Paid', value: 'Not Paid' },
																										{ key: '3', text: 'Incomplete', value: 'Incomplete' },
																										{ key: '4', text: 'Cancelled', value: 'Cancelled' },
																										{ key: '5', text: 'Refunded', value: 'Refunded' },
																										{ key: '6', text: 'Hidden', value: 'Hidden' },
								                                  ]}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Order Status"/>}
																							{isfield==5&&<Select fluid selectOnBlur={false}
								                                  {...field}
																									search
																									selection
																									options={[
																										{ key: '1', text: 'Tracking by link', value: 'Tracking by link' },
																										{ key: '2', text: 'Tracking by code', value: 'Tracking by code' },
																										{ key: '3', text: 'Tracking by qr', value: 'Tracking by qr' },
																										{ key: '4', text: 'Tracking by sku', value: 'Tracking by sku' },
																										{ key: '5', text: 'Tracking by email', value: 'Tracking by email' },
								                                  ]}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Tracking Method"/>}

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
															<Button icon className='basic' onClick={()=>addForm({list:merchant,afflist:affiliate})}><Icon name='plus circle' /> Add Order</Button>
															<Button icon className='basic' onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
														</div>
												</div>
										</div>
									</div>

									<div className="table-responsive">
										<Table celled unstackable>
									    <Table.Header>
									      <Table.Row>
													<Table.HeaderCell>Merchant Store</Table.HeaderCell>
													<Table.HeaderCell>Order ID</Table.HeaderCell>
									        <Table.HeaderCell>Affiliate Name</Table.HeaderCell>
													<Table.HeaderCell>Tracking</Table.HeaderCell>
													<Table.HeaderCell>Order Price</Table.HeaderCell>
													<Table.HeaderCell>Earnings</Table.HeaderCell>
													<Table.HeaderCell>Order Status</Table.HeaderCell>
													<Table.HeaderCell>Date Order</Table.HeaderCell>
													<Table.HeaderCell>Is Order</Table.HeaderCell>
													<Table.HeaderCell></Table.HeaderCell>
									      </Table.Row>
									    </Table.Header>
											<Table.Body>
													{list.length==0&&<Table.Row negative><Table.Cell  colSpan='10' textAlign="center">No record found</Table.Cell></Table.Row>}
													{list.map(function(data, key){
														return <Table.Row key={key} className={data.is_orderstat!='is_approved'?'negative':''}>
															  <Table.Cell collapsing>
																	<div><Icon className='teal' name='building outline'/><span className='strong'>{data.store}</span></div>
																	<div className="text-blur"><Icon name='envelope outline'/>{data.store_email}</div>
																</Table.Cell>
															  <Table.Cell collapsing>{data.order_id}</Table.Cell>
																<Table.Cell>
																	<div><Icon className='teal' name='user outline'/><span className='strong'>{data.aff_name}</span></div>
																	<div className="text-blur"><Icon name='envelope outline'/>{data.aff_email}</div>
																</Table.Cell>
																<Table.Cell collapsing>{renderHTML(data.tracking_label)}</Table.Cell>
																<Table.Cell><span className='strong'>{data.order_price}</span></Table.Cell>
																<Table.Cell><span className='strong'>{data.aff_earnings}</span></Table.Cell>
																<Table.Cell collapsing>{renderHTML(data.order_status)}</Table.Cell>
																<Table.Cell>{data.date_order}</Table.Cell>
																<Table.Cell collapsing>{renderHTML(data.is_order)}</Table.Cell>
																<Table.Cell collapsing>
																<Button className='teal' size='tiny' icon onClick={()=>{
																	ForAccount({
																		id:data.id,
																		is_order:data.details.is_order,
																		merchant_id:data.details.merchant_id,
																		affiliate_id:data.details.affiliate_id,
																		order_id:data.details.order_id,
																		tracking_method:data.details.tracking_method,
																		order_price:data.details.order_price,
																		aff_earnings:data.details.aff_earnings,
																		date_order:data.details.date_order,
																		order_status:data.details.order_status,
																		landing_page:data.details.landing_page,
																		referal_page:data.details.referal_page,
																		notes:data.details.notes,
																		location_type:data.details.location_type,
																		list:merchant,
																		afflist:affiliate
																	});
																}}><Icon name='cog' /> Details</Button>
																{data.action_delete=='1'&&<Button className='red' size='tiny' icon onClick={()=>{
																		ForDelete({
																			id:data.id
																		});
																}}><Icon name='trash alternate outline' /> Delete</Button>}
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

					{add&&<AddComponent close={close} reload={listreload} alert={openAlert} data={data}/>}
					{account&&<DetailsComponent close={close} reload={listreload} alert={openAlert} data={data}/>}
					{deletes&&<DeleteAccount close={close} reload={listreload} alert={openAlert} data={data}/>}


		</React.Fragment>
	)
}
