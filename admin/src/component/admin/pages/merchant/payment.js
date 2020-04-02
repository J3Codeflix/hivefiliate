import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

import ProcessComponent from './invoice/process'

import AlertMessage from '../../../config/alert'
import {LinkURL} from '../../../config/settings'
import {windowReload} from '../../../config/settings'

import Paginations from '../../../config/pagination'
import EntryList from '../../../config/showentries'
import {Spinning} from '../../../config/spinner'
import renderHTML from 'react-render-html'
import DeleteAccount from './action/delete'
import axios from 'axios'
import Cleave from 'cleave.js/react'


export default function Merchantinvoicetoaffiliate(props) {

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
	const [data, setdata] = useState({});

	function close(data){
		setadd(data);
	}
	function UpdateProcess(data){
		setadd(true);
		setdata(data);
	}


	/* List with paginations
	---------------------------------------------*/
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

	const [affiliate, setaff] = useState([]);
	const [merchant, setmerchant] = useState([]);
	function TableList(page,searchstr){
		  console.log(searchstr);
			setspinner(true);
			let formData = new FormData();
			formData.append('type','merchant_invoice');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/merchant/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setaff(obj.affiliate);
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
											<div className="column page-title">Merchant Payment</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Merchant Payment</span>
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
																										{ key: '1', text: 'Merchant', value: '1' },
																										{ key: '2', text: 'Affiliate', value: '2' },
																										{ key: '3', text: 'Invoice Number', value: '3' },
																										{ key: '4', text: 'Payment Date', value: '4' },
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
									  									        {isfield==1&&<label>Enter Merchant</label>}
																							{isfield==2&&<label>Enter Affiliate</label>}
																							{isfield==3&&<label>Invoice Number</label>}
																							{isfield==4&&<label>Payment Date <span className='text-blur'>(Year-Month-Day)</span></label>}
									  									        {isfield==3&&<Input fluid {...field} onChange={handleChange}/>}
																							{isfield==1&&<Select fluid selectOnBlur={false}
								                                  {...field}
																							    search
																							    selection
								                                  options={merchant}
								                                  onChange={(e, { value }) => {
																										setFieldValue(field.name,value);
																							}}/>}
																							{isfield==2&&<Select fluid selectOnBlur={false}
								                                  {...field}
								                                  options={affiliate}
																									search
																									selection
								                                  onChange={(e, { value }) => {
																										setFieldValue(field.name,value);
																							}}/>}
																						  {(isfield==4)&&<Cleave options={{date: true,delimiter: '-',datePattern: ['Y', 'm', 'd']}} fluid {...field} onChange={handleChange} placeholder="YYYY-MM-DD"/>}
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
													<Table.HeaderCell>Payment Date</Table.HeaderCell>
													<Table.HeaderCell>Invoice Month</Table.HeaderCell>
									        <Table.HeaderCell>Invoice Number</Table.HeaderCell>
													<Table.HeaderCell>Merchant</Table.HeaderCell>
									        <Table.HeaderCell>Affiliate Paid Earnings</Table.HeaderCell>
													<Table.HeaderCell>Payment Status</Table.HeaderCell>
													<Table.HeaderCell>Comments</Table.HeaderCell>
													<Table.HeaderCell>Admin Notes</Table.HeaderCell>
													<Table.HeaderCell></Table.HeaderCell>
									      </Table.Row>
									    </Table.Header>
											<Table.Body>
													{list.length==0&&<Table.Row negative><Table.Cell  colSpan='10' textAlign="center">No record found</Table.Cell></Table.Row>}
													{list.map(function(data, key){
														return <Table.Row key={key} className={data.is_process==1?'positive':'negative'}>
															  <Table.Cell>{data.payment_date}</Table.Cell>
															  <Table.Cell>{data.month_invoice}</Table.Cell>
																<Table.Cell>{data.invoice_number}</Table.Cell>
																<Table.Cell>{data.merchant}</Table.Cell>
																<Table.Cell>{data.total}</Table.Cell>
																<Table.Cell>
																	<div>{renderHTML(data.status)}</div>
																	{data.is_process==1&&<div>Process by: <span className='strong'>{data.process_by}</span></div>}
																	{data.is_process==1&&<div className="text-blur">{data.date_process}</div>}
																</Table.Cell>
																<Table.Cell>{data.comments1}</Table.Cell>
																<Table.Cell>{data.admin_notes}</Table.Cell>
																<Table.Cell collapsing>
																	<Button className='teal' size='tiny' icon onClick={()=>{
																				UpdateProcess({
																					id:data.id,
																				});
																	}}><Icon name='cog' /> Payment Approval</Button>
																<Button className='green' size='tiny' icon as="a" href={LinkURL('/merchant/invoice/?id='+data.reference_id)}><Icon name='file alternate outline' /> Invoice</Button>
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
					{add&&<ProcessComponent close={close} reload={listreload} alert={openAlert} data={data}/>}

		</React.Fragment>
	)
}
