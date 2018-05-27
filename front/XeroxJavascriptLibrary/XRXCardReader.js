/* 
 * XRXCardReader.js
 * Copyright (C) Xerox Corporation, 2009.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api webservices.
 *
 * @revision    02/22/2010
 *              10/15/2012  AHB Updated
 */

/****************************  CONSTANTS  *******************************/

var XRX_CARDREADER_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<SOAP-ENV:Envelope'+
        ' xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"'+
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">'+
		'<SOAP-ENV:Header xmlms:env="http://www.w3.org/2003/05/soap-envelope"></SOAP-ENV:Header>' +
		' <SOAP-ENV:Body>';
        
var XRX_CARDREADER_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_CARDREADER_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/CardReader/1"';

var XRX_CARDREADER_PATH = '/webservices/CardReader/1';

/****************************  FUNCTIONS  *******************************/

//  Interface Version

/**
* This function gets the interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return	string	xml request
*/
function xrxCardReaderGetInterfaceVersionRequest()
{
	return	XRX_CARDREADER_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_CARDREADER_NAMESPACE, '' ) 
			+ XRX_CARDREADER_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxCardReaderParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  SetCardDataClient

/* Soap message for SetCardDataClient 
 *  <?xml version="1.0" encoding="UTF-8"?>
    <SOAP-ENV:Envelope
     xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"
     xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
     xmlns:cardreader="http://xml.namespaces.xerox.com/enterprise/CardReader/1"
     xmlns:rdngcrd="http://xml.namespaces.xerox.com/enterprise/ReadingCardEvent/1">
     <SOAP-ENV:Body>
       <cardreader:SetCardDataClientRequestArgs>X</cardreader:SetCardDataClientRequestArgs>
     </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
 */

/**
* This function sets the device's card data listener
*
* @param	url					destination address
* @param	server_url			server address to set the device to
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderSetCardDataClient( url, server_url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderSetCardDataClientRequest(server_url);
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @param	server_url			server address to set the device to
* @return	string	xml request
*/
function xrxCardReaderSetCardDataClientRequest( server_url )
{
	return	XRX_CARDREADER_SOAPSTART 
			+ xrxCreateTag( 'SetCardDataClientRequestArgs', XRX_CARDREADER_NAMESPACE, server_url ) 
			+ XRX_CARDREADER_SOAPEND;
}

//  ClearCardDataClient

/**
* This function clears the device's card reader data.
*
* @param	url					destination address
* @param	server_url			server address to set the device to
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderClearCardDataClient( url, server_url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderClearCardDataClientRequest( server_url );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @return	string	xml request
*/
function xrxCardReaderClearCardDataClientRequest( server_url )
{
	return	XRX_CARDREADER_SOAPSTART 
			+ xrxCreateTag( 'ClearCardDataClientRequestArgs', XRX_CARDREADER_NAMESPACE, server_url ) 
			+ XRX_CARDREADER_SOAPEND;
}

// SetCardDataclientExt

/**
* This function sets the device's card data listener to the card reader with the specified device_number(i.e. peripheral id)
*
* @param	url					destination address
* @param	server_url			server address to set the device to
* @param    device_number       peripheral id of the Card Reader to listen to
* @param	callback_success	function to callback upon successful completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderSetCardDataClientExt(url, server_url, device_number, callback_success, callback_failure, timeout) {
    if ((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderSetCardDataClientExtRequest(server_url, device_number);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the request.
*
* @param	server_url			server address to set the device to
* @param    device_number       peripheral id of the Card Reader to listen to
* @return	string	xml request
*/
function xrxCardReaderSetCardDataClientExtRequest(server_url, device_number) {
    return XRX_CARDREADER_SOAPSTART
			+ xrxCreateTag('SetCardDataClientExtRequestArgs', XRX_CARDREADER_NAMESPACE, 
			  xrxCreateTag('URLofClient', XRX_CARDREADER_NAMESPACE, server_url) + xrxCreateTag('DeviceNumber', XRX_CARDREADER_NAMESPACE, device_number))
			+ XRX_CARDREADER_SOAPEND;
}

//  ClearCardDataClientExt

/**
* This function clears the device's card reader data.
*
* @param	url					destination address
* @param	server_url			server address to set the device to
* @param    device_number       peripheral id of the Card Reader to listen to
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderClearCardDataClientExt(url, server_url, device_number, callback_success, callback_failure, timeout) {
    if ((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderClearCardDataClientRequestExt(server_url, device_number);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the request.
*
* @param	server_url			server address to set the device to
* @param    device_number       peripheral id of the Card Reader to listen to
* @return	string	xml request
*/
function xrxCardReaderClearCardDataClientRequestExt(server_url, device_number) {
    return XRX_CARDREADER_SOAPSTART
			+ xrxCreateTag('ClearCardDataClientExtRequestArgs', XRX_CARDREADER_NAMESPACE, 
			  xrxCreateTag('URLofClient', XRX_CARDREADER_NAMESPACE, server_url) + xrxCreateTag('DeviceNumber', XRX_CARDREADER_NAMESPACE, device_number))
			+ XRX_CARDREADER_SOAPEND;
}


//  GetPeripheralsInfo

/**
* This function gets the peripheral's info.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCardReaderGetPeripheralsInfoClient( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderGetPeripheralsInfoRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @return	string	xml request
*/
function xrxCardReaderGetPeripheralsInfoRequest()
{
	return	XRX_CARDREADER_SOAPSTART 
			+ xrxCreateTag( 'GetPeripheralsInfoRequestArgs', XRX_CARDREADER_NAMESPACE, '' ) 
			+ XRX_CARDREADER_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxCardReaderParseGetPeripheralsInfo( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "hwInfo" );
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
function xrxCardReaderParseGetPeripheralsInfoPayload( response )
{
	return xrxParsePayload( response, "hwInfo" );
}

/*************************  End of File  *****************************/
