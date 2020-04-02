import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, List, Header, Icon, Image } from 'semantic-ui-react'
import {UserContext} from '../../../layout/userContext'
import {TrackingScriptURI,StartTrackingURI,MarkPurchaseURI,ProgramAffLink} from '../../../../include/merchant_redirect'
export default function EasyJavscript(props) {

	const usersContext = useContext(UserContext);
	let merchant_id = null;

	if(usersContext){
		merchant_id = usersContext.merchant_id;
	}

	return (
		<React.Fragment>
	        <div class="ui bottom attached segment active tab">
				<div className="tab-wrapper">
					<div className="tracking-visit">
						<div className="segment-title">
							<h2>Tracking Visits</h2>
							<p className="text-blur">Add this code on every page on your website, which can linked from affiliate</p>
						</div>
						<Segment secondary>
							<div>{TrackingScriptURI()}</div>
							<div>{StartTrackingURI()}</div>
						</Segment>
					</div>
					<div className="tracking-purchased">
						<div className="segment-title">
							<h2>Tracking Purchases</h2>
							<p className="text-blur">
								Add this code on the page where the purchase is made and the user has paid for it (I.E. 'Thank You' Page) 'Order' and 'Price' must be replaced with your data I.E
							</p>
							<Message warning>
								<Message.Header>Important Notes</Message.Header>
								<Message.List>
								<Message.Item>'order' - the unique ID of the order, we are using it to prevent fake earnings for affiliates</Message.Item>
								<Message.Item>'price' - the price of the order, we are using it calculate the earnings for affiliates, must be without the currency sign</Message.Item>
								</Message.List>
							</Message>
						</div>
						<Segment secondary>
							<div>{TrackingScriptURI()}</div>
							<div>{MarkPurchaseURI()}</div>
						</Segment>
					</div>
					<div className="tracking-info">
						<Message warning visible>If you are having problems with the setup or don't know what to, check this <a target="_blank" href="http://www.affiliatly.com/blog/start-affiliate-program/">blog post</a> for helping you start with your affiliate program.</Message>
						<Message
						    positive
							icon='handshake outline'
							header={ProgramAffLink('register/?merchant='+merchant_id)}
							content='When promoting your affiliate program to your soon to be partners, you must use the link on top'
						/>
						{/*<Message warning visible>Check our <a target="_blank" href="http://www.affiliatly.com/blog/promoting-your-affiliate-program/">blog post</a> for tips for promoting your affiliate program.</Message>*/}
						<Segment placeholder>
							<Header icon>
								<Icon name='cogs' />
								If you have problems with the integration, contact us and we will help!
							</Header>
							{/*<Button className="blue" icon labelPosition='right'>I need help<Icon name='right arrow' /></Button>*/}
						</Segment>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
