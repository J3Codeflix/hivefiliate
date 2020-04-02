import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'

import DatePicker from "react-datepicker"
//import Moment from 'react-moment'
import moment from 'moment'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'
import {windowReload} from '../../../include/merchant_redirect'
import AddAffiliate from './action/add'
import Legends from './action/legend'
import Affiliateinfo from './affcomponent/affroot'

import SentPayment from './affcomponent/sentpayment'

import {UserContext} from '../../layout/userContext'
export default function PendingAffiliates(props) {

	  /* User Context */
	const usersContext = useContext(UserContext);
	let stafflog	 		 = 0;
  let view_aff 			 = true;
	let view_edit 		 = true;
	let view_pay 			 = true;
	let view_delete 	 = true;
	if(usersContext){
		  stafflog	 				= usersContext.stafflog;
			if(stafflog!=0){
				view_aff  		  = usersContext.staff_permission.affiliate.view=='true'?true:false;
				view_edit  		  = usersContext.staff_permission.affiliate.edit=='true'?true:false;
				view_pay  		  = usersContext.staff_permission.affiliate.pay=='true'?true:false;
				view_delete  		= usersContext.staff_permission.affiliate.delete=='true'?true:false;
			}
	}


  /* Spinner and Alert */
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}


    /* List with paginations
    ---------------------------------------------*/
    const [spinner,setspinner] = useState(false);
    const [search, setsearch]  = useState({
        keywords:null,
        datefrom:null,
        dateto:null,
        status:'is_pending'
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

    const [mindateTo, setmindateTo] = useState(null);
    function setFromDate(date){
        var fromdate                = moment(new Date(date)).format('MM/DD/YYYY');
        fromdate                    = new Date(fromdate);
        var todate                  = moment(new Date(fromdate)).add(1, 'days').format('MM/DD/YYYY');
        setmindateTo(new Date(todate));
        setsearch({...search,datefrom:new Date(fromdate),dateto:new Date(todate)});
    }

    function pagenumberfunction(page){
        TableList(page,search);
    }

    function TableList(page,searchstr){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_listaffiliate');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/merchant/affiliate/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setentry(obj.entries.val);
            setentrytype(obj.entries.type);
            setlist(obj.listtable);
            setpaginations(obj.paginations);
            settotaldata(obj.paginations.paginations.total_records);
            setspinner(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    /* Search
    ---------------------------------------------*/
    function SearchProcess(){
        const searchvalue = {
            keywords:search.keywords,
            datefrom:moment(new Date(search.datefrom)).format('YYYY-MM-DD'),
            dateto:moment(new Date(search.dateto)).format('YYYY-MM-DD'),
        }
        TableList(pagenumber,searchvalue);
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


    /* Action Modal
    ---------------------------------------------*/
		const [paysent, setpaysent] = useState(false);
    const [addnew, setaddnew] = useState(false);
    function AddNew(){
        setaddnew(true);
    }
    const [affinfo, setaffinfo] = useState(false);
    const [idaff, setidaff] = useState(null);

    function infoaffiliate(id){
        setaffinfo(true);
        setidaff(id);
    }

    /* Close Modal
    ---------------------------------------------*/
    const [islegend, showLegend] = useState(false);
    function CloseModal(data){
        setaddnew(data);
        showLegend(data);
        setaffinfo(data);
				setpaysent(data);
    }

    useEffect(()=>{
        TableList(pagenumber,search);
    },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column"><h2 className="titlewrapper">Active Affiliates</h2></div>
                            <div className="column">
                                {view_edit==true&&<div className="position-right">
                                    <Button className='black' icon onClick={()=>AddNew()}><Icon name='plus' /> Add Affiliate</Button>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="table-navigation">
                        <Menu icon='labeled'>
														<Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}><Icon name='thumbs up outline'/>Active Affiliates</Menu.Item>
														<Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/pending'}><Icon name='question circle outline'/>Pending Applications</Menu.Item>
														<Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/denied'}><Icon name='thumbs down outline'/>Denied Applications</Menu.Item>
														<Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/block'}><Icon name='dont'/>Block Affiliates</Menu.Item>
														<Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/deleted'}><Icon name='trash alternate outline'/>Deleted Affiliates</Menu.Item>
                        </Menu>
                    </div>
                </div>


                {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}
								{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Affiliate not successfully registered'/>}


                <div className="table-wrapper">
                    {spinner&&Spinning()}
                    <div className="table-search">
                        <Form>
                            <div className="columns is-mobile is-vcentered">
                                <div className="column is-one-quarter">
                                    <Form.Group widths='equal'>
                                        <div className="date-wrapper">
                                            <DatePicker
                                                showMonthDropdown
                                                showYearDropdown
                                                selected={search.datefrom}
                                                onChange={date => setFromDate(date)}
                                                placeholderText="Date From"/>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="column is-one-quarter">
                                    <Form.Group widths='equal'>
                                        <div className="date-wrapper">
                                            <DatePicker
                                                showMonthDropdown
                                                showYearDropdown
                                                selected={search.dateto}
                                                minDate={mindateTo}
                                                onChange={date => setsearch({...search,dateto:date})}
                                                placeholderText="Date To"/>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="column">
                                    <Form.Group widths='equal'>
                                        <Form.Input fluid placeholder='Enter Search' onChange={(e)=>setsearch({...search,keywords:e.target.value})}/>
                                    </Form.Group>
                                </div>
                                <div className="column is-one-fifth">
                                    <Form.Group widths='equal'>
                                        <Button className='blue' fluid icon onClick={()=>SearchProcess()}><Icon name='search' /> Search</Button>
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div className="table-button">
								    	<div className="columns is-mobile is-vcentered">
							              <div className="column is-one-third"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={reloadEntries}/>}</div></div>
							              <div className="column">
	                              <div className="position-right">
	                                <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh'/> Refresh</Button>
	                              </div>
							              </div>
							            </div>
								    </div>


                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Unique Visitors</Table.HeaderCell>
                                    <Table.HeaderCell>Approved Orders</Table.HeaderCell>
                                    <Table.HeaderCell>Pending Orders</Table.HeaderCell>
                                    <Table.HeaderCell>Paid Earnings</Table.HeaderCell>
                                    <Table.HeaderCell>Unpaid Earnings</Table.HeaderCell>
																		<Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='9' textAlign="center">No record found</Table.Cell></Table.Row>}
						                    {list.map(function(data, key){
				  					          		return <Table.Row key={key}>
							  					            <Table.Cell>{data.id}</Table.Cell>
			                                <Table.Cell>{data.fullname}</Table.Cell>
			                                <Table.Cell>{data.email}</Table.Cell>
			                                <Table.Cell>{data.unique_visitors}</Table.Cell>
			                                <Table.Cell>{data.approved_orders}</Table.Cell>
			                                <Table.Cell warning>{data.pending_orders}</Table.Cell>
			                                <Table.Cell positive>{data.paid_earnings}</Table.Cell>
			                                <Table.Cell negative>{data.unpaid_earnings}</Table.Cell>
																			<Table.Cell><Button className='teal' size='tiny' icon onClick={()=>infoaffiliate(data.id)}><Icon name='cog' /></Button></Table.Cell>
	  					        						</Table.Row>
                                })}
	  					    					</Table.Body>
                            {list.length>0&&
                            <Table.Footer fullWidth>
                                <Table.Row>
                                <Table.HeaderCell colSpan='9'>
                                    <div className="dash-footer"><Paginations callbackPagination={paginations} callbackPagenumber={pagenumberfunction}/></div>
                                </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
	                					}

                        </Table>
                    </div>
                </div>
            </div>

            {addnew&&<AddAffiliate
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
            />}
            {islegend&&<Legends  closeTrigger={CloseModal}/>}
            {affinfo&&<Affiliateinfo
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
                    idffiliate={idaff}
										view={view_aff}
										edit={view_edit}
										pay={view_pay}
										delete={view_delete}
            />}

						{paysent&&<SentPayment
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
            />}



		</React.Fragment>
	)
}
