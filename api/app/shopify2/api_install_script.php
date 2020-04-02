<?php
function installScript($tokenapi,$hmac,$paramshop,$domainurl){

    $parsedUrl = parse_url('https://'.$paramshop);
    $host = explode('.', $parsedUrl['host']);
    $subdomain = $host[0];

    $shop   = $subdomain;
    $token  = $tokenapi;

    $array = array(
        'script_tag' => array(
            'event' => 'onload',
            'src' => $domainurl.'/api/app/script/scriptag.js'
        )
    );

    $scriptTag = shopify_call($token, $shop, "/admin/api/2019-07/script_tags.json", $array, 'POST');
    $scriptTag = json_decode($scriptTag['response'], TRUE);
    return $scriptTag;
}
?>
