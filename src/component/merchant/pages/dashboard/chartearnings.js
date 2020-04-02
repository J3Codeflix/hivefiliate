import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import { LineChart, PieChart, ColumnChart } from 'react-chartkick'
import 'chart.js'

//import { ResponsiveContainer, LineChart, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {Spinning} from '../../../include/circlespin'

import DatePicker from "react-datepicker"
import moment from 'moment'

import imgActiveAff from '../../../../assets/image/registered_active_affiliates.png'
import imgTotalEarn from '../../../../assets/image/total_unpaid_earnings.png'

import imgVisit from '../../../../assets/image/visits_total.png'
import imgAffearnings from '../../../../assets/image/affiliate_earnings.png'
import imgNeworder from '../../../../assets/image/new_orders.png'
import imgRevenue from '../../../../assets/image/in_revenue.png'


export default function EarningsRevenue(props) {

	/* Dashboard Datepicking Visit and Order */
	const [spin, setspin] = useState(false);
	const [selection,setselection] = useState(4);
	const [arryear,setarryear] = useState([]);
	const [defyear, setdefyear] = useState(new Date().getFullYear());
	const [visitorder,setvisitorder] = useState([]);

	const [monthsdate, setmonthsdate] = useState(new Date());
	const [daydate, setdaydate] 			= useState(new Date());

	const [stdate, setstdate] 				= useState(new Date());
	const [enddate, setenddate] 			= useState(new Date());
	const [mindate, setmindate]   		= useState(null);
  function setrangedate(date){
    var fromdate                		= moment(new Date(date)).format('MM/DD/YYYY');
    fromdate                    		= new Date(fromdate);
    var todate                  		= moment(new Date(fromdate)).add(6, 'days').format('MM/DD/YYYY');
    setmindate(new Date(todate));
		setstdate(new Date(fromdate));
		setenddate(new Date(todate));
	}

	function YearOptions(){
	    let formData = new FormData();
	    formData.append('type','year_options');
	    axios.post('/merchant/dashboard/request.php',formData)
	    .then(function (response) {
					let obj = response.data;
					setarryear(obj);
			})
	    .catch(function (error) {
	    });
	}

	function ShowVisitOrder(data,selec){

		  setspin(true);
		  let val 		= '';
			let val2 		= '';

			if(selec==1){
				val=moment(new Date(data)).format('YYYY-MM-DD');
			}
			if(selec==2){
				val=moment(new Date(data)).format('YYYY-MM-DD');
				val2=moment(new Date(enddate)).format('YYYY-MM-DD');
			}

			if(selec==3){
				val=moment(new Date(data)).format('YYYY-MM-DD');
			}

			if(selec==4){
				val=data;
			}
		  const dataval = {
				thetype:selec,
				value:val,
				value2:val2
			}

			console.log(dataval);

	    let formData = new FormData();
	    formData.append('type','earningsandrevenue');
			formData.append('info',JSON.stringify(dataval));
	    axios.post('/merchant/dashboard/request.php',formData)
	    .then(function (response) {
					let obj = response.data;
					setvisitorder(obj);
					setspin(false);
			})
	    .catch(function (error) {
	    });
	}


  /* Dashboard Datepicking Visit and Order End*/

	useEffect(()=>{
		YearOptions();
		ShowVisitOrder(defyear,4);
		setrangedate(new Date());
	},[]);


	return (
		<React.Fragment>

				<div className="dashboard-chart">
				  {spin&&Spinning()}
				  <div className="dashboard-header">
					  <div className="columns is-mobile is-vcentered">
						  <div className="column is-one-fifth"><h2>Affiliates Earnings and Revenue</h2></div>
							<div className="column">
								<div className="columns is-mobile is-vcentered">
									<div className="column">
											<Button.Group basic>
												<Button className={selection==1?'active':''} onClick={()=>{
													setselection(1);
													ShowVisitOrder(new Date(),1);
												}}>Days</Button>
												<Button className={selection==2?'active':''} onClick={()=>{
													setselection(2);
													ShowVisitOrder(stdate,2);
												}}>Weeks</Button>
												<Button className={selection==3?'active':''} onClick={()=>{
													ShowVisitOrder(monthsdate,3);
													setselection(3)
												}}>Months</Button>
												<Button className={selection==4?'active':''} onClick={()=>{
													setselection(4);
													ShowVisitOrder(defyear,4);
												}}>Year</Button>
											</Button.Group>
									</div>


									{selection==1&&<div className="column is-one-quarter">
										<Form>
											<div className="date-wrapper">
												<DatePicker
													selected={daydate}
													onChange={date => {
														ShowVisitOrder(date,1);
														setdaydate(date)
													}}
													/>
											</div>
										</Form>
									</div>}

									{selection==2&&<div className="column">
										<Form>
										  <div className="columns is-mobile">
												<div className="column">
													<div className="date-wrapper">
														<DatePicker
															selected={stdate}
															onChange={date => {
																setrangedate(date);
																ShowVisitOrder(date,2);
															}}
															/>
													</div>
												</div>
												<div className="column">
													<div className="date-wrapper">
														<DatePicker
														  minDate={mindate}
															selected={enddate}
															onChange={date => {
																setrangedate(date);
																ShowVisitOrder(stdate,2);
															}}
															/>
													</div>
												</div>
											</div>
										</Form>
									</div>}

									{selection==3&&<div className="column is-one-quarter">
										<Form>
											<div className="date-wrapper">
												<DatePicker
													selected={monthsdate}
													dateFormat="MM-yyyy"
													showMonthYearPicker
													onChange={date => {
														setmonthsdate(new Date(date));
														ShowVisitOrder(date,3);
													}}/>
											</div>
										</Form>
									</div>}

									{selection==4&&<div className="column is-one-quarter">
										<Select
											selectOnBlur={false}
											defaultValue={defyear}
											options={arryear}
											onChange={(e, { value }) => {
												ShowVisitOrder(value, 4);
											}}
											/>
									</div>}

								</div>
							</div>
						</div>
					</div>
					<div className="dashboard-visitor">
						{selection==4&&<LineChart data={visitorder} discrete={true}  download="Merchant and Affiliate Revenue" ytitle="Value in $USD" thousands="," prefix="$" />}
						{(selection==1||selection==3 || selection==2)&&<ColumnChart data={visitorder} discrete={true}  download="Merchant and Affiliate Revenue" ytitle="Value in $USD" thousands="," prefix="$" />}

					</div>
				</div>
		</React.Fragment>
	)
}
