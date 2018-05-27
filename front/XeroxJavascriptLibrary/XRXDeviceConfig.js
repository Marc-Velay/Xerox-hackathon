/* 
 * XRXDeviceConfig.js
 * Copyright (C) Xerox Corporation, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox DeviceConfig Api webservices.
 *
 * @revision    04/05/2012
 *              09/21/2012  AHB Expanded functionality to parse payload
 *              10/15/2012  AHB Updated
 *              12/20/2012  AHB Added xrxGetDeviceInformation pass thru to remain compatible with other versions
 *              08/01/2013  AHB Added synchronous behavior
 *				01/26/2017  TC  Fixed a typo in xrxDeviceConfigGetInterfaceVersion() parameters.
 */

/****************************  CONSTANTS  *******************************/

var XRX_DEVICECONFIG_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/device_configuration/1"';

var XRX_DEVICECONFIG_PATH = '/webservices/office/device_configuration/1';

/****************************  FUNCTIONS  *******************************/


//  DeviceConfig Interface Version


/**
* This function gets the DeviceConfig interface version and returns the parsed values.
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
function xrxDeviceConfigGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_DEVICECONFIG_PATH;
    var sendReq = xrxDeviceConfigGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the DeviceConfig interface version request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetInterfaceVersionRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxDeviceConfigParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  GetDeviceConfigInfo


/**
* This function retrieves the DeviceConfigInfo data.
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
function xrxDeviceConfigGetDeviceInformation( url, callback_success, callback_failure, timeout, async )
{
    return xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function retrieves the DeviceConfigInfo data.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceInfoRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the DeviceConfig Info data request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetDeviceInfoRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetDeviceInformationRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceInfo( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "Information" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param	response	webservice response in string form
* @return	string		escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceInfoPayload( response )
{
	return xrxParsePayload( response, "Information" );
}


//  GetDeviceCapabilities


/**
* This function retrieves the DeviceCapabilities data.
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
function xrxDeviceConfigGetDeviceCapabilities( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceCapabilitiesRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the DeviceConfig Capabilities data request.
*
* @return	string	xml request
*/
function xrxDeviceConfigGetDeviceCapabilitiesRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'VoidRequest', XRX_DEVICECONFIG_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceCapabilities( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobModelCapabilities_DeviceJobProcessingCapabilities" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param	response	webservice response in string form
* @return	string		escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceCapabilitiesPayload( response )
{
    return xrxParsePayload( response, "JobModelCapabilities_DeviceJobProcessingCapabilities" );
}

/*************************  End of File  *****************************/


