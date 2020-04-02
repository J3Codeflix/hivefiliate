import React from 'react'
import {Icon} from 'semantic-ui-react'

export default function AlertSuccess(props) {
	function Closealert(){
		props.CloseTheAlert(false);
	}
    return (
        <div className={'show-message successalert '+props.sizeWidth}>
            <div className="columns flexcolumn is-mobile is-vcentered">
                <div className={'messageicon '+props.sizeWidth}><Icon name='check circle outline'/></div>
                <div className={'messagetext '+props.sizeWidth}>{props.TextAlert}</div>
                <div className={'messageclose '+props.sizeWidth}><i className="ti-close" onClick={()=>Closealert()}></i></div>
            </div>
        </div>
    );
}