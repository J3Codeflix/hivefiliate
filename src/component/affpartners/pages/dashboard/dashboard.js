import React, {useState, useEffect, useContext, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Popup, Icon, Step, Checkbox } from 'semantic-ui-react'
import axios from 'axios'

import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'

import DatePicker from "react-datepicker"
import moment from 'moment'
import {UserContext} from '../../layout/userContext'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import imgAffearnings from '../../../../assets/image/affiliate_earnings.png'



export default function Dashboard(props) {


	/* -------- User Content -------------------------*/
	const usersContext = useContext(UserContext);
	let context_affiliatelink      = null;
	if(usersContext){
		context_affiliatelink      = usersContext.affiliate_link;
	}

  const buttonEl = useRef(null);
	const [search, setsearch]  = useState({
    date_from:'',
		date_to:'',
		is_overall:'true'
	});

	const [copied, setcopied] = useState(false);

	const [typesearch, settypesearch] 		= useState(true);
	const [typedisabled, settypedisabled] 	= useState(true);
	const [mindateTo, setmindateTo] 		= useState(null);

  function setFromDate(date){
      var fromdate                = moment(new Date(date)).format('MM/DD/YYYY');
      fromdate                    = new Date(fromdate);
      var todate                  = moment(new Date(fromdate)).add(1, 'days').format('MM/DD/YYYY');
      setmindateTo(new Date(todate));
      setsearch({...search,date_from:new Date(fromdate),date_to:new Date(todate)});
	}

	function setDateDefault(){
			var from_date           = moment(new Date()).format('MM/DD/YYYY');
			var startdate 			= moment(new Date(from_date)).subtract(1, "months");
			setsearch({
				...search,
				date_from:new Date(startdate),
				date_to:new Date(from_date),
				is_overall:search.is_overall,
			});
	}

	function IsSummary(e){
			if(e==true){
				settypedisabled(true);
			}else{
				settypedisabled(false);
			}
	}



	const [summaryearn, setsummaryearn] = useState({});


	/* List Table */
	const [spinner, setspinner] = useState(false);
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
        formData.append('type','affiliate_dashboardorder');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/affiliates/dashboard/request.php',formData)
        .then(function (response) {
			  let obj = response.data;
			      setsummaryearn(obj.total);
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
    function reloadEntries(){
        TableList(pagenumber,search);
    }
    function SearchProcess(){
        const searchvalue = {
            date_from:moment(new Date(search.date_from)).format('YYYY-MM-DD'),
						date_to:moment(new Date(search.date_to)).format('YYYY-MM-DD'),
						is_overall:search.is_overall
        }
        TableList(pagenumber,searchvalue);
		}



	useEffect(()=>{
		TableList(pagenumber,search);
	},[]);


	return (
		<React.Fragment>
	        <div className="affdashboard pagecontent">

				<div className="socialmedia">
				    <span>Share with social media: </span>
					<Button as="a" href="https://facebook.com/" target="_blank"  circular color='facebook' icon='facebook' />
					<Button as="a" href="https://twitter.com/"  target="_blank" circular color='twitter' icon='twitter' />
					<Button as="a" href="https://gmail.com/" 	target="_blank" circular color='google plus' icon='google plus' />
					<Button as="a" href="https://linkedin.com/" target="_blank" circular color='linkedin' icon='linkedin' />
					<Button as="a" href="https://instagram.com/" target="_blank" circular color='instagram' icon='instagram' />
					<Button as="a" href="https://youtube.com/" target="_blank" circular color='youtube' icon='youtube' />
				</div>

				<div className="referallinks">
					<Form>
						<Form.Group widths='equal'>
							<Form.Field>
								<label>Your referral link</label>
								<Popup trigger={<Input fluid value={context_affiliatelink} />} content='Text Copied!' inverted open={copied} position='bottom left'/>
							</Form.Field>
							<Form.Field>
								<label>&nbsp;</label>
								<CopyToClipboard text={context_affiliatelink}
									onCopy={() => {
										setcopied(true);
										setTimeout(function(){ setcopied(false); }, 3000);
									}}>
									<Button icon className="blue" labelPosition='left'><Icon name='clipboard check' />Copy to clipboard</Button>
								</CopyToClipboard>
								<Button as="a" href={process.env.PUBLIC_URL+'/affiliates/linkgenerator'} icon className="green" labelPosition='left'><Icon name='code' />Generate other links</Button>
							</Form.Field>
						</Form.Group>
					</Form>
				</div>

				<div className="summary-date-aff">Your earnings information</div>
				<div className="summary-aff">
					<div className="columns is-vcentered">
						<div className="column">
							<div className="columns is-mobile">
								<div className="column">
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column is-one-third text-center">
												<img src={imgAffearnings}/>
											</div>
											<div className="column">
												<h3>Paid Earnings</h3>
												<h2>{summaryearn.total_earnings}</h2>
											</div>
										</div>
									</div>
								</div>
								<div className="column">
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column is-one-third text-center">
												<img src={imgAffearnings}/>
											</div>
											<div className="column">
												<h3>Unpaid Earnings</h3>
												<h2>{summaryearn.total_unpaid}</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="column datesummary">
							<h3>See summary data for specific period</h3>
							<Form>
								<div className="columns is-mobile is-vcentered">
									<div className="column">
										<Form.Group widths='equal'>
											<div className="date-wrapper">
												<DatePicker
													selected={search.date_from}
													onChange={date => setFromDate(date)}
													placeholderText="Date From" disabled={typedisabled}/>
											</div>
										</Form.Group>
									</div>
									<div className="column">
										<Form.Group widths='equal'>
											<div className="date-wrapper">
												<DatePicker
													selected={search.date_to}
													minDate={mindateTo}
													onChange={date => setsearch({...search,dateto:date})}
													placeholderText="Date To" disabled={typedisabled}/>
											</div>
										</Form.Group>
									</div>
									<div className="column is-one-quarter">
										<Form.Group widths='equal'>
											<Button ref={buttonEl} icon className="blue" disabled={typedisabled} labelPosition='right' onClick={()=>SearchProcess()}><Icon name='arrow alternate circle right outline' />Show</Button>
										</Form.Group>
									</div>
								</div>
								<Checkbox id="icheck" defaultChecked={typesearch} onChange={(e)=>{
									if(e.target.checked==false){
										//setDateDefault();
									}else{
										setsearch({...search,date_from:'',date_to:'',is_overall:false})
										const searchss = {date_from:'',date_to:'',is_overall:false};
										TableList(pagenumber,searchss);
									}
									IsSummary(e.target.checked);
								}} toggle label='See overall summary'/>
							</Form>
						</div>
					</div>
				</div>

				<div className="dashboard-table">
					<div className="table-wrapper">

						{spinner&&Spinning()}

						<div className="tableaffstatus responsivecontainer is-clearfix">
							<div className="is-pulledright">
								<Step.Group unstackable>
									<Step><Icon name='user outline' className="text-blury"/>
										<Step.Content>
											<Step.Title>{summaryearn.total_visit}</Step.Title>
											<Step.Description>Total Visitor</Step.Description>
										</Step.Content>
									</Step>
									<Step><Icon name='calendar outline' className="text-blury"/>
										<Step.Content>
											<Step.Title>{summaryearn.total_order}</Step.Title>
											<Step.Description>Total Order</Step.Description>
										</Step.Content>
									</Step>
									<Step><Icon name='dollar' className="text-blury"/>
										<Step.Content>
											<Step.Title>{summaryearn.total_price}</Step.Title>
											<Step.Description>Total Price</Step.Description>
										</Step.Content>
									</Step>
									<Step><Icon name='dollar' className="text-blury"/>
										<Step.Content>
											<Step.Title>{summaryearn.total_allearnings}</Step.Title>
											<Step.Description>Total Earnings</Step.Description>
										</Step.Content>
									</Step>
								</Step.Group>
							</div>
						</div>

						<div className="table-responsive">
                <Table celled selectable compact>
  								<Table.Header>
  									<Table.Row>
  										<Table.HeaderCell>Date</Table.HeaderCell>
  										<Table.HeaderCell>Order</Table.HeaderCell>
  										<Table.HeaderCell>Price</Table.HeaderCell>
  										<Table.HeaderCell>Earnings</Table.HeaderCell>
  										<Table.HeaderCell>Conversion</Table.HeaderCell>
  									</Table.Row>
  								</Table.Header>
  								<Table.Body>
                    {list.length==0&&<Table.Row negative><Table.Cell  colSpan='6' textAlign="center">No record found</Table.Cell></Table.Row>}
  			            {list.map(function(data, key){
                        return <Table.Row key={key}>
                            <Table.Cell>{data.dateadded}</Table.Cell>
                            <Table.Cell>{data.order}</Table.Cell>
                            <Table.Cell>{data.order_price}</Table.Cell>
                            <Table.Cell>{data.aff_earnings}</Table.Cell>
                            <Table.Cell>{data.conversion}</Table.Cell>
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


            </div>
		</React.Fragment>
	)
}
