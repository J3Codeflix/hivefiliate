import _ from 'lodash'
import React, {useState} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,List } from 'semantic-ui-react'

export default function Privacy(props) {

  function closeModal(data){
    props.callback(data);
  }

	return (
		<div className="modalwrapper">
	      <Modal open={true} size='large' onClose={()=>closeModal(false)}>
        <Modal.Header>Privacy Policy<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
	      <Modal.Content className="modalcontent textprivacy">
        <div>
          <h4>Privacy Policy Hivefiliate Inc.</h4>
          <p>Hivefiliate Inc. (“Hivefiliate”) respects your privacy. We fully comply with the General Data Protection Regulation and the Dutch Telecommunications Act (Telecommunicatiewet) and other regulations regarding the processing of personal data and privacy. In this Privacy Policy you can read what kind of personal data we collect and how we store, protect and use your personal data. Furthermore, you can read for which purposes we will use your personal data and with whom your data will be shared. You can also see how you can access, manage or delete your own personal information and your contact preferences.</p>
        </div>

        <div>
          <h4>What does this Privacy Policy apply to?</h4>
          <p>This Privacy Policy applies to your use of the “Website” Hivefiliate.com and all products and services that we offer you via our Website.</p>
        </div>

        <div>
          <h4>Personal data</h4>
          <p>In this Privacy Policy, your “personal data” means information or pieces of information that could allow you to be identified as a person.</p>
        </div>

        <div>
          <h4>Your Consent</h4>
          <p>Hivefiliate will not collect, use or disclose your personal data without your prior consent. Therefore, we ask you to agree to this Privacy Policy before you can use our Website. When disclosing your personal information to us by creating a Hivefiliate account on our Website, you consent to the collection, storage and processing of your personal information as stated in this Privacy Policy. You can withdraw your consent at any time.</p>
        </div>

        <div>
          <h4>Which personal data do we process?</h4>
          <p>Hivefiliate collects your personal data when you create or update your account necessary to complete Hivefiliate’s online forms for a wide range of activities of Hivefiliate.
Hivefiliate processes information obtained from yourself on the basis of your consent. Processing of your personal data is necessary for the performance of a contract or on the basis that the processing is necessary for the purposes of the legitimate interests of Hivefiliate. These legitimate interests are that the processing of the personal data is necessary for Hivefiliate to be able to identify you as a user on our platform.</p>
        </div>

        <div>
          <h4>The mandatory personal data Hivefiliate collects are:</h4>
          <p>Nominative Information: Title, first name(s), surname(s): Your nominative details are needed to properly identify you, to communicate with you, to provide you with the products and services you have requested.
Full postal work and/or private address: The postal address is needed because it helps to correctly verify your identity (where other persons have the same or a similar name).
E-mail address: Electronic communication is for most purposes Hivefiliate’s preferred method of communication because it is generally convenient, rapid, effective, environmental friendly and efficient. In order to be able to communicate with you directly electronically, Hivefiliate needs your e-mail address. You are therefore required to supply your e-mail address when you create your account on the Website, which enables you to access a variety of services online. Additionally, because we only permit a particular e-mail to be used once in our system, it reduces the possibility of duplicates. Finally, it permits “Forgot Password” to be handled in an automated secure way.
In some cases, we ask you for additional information if this is needed for the services provided by Hivefiliate. For example, Hivefiliate processes payment information provided by you, if such information is necessary.
I.P. address: We use your IP address when resolving support cases, when solving technical issues with our platform and in fraud cases.</p>
        </div>

        <div>
          <h4>How do we use your personal data?</h4>
          <p>We use and process the personal data you have provided us with for the purposes described below.</p>
          <List bulleted>
            <List.Item>We use your e-mail address and personal details to send you information and updates and to accept you as a user of the Website. We may also send you information about topics that might be interesting for you. You can unsubscribe from these services at any time.</List.Item>
            <List.Item>In case we cannot identify you, we will ask for more detailed information such as a copy of your ID. We will erase this information directly after you have been identified by us.</List.Item>
            <List.Item>In case of fraud, we will share your personal data with the victim in order to allow this person to file a report with the police. We will not share more data than necessary for the report, and we will notify you in advance when we are about to share your data for this purpose.</List.Item>
          </List>
        </div>

        <div>
          <h4>Who do we share your personal data with?</h4>
          <p>Hivefiliate does not sell, trade, or rent your personal data to third parties.</p>
        </div>

        <div>
          <h4>Third-party service providers</h4>
          <p>In order to render our services, there are data that we will need to share with third-party service providers.</p>
          <p>Personal data are only shared with processors and/or third parties if this is necessary to carry out services for you. We share personal data with:</p>
          <List bulleted>
            <List.Item>Amazon Web Services: Amazon Web Services (AWS) is the main hosting provider of the Hivefiliate platform.</List.Item>
            <List.Item>Woopra: Woopra provides a customer analytics tool, which is uses primarily for troubleshooting support issues.</List.Item>
            <List.Item>Google: Google provides several services that help to analyze and improve Hivefiliate’s products.</List.Item>
            <List.Item>Satismeter: We use Satismeter to gather your feedback about our product</List.Item>
            <List.Item>Sendgrid: Sendgrid is used to send transactional emails. Sendgrid is used specifically when the customer has configured a custom sender email address.</List.Item>
            <List.Item>Mailchimp/Mandrill: Mandrill is used to send transactional emails. Mandrill is used specifically for transactional emails from the Hivefiliate.com domain.</List.Item>
            <List.Item>Stitch: Stitch provides Hivefiliate with data pipeline services. It is used it to bring data from sub-processors and Hivefiliate’s databases into Hivefiliate’s analytical data warehouse, hosted on AWS.</List.Item>
            <List.Item>Hotjar: We use Hotjar to make screen recordings of user sessions. We use this for improving our product and to trouble shoot support issues.</List.Item>
            <List.Item>Intercom: Intercom is our main customer support tool. We use it to message you and you can use it to message us. Next to that, we use Intercom to send you automated emails (mainly during onboarding). These emails trigger based on your behavior on our website. For example: If we expect you are getting stuck at a specific point during the onboarding, we send you an email with helpful tips & tricks.</List.Item>
          </List>
        </div>

        <div>
          <p>If we share your personal information with a processor, we make sure the processor complies with the GDPR by signing processing agreements.
Other third parties have no access to personal data.</p>
        </div>

        <div>
          <h4>Generic aggregated (non-personal) data</h4>
          <p>We may share generic aggregated data with our business partners, trusted affiliates and advertisers. In such case the data will be fully anonymized.</p>
        </div>

        <div>
          <h4>How do we protect your personal data?</h4>
          <p>We protect your personal data from unauthorized or unlawful access, alteration, disclosure, use or destruction. We encrypt our services using SSL, the data is only accessible through a secret password and digital signatures, and our employees only have access to your data on a need-to-know basis. We use appropriate data collection, storage and processing practices.</p>
        </div>

        <div>
          <h4>Cookies</h4>
          <p>We may use cookies to enhance your experience when you use our Website. A cookie is a small text file, containing a string of characters that can be placed on your device when you visit a website. This text file uniquely identifies your browser or device. When you visit our Website again, the cookie allows our Website to recognize your browser or device. You can change your cookie settings in your browser, if you don’t want cookies to be sent to your device. Please note that some Website features or services of our Website may not function properly without cookies.
We use the following types of cookies on our Website:</p>
          <List bulleted>
            <List.Item>Technical cookies: these are cookies that are essential for the operation of our Website, they enable you to move around our Website and use our features.</List.Item>
            <List.Item>Analytical/statistical cookies: we use these cookies to track visitor statistics. We use these statistics to continuously improve the Website and mailings, and thus offer you relevant content. These cookies also allow us to recognize and count the number of visitors and to see how visitors navigate when they’re using our Website. This helps us to improve user navigation and ensure users to find what they need more easily.</List.Item>
            <List.Item>Tracking cookies: these cookies monitor clicking behaviour and surfing habits. By means of these cookies we can see whether and when you view your profile, and whether you click through to our Website.</List.Item>
          </List>
        </div>

        <div>
          <h4>Third party websites</h4>
          <p>You may find advertising or other content on our Website that link to the websites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these websites and are not responsible for the practices employed by websites linked to or from our Websites. In addition, these websites or services, including their content and links, may be constantly changing. These websites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites that are linked to our Website, are subject to the terms and policies of that website.</p>
        </div>

        <div>
          <h4>Modifications to this Privacy Policy</h4>
          <p>We can update our Privacy Policy from time to time. When we change this Privacy Policy in a significant way, we will post a notification on our Website along with the updated Privacy Policy. We may also notify you via your email address, and request you to accept the updated Privacy Policy before you can continue your use of our Website.</p>
        </div>

        <div>
          <h4>Your rights and managing your personal data</h4>
          <p>In accordance with the GDPR, you have the right to request access to and rectification or erasure of your personal data and/or restriction of processing of your data and/or to object to the processing of your data on the basis of article 6 (1) (f) GDPR, as well as the right to data portability.</p>
        </div>

        <div>
          <p>You can have access to your personal data by going to your account. Here, you can also adjust or delete your personal data. If you need help adjusting or deleting your personal data, or if you want to request a restriction of processing of your data, object to the processing of your data or if you want to receive your data in a structured, commonly used and machine-readable format, you can also contact Hivefiliate by e-mail (privacy@Hivefiliate.com).</p>
        </div>

        <div>
          <p>If you feel Hivefiliate is violating your rights, please contact us. You also have the right to file a complaint with the Dutch Data Protection Authority (contact information can be found on https://autoriteitpersoonsgegevens.nl/en/contact-dutch-dpa/contact-us).
If you have any questions, comments or concerns about how we handle your personal data, please contact us.</p>
        </div>

        <div>
          <p>Hivefiliate Inc.</p>
          <p>Email: contact@hivefiliate.com</p>
          <p>Website: www.hivefiliate.com</p>
        </div>

		    </Modal.Content>
	     </Modal>
		</div>
	)
}
