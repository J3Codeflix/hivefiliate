import React, {useState, useEffect} from 'react'


export default function Paginations(props) {

    let current_page    = props.callbackPagination.paginations.current_page;
    let ellipseLeft     = props.callbackPagination.paginations.ellipseLeft;
    let ellipseRight    = props.callbackPagination.paginations.ellipseRight;
    let limit_page      = props.callbackPagination.paginations.limit_page;
    let pageinfo        = props.callbackPagination.paginations.pageinfo;
    let startPage       = props.callbackPagination.paginations.startPage;
    let endPage         = props.callbackPagination.paginations.endPage;
    let total_page      = props.callbackPagination.paginations.total_page;
    let total_records   = props.callbackPagination.paginations.total_records;
    let listnav         = props.callbackPagination.paginations.listnav;


	function handlePaginations(page){
      if(page==='prev'){
        if(parseInt(current_page)===parseInt(1)){
          return false;
        }
        page=parseInt(current_page)-parseInt(1);
      }
      if(page==='next'){
        if(parseInt(current_page)>=parseInt(total_page)){
          return false;
        }
        page=parseInt(current_page)+parseInt(1);
      }
      props.callbackPagenumber(page);
    }


    function paginations(){
        const navcenter         = [];
          for (let i = startPage; i <= endPage; i++) {
            navcenter.push(
              <li key={i}>
                  <a id={i}
                    className={(() => {return current_page==i ? 'pagination-link is-current' : "pagination-link";})()}
                    aria-label={(() => {return current_page==i ? 'Page '+i : "Goto page "+i;})()}
                    onClick={() => handlePaginations(i)}
                    >
                    {i}
                  </a>
              </li>
            )
        }
        const paginationElement =
            <div className="columns is-vcentered mypaginations">
            <div className="column is-one-third pageinfotext">{pageinfo}</div>
            <div className="column">
              {total_records>limit_page&&
                <nav className="pagination is-pulled-right" role="navigation" aria-label="pagination">
                  <ul className="pagination-list">
                    {/*<li className={parseInt(ellipseLeft)===parseInt(0)?'none':''}><a className="pagination-link" onClick={() => handlePaginations('1')}><i className="ti-angle-double-left"></i></a></li>*/}
                    <li><a className="pagination-link" disabled={parseInt(current_page)===parseInt(1)?true:false} onClick={() => handlePaginations('prev')}><i className="ti-angle-left"></i></a></li>
                    {/*<li className={parseInt(ellipseLeft)===parseInt(0)?'none':''}><span className="pagination-ellipsis">&hellip;</span></li>*/}
                    {navcenter}
                    {/*<li className={parseInt(ellipseRight)===parseInt(0)?'none':''}><span className="pagination-ellipsis">&hellip;</span></li>*/}
                    <li><a className="pagination-link" disabled={parseInt(current_page)>=parseInt(total_page)?true:false} onClick={() => handlePaginations('next')}><i className="ti-angle-right"></i></a></li>
                    {/*<li className={parseInt(ellipseRight)===parseInt(0)?'none':''}><a className="pagination-link" onClick={() => handlePaginations(total_page)}><i className="ti-angle-double-right"></i></a></li>*/}
                  </ul>
                </nav>
              }
            </div>
        </div>
        return paginationElement;
    }


	return (
		<div className="paginationswrapper">{paginations()}</div>
	)
}
