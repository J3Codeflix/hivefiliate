import React from 'react'
import {Icon} from 'semantic-ui-react'

export default function AlertError(props) {
	function Closealert(){
		props.CloseTheAlert(false);
	}
    return (
        <div className={'show-message erroralert '+props.sizeWidth}>
            <div className="columns flexcolumn is-mobile is-vcentered">
                <div className={'messageicon '+props.sizeWidth}><Icon name='exclamation triangle'/></div>
                <div className={'messagetext '+props.sizeWidth}>{props.TextAlert}</div>
                <div className={'messageclose '+props.sizeWidth}><i className="ti-close" onClick={()=>Closealert()}></i></div>
            </div>
        </div>
    );
}