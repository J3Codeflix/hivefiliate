import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

import AddComponent from './action/add'
import AccountComponent from './action/account'
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


export default function Staff(props) {

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
			formData.append('type','staff_list');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/staff/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setmerchant(obj.merchant);
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
											<div className="column page-title">Staff List</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Staff list</span>
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
																										{ key: '2', text: 'Staff Name', value: '2' },
																										{ key: '3', text: 'Staff Email', value: '3' },
																										{ key: '4', text: 'Status', value: '4' },
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
																							{isfield==2&&<label>Search for Staff Name</label>}
																							{isfield==3&&<label>Search for Staff Email</label>}
																							{isfield==4&&<label>Search for Staff Status</label>}
									  									        {(isfield==2||isfield==3)&&<Input fluid {...field} onChange={handleChange}/>}
																							{isfield==1&&<Select fluid selectOnBlur={false}
								                                  {...field}
																									search
																									selection
								                                  options={merchant}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Select Merchant"/>}
																							{isfield==4&&<Select fluid selectOnBlur={false}
								                                  {...field}
								                                  options={[
																										{ key: '1', text: 'Active', value: 'Active', label: { color: 'green', empty: true, circular: true } },
																										{ key: '2', text: 'In-Active', value: 'In-Active', label: { color: 'red', empty: true, circular: true } },
								                                  ]}
								                                  onChange={(e, { value }) => {	setFieldValue(field.name,value);}} placeholder="Choose Status"/>}
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
															<Button icon className='basic' onClick={()=>addForm({list:merchant})}><Icon name='plus circle' /> Add Staff</Button>
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
													<Table.HeaderCell>Staff Name</Table.HeaderCell>
									        <Table.HeaderCell>Email</Table.HeaderCell>
													<Table.HeaderCell>Status</Table.HeaderCell>
													<Table.HeaderCell>Last Logged</Table.HeaderCell>
													<Table.HeaderCell></Table.HeaderCell>
									      </Table.Row>
									    </Table.Header>
											<Table.Body>
													{list.length==0&&<Table.Row negative><Table.Cell  colSpan='7' textAlign="center">No record found</Table.Cell></Table.Row>}
													{list.map(function(data, key){
														return <Table.Row key={key} className={data.stat=='Active'?'positive':'negative'}>
															  <Table.Cell collapsing>
																	<div><Icon className='teal' name='bullseye'/><span className='strong'>{data.store}</span></div>
																	<div className="text-blur"><Icon name='envelope outline'/>{data.store_email}</div>
																</Table.Cell>
															  <Table.Cell>{data.name}</Table.Cell>
																<Table.Cell>{data.email}</Table.Cell>
																<Table.Cell collapsing>{renderHTML(data.status)}</Table.Cell>
																<Table.Cell>{data.last_log}</Table.Cell>
																<Table.Cell collapsing>
																<Button className='teal' size='tiny' icon onClick={()=>{
																	ForAccount({
																		id:data.id,
																		id_merchant:data.id_merchant,
																		email:data.email,
																		first_name:data.first_name,
																		last_name:data.last_name,
																		status:data.stat,
																		list:merchant,
																		permission:data.permission,
																	});
																}}><Icon name='cog' /> Account</Button>
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
														<Table.HeaderCell colSpan='7'>
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
					{account&&<AccountComponent close={close} reload={listreload} alert={openAlert} data={data}/>}
					{deletes&&<DeleteAccount close={close} reload={listreload} alert={openAlert} data={data}/>}





		</React.Fragment>
	)
}
