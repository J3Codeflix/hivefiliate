import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import Addorder from './action/add'
import Updateorder from './action/edit'

import DatePicker from "react-datepicker"
import moment from 'moment'

import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'

import {UserContext} from '../../layout/userContext'
import axios from 'axios'
export default function OrdersDenied(props) {

  /* User Context */
 const usersContext = useContext(UserContext);
 let stafflog	 		 = 0;
 let view_order 		 = true;
 let edit_order 		 = true;

 if(usersContext){
     stafflog	 				    = usersContext.stafflog;
     if(stafflog!=0){
       view_order  		    = usersContext.staff_permission.order.view;
       edit_order  		    = usersContext.staff_permission.order.edit;
     }
 }


	 /* List with paginations
    ---------------------------------------------*/
    const [spinner,setspinner] = useState(false);
    const [search, setsearch]  = useState({
        order_id:'',
        affiliate_id:'',
        tracking_method:'',
        order_status:'',
        date_from:'',
        date_to:'',
        is_order:'is_denied',
    });


    const [mindateTo, setmindateTo] = useState(null);
    function setFromDate(date){
        var fromdate                = moment(new Date(date)).format('MM/DD/YYYY');
        fromdate                    = new Date(fromdate);
        var todate                  = moment(new Date(fromdate)).add(1, 'days').format('MM/DD/YYYY');
        setmindateTo(new Date(todate));
        setsearch({...search,date_from:new Date(fromdate),date_to:new Date(todate)});
    }



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
        formData.append('type','merchant_listorders');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/merchant/orders/request.php',formData)
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

    /* Search */
    function SearchProcess(){
        const searchvalue = {
            order_id:search.order_id,
            affiliate_id:search.affiliate_id,
            tracking_method:search.tracking_method,
            order_status:search.order_status,
            date_from:moment(new Date(search.date_from)).format('YYYY-MM-DD'),
            date_to:moment(new Date(search.date_to)).format('YYYY-MM-DD'),
        }
        TableList(pagenumber,searchvalue);
    }


	/* Setup modal Component */
    const [isoff, setisoff] = useState('off');
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
    const [add, setadd] = useState(false);
    const [update, setupdate] = useState(false);
    const [id, setid] = useState(false);
	const [alertmessage, setalertmessage] = useState(null);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}
	function ReloadList(data){
        if(data==true){
            TableList(pagenumber,search);
        }
    }

    function reloadEntries(){
        TableList(pagenumber,search);
    }
	function CloseModal(data){
        setadd(data);
        setupdate(data);
	}
	function showtheAlert(data){
        if(data==true){setsuccess(true);}
        if(data==false){seterror(true);}
	}
    function showtextMessage(data){
        setalertmessage(data);
	}
	function AddFunction(){
		setadd(true);
    }
    function UpdateFunction(id){
        setupdate(true);
        setid(id);
    }


    useEffect(()=>{
        TableList(pagenumber,search);
    },[]);



	return (
		<React.Fragment>
	        <div className="orders pagecontent">

                    {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}
					{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}


					<div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column"><h2 className="titlewrapper">Denied Orders</h2></div>
                            <div className="column">
                                <div className="position-right">
                                    {edit_order==true&&<Button className='black' icon onClick={()=>AddFunction()}><Icon name='plus' /> Add Order</Button>}
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
                                </div>
                            </div>
                        </div>
                    </div>
					<div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' onClick={()=>Public_URL('/orders/approved')}><Icon name='calendar check outline'/>Approved Orders</Menu.Item>
                            <Menu.Item as='a' onClick={()=>Public_URL('/orders/pending')}><Icon name='calendar times outline'/>Pending Orders</Menu.Item>
                            <Menu.Item as='a' onClick={()=>Public_URL('/orders/denied')} active><Icon name='calendar times outline'/>Denied Orders</Menu.Item>
                        </Menu>
                    </div>

                    <div className="searchtable">
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Input fluid autoComplete={isoff} placeholder="Enter order id" onChange={(e)=>setsearch({...search,order_id:e.target.value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <Input fluid autoComplete={isoff} placeholder="Enter affiliate id" onChange={(e)=>setsearch({...search,affiliate_id:e.target.value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <div className="date-wrapper">
                                        <DatePicker
                                            selected={search.date_from}
                                            onChange={date => setFromDate(date)}
                                            placeholderText="Date From"/>
                                    </div>
                                </Form.Field>
                                <Form.Field>
                                        <div className="date-wrapper">
                                            <DatePicker
                                                selected={search.date_to}
                                                minDate={mindateTo}
                                                onChange={date => setsearch({...search,date_to:date})}
                                                placeholderText="Date To"/>
                                        </div>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Select fluid selectOnBlur={false} placeholder="Select tracking method"
                                        options={[
                                            { key: '0', text: 'Tracking by link', value: 'Tracking by link' },
                                            { key: '1', text: 'Tracking by code', value: 'Tracking by code' },
                                            { key: '2', text: 'Tracking by qr', value: 'Tracking by qr' },
                                            { key: '3', text: 'Tracking by sku', value: 'Tracking by sku' },
                                            { key: '4', text: 'Tracking by email', value: 'Tracking by email' },
                                        ]}
                                    onChange={(e, { value }) => setsearch({...search,tracking_method:value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <Select fluid selectOnBlur={false} placeholder="Select order status"
                                         options={[
                                            { key: '0', text: 'Paid', value: 'Paid' },
                                            { key: '1', text: 'Not paid', value: 'Not paid' },
                                            { key: '2', text: 'Incomplete', value: 'Incomplete' },
                                            { key: '3', text: 'Cancelled', value: 'Cancelled' },
                                            { key: '4', text: 'Refunded', value: 'Refunded' },
                                            { key: '5', text: 'Hidden', value: 'Hidden' },
                                         ]}
                                    onChange={(e, { value }) => setsearch({...search,order_status:value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <Button className="blue" onClick={()=>SearchProcess()} icon labelPosition='left'>Search<Icon name='search' /></Button>
                                </Form.Field>
                                <Form.Field></Form.Field>
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
                                    <Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh'/> Refresh</Button>
                                </div>
                            </div>
                            </div>
                        </div>
						<div className="table-responsive">
                        	<Table celled selectable compact>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Order ID</Table.HeaderCell>
										<Table.HeaderCell>Affiliate</Table.HeaderCell>
										<Table.HeaderCell>Payment Status</Table.HeaderCell>
										<Table.HeaderCell>Tracking</Table.HeaderCell>
										<Table.HeaderCell>Price</Table.HeaderCell>
										<Table.HeaderCell>Earnings</Table.HeaderCell>
										<Table.HeaderCell>Date</Table.HeaderCell>
                                        <Table.HeaderCell>Action</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='9' textAlign="center">No record found</Table.Cell></Table.Row>}
			                    {list.map(function(data, key){
                                    return <Table.Row key={key} className={data.statcolor}>
                                        <Table.Cell>{data.order_id}</Table.Cell>
                                        <Table.Cell>{data.name}</Table.Cell>
                                        <Table.Cell>
                                            {data.statcolor=='positive'&&<Icon name="check circle outline"/>}
                                            {data.statcolor=='warning'&&<Icon name="info circle"/>}
                                            {data.statcolor=='negative'&&<Icon name="exclamation triangle"/>}
                                            {data.order_status}
                                        </Table.Cell>
                                        <Table.Cell>{data.tracking_method}</Table.Cell>
                                        <Table.Cell>{data.order_price}</Table.Cell>
                                        <Table.Cell>{data.aff_earnings}</Table.Cell>
                                        <Table.Cell>{data.date_order}</Table.Cell>
                                        <Table.Cell><Button className="blue" icon onClick={()=>UpdateFunction(data.id)}><Icon name='cog' /></Button></Table.Cell>
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

			{add&&<Addorder
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
            />}
            {update&&<Updateorder
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
                    idController={id}
                    view={view_order}
                    edit={edit_order}
            />}
		</React.Fragment>
	)
}
