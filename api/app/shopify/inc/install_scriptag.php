<?php
function InstallScript($access_token,$shop,$domainurl){

    $array = array(
        'script_tag' => array(
            'event' => 'onload',
            'src' => $domainurl.'/api/app/script/scriptag.js'
        )
    );

    $scriptTag = shopify_call($access_token, $shop, "/admin/api/2019-07/script_tags.json", $array, 'POST');
    $scriptTag = json_decode($scriptTag['response'], TRUE);
    return $scriptTag;
}
