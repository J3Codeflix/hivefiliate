import React, {useState, useEffect} from 'react'
import { Modal, Label, Table, Icon, Button } from 'semantic-ui-react'
import axios from 'axios'
import {Spinning} from '../../../../include/circlespin'
import Paginations from '../../../../include/paginations'
import EntryList from '../../../../include/showentries'

export default function SentPayment(props) {

  /* Modal close */
  function closeModal(data){
    props.closeTrigger(data);
  }
  function showAlert(data){
    props.showAlertMessage(data);
  }
  function messageText(data){
    props.textalertMessage(data);
  }
  function reloadlist(data){
    props.reloadTrigger(data);
  }

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
        payment_date:null
  });

    function TableList(page,searchstr){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_sentpayment');
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

  useEffect(()=>{
		TableList(pagenumber,search);
	},[]);

	return (
		<div className="modalwrapper">
			<Modal open={true} size='large' onClose={()=>closeModal(false)}>
				<Modal.Header>Payment Sent<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
					<Modal.Content className="modalcontent">

          {spinner&&Spinning()}

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
                          <Table.HeaderCell>Affiliate</Table.HeaderCell>
                          <Table.HeaderCell>Sum</Table.HeaderCell>
                          <Table.HeaderCell>Comments</Table.HeaderCell>
                          <Table.HeaderCell>Admin Comments</Table.HeaderCell>
                      </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      {list.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
                      {list.map(function(data, key){
                        return <Table.Row key={key} positive>
                          <Table.Cell collapsing>{data.payment_date}</Table.Cell>
                          <Table.Cell collapsing>{data.aff_name} (ID:{data.id_aff})</Table.Cell>
                          <Table.Cell collapsing>{data.paid_sum}</Table.Cell>
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

					</Modal.Content>
			</Modal>
		</div>
	)
}
