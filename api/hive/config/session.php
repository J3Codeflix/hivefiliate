<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

class Session{

	private static $session_started = false;

	public static function ini_set(){
    ini_set('session.cookie_secure','on');
		ini_set('session.cookie_httponly', '1');
		ini_set('session.use_only_cookies', '1');
	}

	public function start(){

		if(self::$session_started==false){
			session_start();
			session_regenerate_id();
			self::$session_started = true;
		}

	}

	public static function put($key,$value){

		$_SESSION[$key] = $value;

	}

	public static function get($key){
		if(isset($_SESSION[$key])){
            return $_SESSION[$key];
		}else{
			return false;
		}
	}
}
$session = new Session();
Session::ini_set();
$session->start();
