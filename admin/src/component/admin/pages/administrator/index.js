import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import AddComponent from './action/add'
import UpdateComponent from './action/edit'
import AlertMessage from '../../../config/alert'
import {LinkURL} from '../../../config/settings'
import {windowReload} from '../../../config/settings'

import Paginations from '../../../config/pagination'
import EntryList from '../../../config/showentries'
import {Spinning} from '../../../config/spinner'
import renderHTML from 'react-render-html'
import DeleteComponent from './action/delete'
import axios from 'axios'


export default function Administrator(props) {

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
	const [data, setdata] = useState({});
	function close(data){
		setadd(data);
		setisdelete(data);
		setupdate(data);
	}
	function UpdateProcess(data){
		setupdate(true);
		setdata(data);
	}
	function DeleteProcess(id){
		setisdelete(true);
		setisid(id);
	}

	/* List with paginations
	---------------------------------------------*/
	const [spinner,setspinner] = useState(false);
	const [search, setsearch]  = useState({
			keywords:null
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
			formData.append('type','admin_listusers');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/users/request.php',formData)
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

	useEffect(()=>{
			TableList(pagenumber,search);
	},[]);

	return (
		<React.Fragment>
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">Administrator</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Administrator</span>
											</div>
									</div>
							</div>

							{open&&<AlertMessage close={closeAlert} htmltemplate={alert}/>}

							<div className="table-wrapper">
                  {spinner&&Spinning()}

									<div className="table-search">
										<div className="searchgrid">
											<Form>
										    <Form.Group widths='equal'>
										      <Form.Field>
										        <Input
															fluid placeholder='Enter keyword to search'
															onChange={(e)=>setsearch({...search,keywords:e.target.value})}
															action={{
																 color: 'blue',
																 labelPosition: 'right',
																 icon: 'search',
																 content: 'Search',
																 onClick:()=>searchProcess()
															 }}
															/>
										      </Form.Field>
										    </Form.Group>
										  </Form>
										</div>
									</div>

								  <div className="table-entries">
										<div className="columns is-vcentered">
												<div className="column"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={listreload}/>}</div></div>
												<div className="column">
														<div className="text-right">
															<Button icon className='basic' onClick={()=>setadd(true)}><Icon name='plus circle' /> Add User</Button>
															<Button icon className='basic' onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
														</div>
												</div>
										</div>
									</div>

									<div className="table-responsive">
										<Table celled unstackable>
									    <Table.Header>
									      <Table.Row>
									        <Table.HeaderCell>Email</Table.HeaderCell>
									        <Table.HeaderCell>Fullname</Table.HeaderCell>
													<Table.HeaderCell>Status</Table.HeaderCell>
													<Table.HeaderCell>Description</Table.HeaderCell>
													<Table.HeaderCell>Date Added</Table.HeaderCell>
													<Table.HeaderCell></Table.HeaderCell>
									      </Table.Row>
									    </Table.Header>
											<Table.Body>
													{list.length==0&&<Table.Row negative><Table.Cell  colSpan='6' textAlign="center">No record found</Table.Cell></Table.Row>}
													{list.map(function(data, key){
														return <Table.Row key={key}>
																<Table.Cell>{data.email}</Table.Cell>
																<Table.Cell>{data.fullname}</Table.Cell>
																<Table.Cell>{renderHTML(data.status_string)}</Table.Cell>
																<Table.Cell>{data.description}</Table.Cell>
																<Table.Cell>{data.dateadded}</Table.Cell>
																<Table.Cell collapsing>
																	<Button className='teal' size='tiny' icon onClick={()=>{

																			UpdateProcess({
																				id:data.id,
																				email:data.email,
																				fullname:data.fullname,
																				status:data.status,
																				description:data.description,
																				is_view:data.is_view,
																				is_edit:data.is_edit,
																				is_delete:data.is_delete,
																			})

																	}}><Icon name='edit outline' /></Button>
																	<Button className='red' size='tiny' icon onClick={()=>DeleteProcess(data.id)}><Icon name='trash alternate outline' /></Button>
																</Table.Cell>
														</Table.Row>
													})}
											</Table.Body>
											{list.length>0&&
												<Table.Footer fullWidth>
														<Table.Row>
														<Table.HeaderCell colSpan='6'>
																<div className="dash-footer"><Paginations callbackPagination={paginations} callbackPagenumber={pagenumberfunction}/></div>
														</Table.HeaderCell>
														</Table.Row>
												</Table.Footer>
											}
									  </Table>
									</div>
							</div>
          </div>
					{add&&<AddComponent close={close} reload={listreload} alert={openAlert}/>}
					{update&&<UpdateComponent close={close} reload={listreload} alert={openAlert} data={data}/>}
					{isdelete&&<DeleteComponent close={close} reload={listreload} alert={openAlert} id={isid}/>}
		</React.Fragment>
	)
}
