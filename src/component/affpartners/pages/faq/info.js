import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
export default function Faq(props) {
	return (
		<React.Fragment>
	        <div className="affaccount pagecontent">
                <div className="segment-wrapper">
                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                            <h2>1. What is our affiliate program?</h2>
                        </div>
                        <div className="column iscontent">
                            <p>Our affiliate program financially rewards you for directing customers to our website. When a product is purchased by a customer you refer, we will reward you with a commission.</p>
                        </div>
                    </div>

                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                            <h2>2. How do I get paid?</h2>
                        </div>
                        <div className="column iscontent">
                            <p>We generate invoice monthly and you will be paid through your paypal account. Please enter your paypal email on "Account" page.</p>
                        </div>
                    </div>

                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                            <h2>3. How do you track and credit orders to my site?</h2>
                        </div>
                        <div className="column iscontent">
                            <p>Customer referred by you receive a tracking cookie, which allows us to identify the customers coming from your site and to credit you when they make purchase. All sales made by these customers within the same session will be assigned to you.</p>
                        </div>
                    </div>

                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                            <h2>4. Where can I see the affiliate banner and link?</h2>
                        </div>
                        <div className="column iscontent">
                            <p>You are welcome to place the Affiliate banner on your websites or blogs. In addition, you can share your affiliate link to your contacts via email, on social media, etc.</p>
                        </div>
                    </div>

                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                            <h2>5. What if I need help?</h2>
                        </div>
                        <div className="column iscontent">
                            <p>You can contact us at support@hivefiliate.com if you require any assistance.</p>
                        </div>
                    </div>


                </div>
            </div>
		</React.Fragment>
	)
}
