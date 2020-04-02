import React, {useState} from 'react'
import { Modal, Label } from 'semantic-ui-react'
import TabInfo from './tab_info'
import TabEarnings from './tab_earnings'
import TabPayment from './tab_payment'
import TabStat from './tab_stat'
export default function Affiliateinfo(props) {

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

	const [tabactive, settabactive] = useState(1);
	function tabActive(tab){
		settabactive(tab);
	}

	return (
		<div className="modalwrapper">
			<Modal open={true} size='large' onClose={()=>closeModal(false)}>
				<Modal.Header>Information about affiliate # {props.idffiliate}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
					<Modal.Content className="modalcontent legendsmodal">
						<div>

							<div className="tabmodal ui attached tabular menu">
								<a className={tabactive==1?'active item':'item'} onClick={()=>tabActive(1)}>Information</a>
								<a className={tabactive==2?'active item':'item'} onClick={()=>tabActive(2)}>Earnings</a>
								{/*<a className={tabactive==3?'active item':'item'} onClick={()=>tabActive(3)}>Payment History</a>*/}
							</div>

							{tabactive==1&&<TabInfo
									idffiliate={props.idffiliate}
									reloadTrigger={reloadlist}
									showAlertMessage={showAlert}
									messageAlert={messageText}
									closeTrigger={closeModal}
									view={props.view}
									edit={props.edit}
									pay={props.pay}
									delete={props.delete}
							/>}
							{tabactive==2&&<TabEarnings
									idffiliate={props.idffiliate}
									reloadTrigger={reloadlist}
									showAlertMessage={showAlert}
									messageAlert={messageText}
									closeTrigger={closeModal}
									pay={props.pay}
							/>}
							{tabactive==3&&<TabPayment
									idffiliate={props.idffiliate}
									reloadTrigger={reloadlist}
									showAlertMessage={showAlert}
									messageAlert={messageText}
									closeTrigger={closeModal}
							/>}
							{tabactive==4&&<TabStat/>}

						</div>
					</Modal.Content>
			</Modal>
		</div>
	)
}
