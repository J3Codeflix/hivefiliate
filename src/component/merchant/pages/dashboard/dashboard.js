import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import { LineChart, PieChart, ColumnChart } from 'react-chartkick'
import 'chart.js'

//import { ResponsiveContainer, LineChart, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {Spinning} from '../../../include/circlespin'

import DatePicker from "react-datepicker"
import moment from 'moment'

import VisitandOrder from './chartvisitorder'
import EarningsRevenue from './chartearnings'


import imgActiveAff from '../../../../assets/image/registered_active_affiliates.png'
import imgTotalEarn from '../../../../assets/image/total_unpaid_earnings.png'

import imgVisit from '../../../../assets/image/visits_total.png'
import imgAffearnings from '../../../../assets/image/affiliate_earnings.png'
import imgNeworder from '../../../../assets/image/new_orders.png'
import imgRevenue from '../../../../assets/image/in_revenue.png'


export default function Dashboard(props) {

	const [search, setsearch]  = useState({
        date_from:'',
		date_to:'',
		is_overall:true
    });

	const [mindateTo, setmindateTo] = useState(null);

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
		});
	}


	function SearchProcess(){
    const searchvalue = {
        is_overall:search.is_overall,
        date_from:moment(new Date(search.date_from)).format('YYYY-MM-DD'),
        date_to:moment(new Date(search.date_to)).format('YYYY-MM-DD'),
    }
    DashboardData(searchvalue);
	}

	function summarydateformat(){
		return 'Summary from '+moment(new Date(search.date_from)).format('MMM DD, YYYY')+' to '+ moment(new Date(search.date_to)).format('MMM DD, YYYY');
	}

	const [typesearch, settypesearch] 			= useState(true);
	const [typedisabled, settypedisabled] 	= useState(true);
	function IsSummary(e){
		if(e==true){
			settypedisabled(true);
		}else{
			settypedisabled(false);
		}
	}

	const [spinner, setspinner] = useState(false);
	const [statedata, setstatedata] = useState({});
	const [datchart, setdatchart] = useState([]);
	const [datayear, setdatayear] = useState([]);
	const [datarevenue, setdatarevenue] = useState([]);
	const [isyear, setisyear] = useState(moment(new Date()).format('YYYY'));

	const [summarydate, setsummarydate] = useState('');

	function DashboardData(searchstr){
		setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_dashboarddata');
        formData.append('search',JSON.stringify(searchstr));
        axios.post('/merchant/dashboard/request.php',formData)
        .then(function (response) {
			let obj = response.data;
			setstatedata(obj);
			setdatayear(obj.data_year);

			console.log(searchstr.is_overall);

			if(searchstr.is_overall==false){
				setsummarydate(summarydateformat());
			}else{
                setsummarydate(obj.summary_date);
			}

            setspinner(false);
        })
        .catch(function (error) {
            console.log(error);
        });
	}


	function DashboardYearData(){
        let formData = new FormData();
        formData.append('type','merchant_dashboardyear');
        formData.append('year',isyear);
        axios.post('/merchant/dashboard/request.php',formData)
        .then(function (response) {
			let obj = response.data;
			setdatchart(obj);
			setisyear(isyear);
        })
        .catch(function (error) {
            console.log(error);
        });
	}

	function DashboardYearDataRevenue(){
        let formData = new FormData();
        formData.append('type','merchant_dashboardrevenue');
        formData.append('year',isyear);
        axios.post('/merchant/dashboard/request.php',formData)
        .then(function (response) {
			let obj = response.data;
			setdatarevenue(obj);
			setisyear(isyear);
        })
        .catch(function (error) {
            console.log(error);
        });
	}




	useEffect(()=>{
		DashboardData(search);
		DashboardYearData();
		DashboardYearDataRevenue();
	},[]);


	return (
		<React.Fragment>
	        <div className="dashboard pagecontent">

				{spinner&&Spinning()}

				<div className="toprowone">
                 <div className="columns is-vcentered">
					<div className="column">
						<div className="columns is-mobile is-vcentered dashrowone">
							<div className="column">
							  <a href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}>
								<div className="rowaffiliates">
									<h3>Registered active affiliates</h3>
									<div className="columns is-vcentered is-mobile">
										<div className="column"><h2>{statedata.total_aff}</h2></div>
										<div className="column text-center"><img src={imgActiveAff}/></div>
									</div>
								</div>
								</a>
							</div>
							<div className="column">
							  <a href={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'}>
								<div className="rowunpaid">
									<h3>Total unpaid earnings</h3>
									<div className="columns is-vcentered is-mobile">
										<div className="column"><h2>{statedata.total_affunpaid}</h2></div>
										<div className="column text-center"><img src={imgTotalEarn}/></div>
									</div>
								</div>
								</a>
							</div>
						</div>
					</div>
					<div className="column rowdate">
						<h3>See summary data for specific period for the active affiliates</h3>
						<Form>
                <div className="columns is-mobile is-vcentered">
                    <div className="column">
                        <Form.Group widths='equal'>
                            <div className="date-wrapper">
															<DatePicker
				    										disabled={typedisabled}
                                selected={search.date_from}
                                onChange={date => setFromDate(date)}
                                placeholderText="Date From"/>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="column">
                        <Form.Group widths='equal'>
                            <div className="date-wrapper">
															<DatePicker
					    									disabled={typedisabled}
                                selected={search.date_to}
                                minDate={mindateTo}
                                onChange={date => setsearch({...search,dateto:date})}
                                placeholderText="Date To"/>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="column is-one-quarter">
											<Form.Group widths='equal'>
												<Button icon className="blue" disabled={typedisabled} labelPosition='right' onClick={()=>SearchProcess()}><Icon name='arrow alternate circle right outline' />Show</Button>
											</Form.Group>
                    </div>
                </div>
								<Checkbox id="icheck" defaultChecked={typesearch} onChange={(e)=>{
									if(e.target.checked==false){
										//setDateDefault();
										setsearch({...search,is_overall:false});
									}else{
										setsearch({...search,date_from:'',date_to:'',is_overall:false})
										const searchss = {date_from:'',date_to:'',is_overall:false};

										DashboardData(searchss);
									}
									IsSummary(e.target.checked);
								}} toggle label='See overall summary'/>
              </Form>
					</div>
				 </div>
				</div>

				<div className="summary-date">{summarydate}</div>

				<div className="summary-status">
					<div className="columns is-mobile is-vcentered">

						<div className="column">
							<div className="columns is-vcentered">
								<div className="column">
								 <a href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}>
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column text-center">
												<img src={imgVisit}/>
											</div>
											<div className="column">
												<h3>Visit Total</h3>
												<h2>{statedata.total_visit}</h2>
											</div>
										</div>
									</div>
									</a>
								</div>
								<div className="column">
								  <a href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}>
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column text-center">
												<img src={imgAffearnings}/>
											</div>
											<div className="column">
												<h3>Affiliate earnings</h3>
												<h2>{statedata.total_earnings}</h2>
											</div>
										</div>
									</div>
									</a>
								</div>
							</div>
						</div>

						<div className="column">
							<div className="columns is-vcentered">
								<div className="column">
								  <a href={process.env.PUBLIC_URL+'/orders/approved'}>
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column text-center">
												<img src={imgNeworder}/>
											</div>
											<div className="column">
												<h3>Order</h3>
												<h2>{statedata.total_order}</h2>
											</div>
										</div>
									</div>
									</a>
								</div>
								<div className="column">
									<a href={process.env.PUBLIC_URL+'/orders/approved'}>
									<div className="summary-column">
										<div className="columns is-mobile is-vcentered">
											<div className="column text-center">
												<img src={imgRevenue}/>
											</div>
											<div className="column">
												<h3>In revenue</h3>
												<h2>{statedata.total_price}</h2>
											</div>
										</div>
									</div>
									</a>
								</div>
							</div>
						</div>

					</div>
				</div>

				<VisitandOrder/>
				<EarningsRevenue/>



				{/*<div className="dashboard-chart">
					<div className="dashboard-visitor">
						<div className="is-clearfix topchartSearch">
							<div className="floatright">
								<Form>
									<Form.Field inline>
										<label>Affiliates Earnings and Revenue</label>
										<Select selectOnBlur={false} defaultValue={isyear} placeholder='Select Year' options={datayear} />
										<Button icon className="blue" labelPosition='right'><Icon name='arrow alternate circle right outline' />Show</Button>
									</Form.Field>
								</Form>
							</div>
						</div>
						<LineChart data={datarevenue} discrete={true}  download="Affiliates and Revenue" ytitle="Value in $USD"/>
					</div>
				</div>*/}


            </div>
		</React.Fragment>
	)
}
