var path_url = 'https://www.hivefiliate.com/api/app/tracking/shopify/tracking.php';

function setAffiliateCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getAffiliateCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function DomainRequestUrl(){
    var url_string = window.location.href
    var url = new URL(url_string);
    var paramurl = url.searchParams.get("aff");
    return paramurl;
}

function trackingID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function PostDataRequest(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    return xhr;
}


function setaffiliatecookie(cookie_id){
    var post_data = 'mode_type=cookie_duration&hivefiliate_id='+cookie_id+'&location_type='+window.location.hostname;
    PostDataRequest(path_url, post_data, function(data){
        var expirecookie = data;
        if(parseInt(expirecookie)>0){
          setAffiliateCookie("hivefiliate_id", cookie_id, parseInt(expirecookie));
        }
    });
}


function startTracking() {

    alert('confirm script');

    var affiliate_id = '';
    var request_id   = DomainRequestUrl();

    if(request_id!=''||request_id!=null||request_id!='null'){
        var affiliate_id   = parseInt(request_id);
        setaffiliatecookie(affiliate_id);
    }

}
startTracking();
