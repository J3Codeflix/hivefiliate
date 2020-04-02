import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal, Checkbox,Radio, Item, Table } from 'semantic-ui-react'
import renderHTML from 'react-render-html'
import axios from 'axios'
import Paginations from '../../../../../config/pagination'
import EntryList from '../../../../../config/showentries'
import {Spinning, Success, Error} from '../../../../../config/spinner'

export default function PaymentHistoryComponent(props) {

  /* For Modal */
  function closeModal(data){
      props.close(data);
  }
  function callalert(open,data){
      props.alert(open,data);
  }
  function reloadlist(){
      props.reload();
  }


  /* List with paginations
	---------------------------------------------*/
	const [spinner,setspinner] = useState(false);
	const [search, setsearch]  = useState({
      id:props.data.id,
			search_field:'1',
			search_keywords:''
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
			formData.append('type','affiliates_merchantpayment');
			formData.append('search',JSON.stringify(searchstr));
			formData.append('page',page);
			axios.post('/affiliates/request.php',formData)
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
		<div className="modalwrapper">
	      <Modal open={true} size='large' onClose={()=>closeModal(false)}>
        <Modal.Header>Merchant payment to affiliate: {props.data.name}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
	      <Modal.Content>

          {spinner&&Spinning()}

          <div className="tablenotpadded">

            <div className="table-entries">
              <div className="columns is-vcentered is-mobile">
                  <div className="column"><div className="entries-container">{entry>0&&<EntryList entrycallback={entry} entryType={entrytype} lengthCallback={totaldata} callbackreload={listreload}/>}</div></div>
                  <div className="column">
                      <div className="text-right">
                        <Button icon className='basic' onClick={()=>listreload()}><Icon name='refresh' /> Refresh</Button>
                      </div>
                  </div>
              </div>
            </div>

            <div className="table-responsive">
              <Table celled unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Payment Date</Table.HeaderCell>
                    <Table.HeaderCell>Payment By</Table.HeaderCell>
                    <Table.HeaderCell>Sum</Table.HeaderCell>
                    <Table.HeaderCell>Comments</Table.HeaderCell>
                    <Table.HeaderCell>Merchant Comments</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                    {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
                    {list.map(function(data, key){
                      return <Table.Row key={key}>
                          <Table.Cell collapsing>{data.payment_date}</Table.Cell>
                          <Table.Cell>
                            <div><Icon className='teal' name='bullseye'/><span className='strong'>{data.merchant.store_name}</span></div>
                            <div className="text-blur"><Icon name='envelope outline'/>{data.merchant.email}</div>
                          </Table.Cell>
                          <Table.Cell>{data.paid_sum}</Table.Cell>
                          <Table.Cell>{data.comments}</Table.Cell>
                          <Table.Cell>{data.admin_comments}</Table.Cell>
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
		    </Modal.Content>
	     </Modal>
		</div>
	)
}
