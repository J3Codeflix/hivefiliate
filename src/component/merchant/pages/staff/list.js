import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'


import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import {windowReload,RootLink} from '../../../include/merchant_redirect'

import Addstaff from './action/add'
import EditStaff from './action/edit'
import Delete from './action/delete'



export default function Staff(props) {

    /* Spinner and Alert */
		const [successmsg, setsuccess] = useState(false);
		const [errormsg, seterror] = useState(false);
		function CloseAlert(data){
			setsuccess(data);
			seterror(data);
		}

		const [stafflogin, setstafflogin] = useState('');

    /* List with paginations
    ---------------------------------------------*/
    const [spinner,setspinner] = useState(false);
    const [search, setsearch]  = useState({
        keywords:null,
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

    function TableList(page,searchstr){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_stafflist');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/merchant/staff/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setentry(obj.entries.val);
            setentrytype(obj.entries.type);
            setlist(obj.listtable);
            setpaginations(obj.paginations);
            settotaldata(obj.paginations.paginations.total_records);
						setstafflogin(RootLink('login/?mode=staff&store='+obj.merchant.hash_staff));
            setspinner(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    function reloadEntries(){
        TableList(pagenumber,search);
    }

    /* Search */
    function SearchProcess(){
        TableList(pagenumber,search);
    }


    /* Modal Add */
    const [addstaff, setaddstaf] = useState(false);
    const [iseditstaff, seteditstaff] = useState(false);
    const [isdelete, setisdelete] = useState(false);
    const [idstaff, setidstaff] = useState(null);
    function AddNew(){
        setaddstaf(true);
    }

    function Istaffedit(id){
        setidstaff(id);
        seteditstaff(true);
    }

    function Isdelete(id){
        setidstaff(id);
        setisdelete(true);
    }

    /* Close Modal
    ---------------------------------------------*/
    function CloseModal(data){
        setaddstaf(data);
        seteditstaff(data);
        setisdelete(data);
    }

    /* Trigger Reload List
    ---------------------------------------------*/
    function ReloadList(data){
        if(data==true){
            TableList(pagenumber,search);
        }
    }

    function reloadEntries(){
        TableList(pagenumber,search);
    }
    function showtheAlert(data){
        if(data==true){setsuccess(true);}
        if(data==false){seterror(true);}
    }
    const [alertmessage, setalertmessage] = useState(null);
    function showtextMessage(data){
        setalertmessage(data);
    }

		/* Staff link Generation */
		const [genspin, setgenspine] = useState(false);
		function GeneratenewLink(){
			CloseAlert(false);
			setgenspine(true);
			let formData = new FormData();
			formData.append('type','merchant_generatestafflogin');
			axios.post('/merchant/staff/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					if(obj==1){
						setsuccess(true);
						setalertmessage('Successfully generate new link');
						TableList(pagenumber,search);
					}
					setgenspine(false);
			})
			.catch(function (error) {
					console.log(error);
			});
		}

		function SendNewLink(){
			CloseAlert(false);
			setgenspine(true);
			let formData = new FormData();
			formData.append('type','merchant_sendnewloginLink');
			formData.append('link',stafflogin);
			axios.post('/merchant/staff/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					if(obj>0){
						setsuccess(true);
						setalertmessage('Successfully sent generated link');
					}
					setgenspine(false);
			})
			.catch(function (error) {
					console.log(error);
			});
		}

    useEffect(()=>{
        TableList(pagenumber,search);
    },[]);

	return (
		<React.Fragment>
	        <div className="staff-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column"><h2 className="titlewrapper">Staff Accounts</h2></div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon onClick={()=>AddNew()}><Icon name='plus' /> Add Staff</Button>
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Affiliate not successfully registered'/>}

								<div className="staff-link">
									{spinner&&Spinning()}
									{/*<Message
										warning
								    header='Generate New Login Link'
								    content='You can securely generate new login link for your staff. Please do not forget to send them a new link.'
								  />*/}
									<Form>
										<Form.Group widths='equal'>
											<Form.Field>
												<Input value={stafflogin} fluid readOnly={true} />
											</Form.Field>
											<Form.Field>
													{/*<Button className="green" loading={genspin} onClick={()=>GeneratenewLink()} icon labelPosition='right'>Generate new login link<Icon name='right arrow' /></Button>*/}
													<Button className="green" disabled={list.length==0} loading={genspin} onClick={()=>SendNewLink()} icon labelPosition='right'>Email this link to all active Staff<Icon name='right arrow' /></Button>
											</Form.Field>
										</Form.Group>
									</Form>
								</div>

                <div className="table-wrapper">
                    {spinner&&Spinning()}

                    <div className="table-button">
				    				<div className="columns is-mobile is-vcentered">
			              <div className="column is-one-third"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={reloadEntries}/>}</div></div>
			              <div className="column">
                          <div className="position-right">
                             <Form>
                                <Form.Field>
                                        <Input
                                            action={{
                                            color: 'blue',
                                            labelPosition: 'right',
                                            icon: 'search',
                                            content: 'Search',
                                            onClick: ()=>SearchProcess()
                                            }}
                                            actionPosition='right'
                                            placeholder='Enter your search'
                                            onChange={(e)=>setsearch({...search,keywords:e.target.value})}
                                        />
                                </Form.Field>
                             </Form>
                          </div>
			              </div>
			            </div>
				    </div>


                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Permission</Table.HeaderCell>
                                    <Table.HeaderCell>Last Logged</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
			                    			{list.map(function(data, key){
	  					          				return <Table.Row key={key}>
	  					            					<Table.Cell collapsing>{data.fullname}</Table.Cell>
                                    <Table.Cell collapsing>{data.email}</Table.Cell>
                                    <Table.Cell>
                                        <div className="columns _view">
                                            <div className="column is-one-quarter"><span className="_viewtitle">Dashboard:</span></div>
                                            {data.dash_view=='true'&&<div className="column"><span className="_viewspan"><Icon name='check circle outline' />View</span></div>}
                                        </div>
                                        <div className="columns _view">
                                            <div className="column is-one-quarter"><span className="_viewtitle">Affiliate:</span></div>
                                            <div className="column">{data.aff_view=='true'&&<span className="_viewspan"><Icon name='check circle outline' />View</span>}
                                            {data.aff_edit=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Edit</span>}
                                            {data.aff_pay=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Pay</span>}
                                            {data.aff_delete=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Delete</span>}</div>
                                        </div>
                                        <div className="columns _view">
                                            <div className="column is-one-quarter"><span className="_viewtitle">Order:</span></div>
                                            <div className="column">{data.order_view=='true'&&<span className="_viewspan"><Icon name='check circle outline' />View</span>}
                                            {data.order_edit=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Edit</span>}</div>
                                        </div>
                                        <div className="columns _view">
                                            <div className="column is-one-quarter"><span className="_viewtitle">Banner:</span></div>
                                            <div className="column">{data.bann_view=='true'&&<span className="_viewspan"><Icon name='check circle outline' />View</span>}
                                            {data.bann_edit=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Edit</span>}
                                            {data.bann_delete=='true'&&<span className="_viewspan"><Icon name='check circle outline' />Delete</span>}</div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{data.last_log}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button className='red' size='tiny' icon onClick={()=>Isdelete(data.id)}><Icon name='trash alternate' />Delete</Button>
                                        <Button className='green' size='tiny' icon onClick={()=>Istaffedit(data.id)}><Icon name='pen square' />Edit</Button>
                                    </Table.Cell>
						  					        </Table.Row>
                                })}
	  					    					</Table.Body>
                            {list.length>0&&
                            <Table.Footer fullWidth>
                                <Table.Row>
                                <Table.HeaderCell colSpan='5'>
                                    <div className="dash-footer"><Paginations callbackPagination={paginations} callbackPagenumber={pagenumberfunction}/></div>
                                </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
	                				}
                        </Table>
                    </div>
                </div>
            </div>

            {addstaff&&<Addstaff
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
            />}
            {iseditstaff&&<EditStaff
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
                    idCallback={idstaff}
            />}
            {isdelete&&<Delete
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
                    idCallback={idstaff}
            />}


		</React.Fragment>
	)
}
