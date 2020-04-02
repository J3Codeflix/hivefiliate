import React,{useState,useEffect} from 'react'
import {Icon} from 'semantic-ui-react'
export default function AlertMessage(props) {
    function closealert(){
      props.close(false);
    }
    return (
      <React.Fragment>
        {props.htmltemplate.type=='success'&&<div className={'show-message successalert '+props.htmltemplate.size}>
            <div className="columns flexcolumn is-mobile is-vcentered">
                <div className={'messageicon '+props.htmltemplate.size}><Icon name='check circle outline'/></div>
                <div className={'messagetext '+props.htmltemplate.size}>{props.htmltemplate.text}</div>
                <div className={'messageclose '+props.htmltemplate.size} onClick={()=>closealert()}><i className="ti-close"></i></div>
            </div>
        </div>}
        {props.htmltemplate.type=='error'&&<div className={'show-message erroralert '+props.htmltemplate.size}>
            <div className="columns flexcolumn is-mobile is-vcentered">
                <div className={'messageicon '+props.htmltemplate.size}><Icon name='exclamation triangle'/></div>
                <div className={'messagetext '+props.htmltemplate.size}>{props.htmltemplate.text}</div>
                <div className={'messageclose '+props.htmltemplate.size} onClick={()=>closealert()}><i className="ti-close"></i></div>
            </div>
        </div>}
    </React.Fragment>
    );
}
