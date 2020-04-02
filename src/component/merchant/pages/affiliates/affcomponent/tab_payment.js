import React,{useState, useEffect} from 'react'
import { Form, Input, Button, Loader, Icon, Message, Table } from 'semantic-ui-react'
import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

import Paginations from '../../../../include/paginations'
import EntryList from '../../../../include/showentries'

import axios from 'axios'

export default function TabPayment(props) {

    const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
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
	function reloadEntries(){
        TableList(pagenumber,search);
    }

	const [search, setsearch] = useState({
		id:props.idffiliate,
		payment_date:null
	});

    function TableList(page,searchstr){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_affpaymenthistory');
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

	/* Delete Payment */
	const [spindelete, setspindelete] = useState(false);
	function deleteAffiliate(id){
		 CloseAlert(false);
		 setspindelete(true);
		 let formData = new FormData();
		 formData.append('type','merchant_deletpayment');
		 formData.append('id',id);
		 axios.post('/merchant/affiliate/request.php',formData)
		 .then(function (response) {
			 let obj = response.data;
			 if(obj==1){
				setsuccess(true);
				TableList(pagenumber,search);
			 }
			 setspindelete(false);
			 if(obj==0){seterror(true);return false;}
		 })
		 .catch(function (error) {return false;});
	}


	useEffect(()=>{
		TableList(pagenumber,search);
	},[]);

	return (
		<div className={spinner?'tablsegment ui bottom attached segment active tab loading':'tablsegment ui bottom attached segment active tab'}>
			{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Payment information successfully deleted'/>}
			{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Payment information not successfully deleted'/>}

			<div className="tabtable table-wrapper table-wrappernone">


                    <div className="table-button">
				    	<div className="columns is-mobile is-vcentered">
			              <div className="column is-one-third">
							  <div className="entries-container">
							  	{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={reloadEntries}/>}
							  </div>
						 </div>
			              <div className="column">
                              <div className="position-right">
                                <Button className='black' icon onClick={()=>TableList(pagenumber,search)}><Icon name='refresh'/> Refresh</Button>
                              </div>
			              </div>
			            </div>
				    </div>

                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Sum</Table.HeaderCell>
                                    <Table.HeaderCell>Comments</Table.HeaderCell>
                                    <Table.HeaderCell>Admin Comments</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
			                    {list.map(function(data, key){
	  					          return <Table.Row key={key} positive>
	  					            <Table.Cell collapsing>{data.payment_date}</Table.Cell>
									<Table.Cell collapsing>{data.paid_sum}</Table.Cell>
									<Table.Cell>{data.comments}</Table.Cell>
									<Table.Cell>{data.admin_comments}</Table.Cell>
									<Table.Cell collapsing><Button size='tiny' loading={spindelete} onClick={()=>deleteAffiliate(data.id)} className='red' icon><Icon name='trash alternate outline'/> Delete</Button></Table.Cell>
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
	)
}
