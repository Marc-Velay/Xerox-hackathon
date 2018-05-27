/* 
 * XrxSession.js
 * Copyright (C) Xerox Corporation, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api webservices.
 *
 * @revision    04/26/2012  AHB Added xrxSessionParseGetInterfaceVersion
 *              04/2012 TC  Added SetSession functionality
 *              10/15/2012  AHB Updated
 *              08/01/2013  AHB Added synchronous behavior and updated constants
 *				06/11/2015  TC  Use XRX_SOAP11_SOAPSTART instead of XRX_SOAPSTART.
 *				09/01/2016  TC  Use XRX_SESSION_SOAPSTART instead of XRX_SOAP11_SOAPSTART.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SESSION_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/cuisession/1"';

var XRX_SESSION_PATH = '/webservices/office/cuisession/1';

var XRX_SESSION_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
	+ '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
	+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
	+ '<soap:Body>';

/****************************  FUNCTIONS  *******************************/


//  Session Interface Version


/**
* This function gets the Session interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SESSION_PATH;
    var sendReq = xrxSessionGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Session interface version request.
*
* @return	string	xml request
*/
function xrxSessionGetInterfaceVersionRequest()
{
	return	XRX_SESSION_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SESSION_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxSessionParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  Exit Application


/**
* This function initiates an exit from EIP. There is no success callback
* because EIP will exit upon success of the webservice call.
*
* @param	url					destination address
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionExitApplication( url, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionExitApplicationRequest();
	return xrxCallWebservice( sendUrl, sendReq, null, callback_failure, timeout, null, null, null, async );
}    

/**
* This function builds the Exit Application request.
*
* @return	string	xml request
*/
function xrxSessionExitApplicationRequest()
{
	return	XRX_SESSION_SOAPSTART 
		    + xrxCreateTag( 'ExitApplicationRequest', XRX_SESSION_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}


//  GetSessionInfo


/**
* This function retrieves the SessionInfo data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionGetSessionInfo( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionGetSessionInfoRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function This function builds the request.
*
* @return	string	xml request
*/
function xrxSessionGetSessionInfoRequest()
{
	return	XRX_SESSION_SOAPSTART 
		    + xrxCreateTag( 'GetSessionInformationRequest', XRX_SESSION_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed payload.
*
* @param	response	webservice response in DOM form
* @return	string		xml payload in string form
*/
function xrxSessionParseSessionPayload( response )
{
	return xrxGetElementValue( response, "Information" );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxSessionParseGetSessionInfo( response )
{
	var data = xrxSessionParseSessionPayload( xrxStringToDom( response ) );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}


//  SetSessionInfo


/**
* This function sets the SessionInfo data. 
*
* @param	url					destination address
* @param    payload             xml payload containing the session data
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0 = no timeout)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxSessionSetSessionInfo( url, payload, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionSetSessionInfoRequest( payload );
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the request.
*
* @param    session_info   payload to include
* @return	string	xml request
*/
function xrxSessionSetSessionInfoRequest( session_info )
{
	return XRX_SESSION_SOAPSTART +
		    xrxCreateTag( 'SetSessionParametersRequest', XRX_SESSION_NAMESPACE,
			xrxCreateTag( 'SessionInfoSchema_SetSessionParametersPayload', XRX_SESSION_NAMESPACE, session_info )) 
			+ XRX_SOAPEND;
}

/*************************  End of File  *****************************/

