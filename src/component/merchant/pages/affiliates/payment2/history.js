import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import Paginations from '../../../../include/paginations'
import {Spinning} from '../../../../include/circlespin'
import EntryList from '../../../../include/showentries'

import DatePicker from "react-datepicker"
//import Moment from 'react-moment'
import moment from 'moment'
import {affiliateid} from '../../../../include/queryurl'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'
import {windowReload,returnUrl} from '../../../../include/merchant_redirect'
import AddAffiliate from '../action/add'
import Legends from '../action/legend'
import Affiliateinfo from '../affcomponent/affroot'

import SentPayment from '../affcomponent/sentpayment'

import {UserContext} from '../../../layout/userContext'
export default function AffiliatePaymentHistory(props) {

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
				id:affiliateid()
    });

    const [list, setlist] = useState([]);
    const [pagenumber, setpagenumber] = useState(1);
    const [totaldata, settotaldata] = useState(0);
    const [entry, setentry] = useState(0);
    const [entrytype, setentrytype] = useState('');

		function reloadEntries(){
			TableList(pagenumber,search);
		}

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
        formData.append('type','merchant_invoicepayment');
        formData.append('search',JSON.stringify(search));
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


		const [info, setinfo] = useState({});
		function UnpaidOrder(){
			if(affiliateid()==null){returnUrl('mrcaffiliates/active');}
			setspinner(true);
			let formData = new FormData();
			formData.append('type','affiliate_unpaidorder');
			formData.append('id',affiliateid());
			axios.post('/merchant/affiliate/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setspinner(false);
					setinfo(obj.info);
			})
			.catch(function (error) {
					console.log(error);
			});
		}


    useEffect(()=>{
        UnpaidOrder();
				TableList(pagenumber,search);
    },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
														<div className="column segment-title">
															<h2>{info.name}</h2>
															<p>Earnings information about affiliate # {affiliateid()}</p>
														</div>
                            <div className="column">
                                <div className="position-right">
                                    <Button className='black' icon as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}><Icon name='arrow alternate circle left outline' /> Back to Affiliate</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payment/?affiliate='+affiliateid()}><Icon name='file alternate outline'/>Unpaid Earnings</Menu.Item>
                            <Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory/?affiliate='+affiliateid()}><Icon name='calendar alternate outline'/>Payment History</Menu.Item>
                        </Menu>
                    </div>
                </div>




                <div className="table-wrapper">
                    {spinner&&Spinning()}

                    <div className="table-button">
								    	<div className="columns is-mobile is-vcentered">
							              <div className="column is-one-third"><div className="entries-container"><EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={reloadEntries}/></div></div>
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
                                    <Table.HeaderCell>Payment Date</Table.HeaderCell>
                                    <Table.HeaderCell>Invoice Number</Table.HeaderCell>
                                    <Table.HeaderCell>Affiliate</Table.HeaderCell>
                                    <Table.HeaderCell>Amount</Table.HeaderCell>
																		<Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
						                    {list.map(function(data, key){
				  					          		return <Table.Row key={key}>
							  					            <Table.Cell>{data.payment_date}</Table.Cell>
			                                <Table.Cell>{data.invoice_number}</Table.Cell>
			                                <Table.Cell>
																				{data.id_affiliate}
																				<p className="text-blur">{data.email}</p>
																			</Table.Cell>
			                                <Table.Cell>{data.amount}</Table.Cell>
																			<Table.Cell collapsing>
																				<Button as="a" href={process.env.PUBLIC_URL+'/mrcaffiliates/invoice/?affiliate='+affiliateid()+'&id='+data.reference_id} className='green' size='tiny' icon><Icon name='file alternate outline' /> Invoice Details</Button>
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

		</React.Fragment>
	)
}
