import React from 'react'
import { Modal, Label } from 'semantic-ui-react'
export default function Legends(props) {

	/* Modal close */
	 function closeModal(data){
		props.closeTrigger(data);
	}

	return (
		<div className="modalwrapper">
			<Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
				<Modal.Header>Legend<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
					<Modal.Content className="modalcontent legendsmodal" scrolling>
						<div className="columns is-mobile">
							<div className="column is-one-fifth"><Label size='massive' className="is_minimum" empty /></div>
							<div className="column">The affiliate has reached the minimum payment sum</div>
						</div>
						<div className="columns is-mobile">
							<div className="column is-one-fifth"><Label size='massive' className="is_blocked" empty /></div>
							<div className="column">The affiliate is currentyl blocked</div>
						</div>
						<div className="columns is-mobile">
							<div className="column is-one-fifth"><Label size='massive' className="is_pending" empty /></div>
							<div className="column">The affiliate is pending approval</div>
						</div>
						<div className="columns is-mobile">
							<div className="column is-one-fifth"><Label size='massive' className="is_refered" empty /></div>
							<div className="column">This affiliate is Two Tier refered</div>
						</div>
						<div className="columns is-mobile">
							<div className="column is-one-fifth"><Label size='massive' className="is_temporary" empty /></div>
							<div className="column">Affiliate with temporary account</div>
						</div>
						<p>Unpaid earnings are calculated upon 'Paid' orders only.</p>
						<p>The price in brackets in column Unpaid earnings is the sum of the not confirmed yet earnings from not paid orders.</p>
					</Modal.Content>
			</Modal>
		</div>
	)
}