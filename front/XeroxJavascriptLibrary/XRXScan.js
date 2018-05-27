/* 
 * XrxScan.js
 * Copyright (C) Xerox Corporation, 2007.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Scan Api webservices.
 *
 * @revision    10/07/2007
 *              10/15/2012  AHB Removed GetResourceSimple
 *				08/27/2013  NS	Scan Extension API is renamed to ScanExtension(Version1) API in EIP 3.0 SDK
 */

/****************************  GLOBALS  *******************************/

var XRX_SCAN_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<SOAP-ENV:Envelope'+
        ' xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"'+
        ' xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"'+
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"'+
        ' xmlns:wsa="http://schemas.xerox.com/office/wsd/wsa.xsd"'+
        ' xmlns:asdl="http://schemas.xmlsoap.org/ws/2004/08/addressing"'+
        ' xmlns:dpws="http://schemas.xmlsoap.org/ws/2006/02/devprof"'+
        ' xmlns:xrxscn="http://schemas.xerox.com/office/wsd">'+
        ' <SOAP-ENV:Header>'+
        ' </SOAP-ENV:Header>'+
        ' <SOAP-ENV:Body id="_0">';

var XRX_SCAN_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_SCAN_EXTRAATTRIBS = '<To xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></To>'+
        '<ServiceId xsi:type="xsd:anyURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2006/02/devprof"></ServiceId>'+
        '<Action xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></Action>'+
        '<MessageID xsi:type="asdl:AttributedURI" '+
        'xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"></MessageID>';

var XRX_SCAN_NAMESPACE = 'xmlns="http://schemas.xerox.com/office/wsd"';

var XRX_SCAN_PATH = '/webservices/office/wsdxrxscan/1';

/****************************  FUNCTIONS  *******************************/

//  Scan Interface Version

/**
* This function gets the Scan interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxScanGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SCAN_PATH;
    var sendReq = xrxScanGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Scan interface version request.
*
* @return	string	xml request
*/
function xrxScanGetInterfaceVersionRequest()
{
	return	XRX_SCAN_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SCAN_NAMESPACE, '' ) 
			+ XRX_SCAN_SOAPEND;
}

//  Initiate Scan

/**
* This function initiates a Scan.
*
* @param	url					destination address
* @param	template			name of template
* @param	isPool				flag to determine if template in pool (true)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxScanInitiateScan( url, template, isPool, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCAN_PATH;
	var sendReq = xrxScanInitiateScanRequest( template, isPool );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}   

/**
* This function builds the Initate Scan request.
*
* @return	string	xml request
*/
function xrxScanInitiateScanRequest( template, isPool )
{
	return	XRX_SCAN_SOAPSTART 
			+ xrxCreateTag( 'InitiateScanRequest', XRX_SCAN_NAMESPACE,
			xrxCreateTag( 'ScanTemplateID', XRX_XML_TYPE_NONE, template ) 
			+ xrxCreateTag( 'IsFromTemplatePool', XRX_XML_TYPE_BOOLEAN, isPool ) 
			+ XRX_SCAN_EXTRAATTRIBS ) + XRX_SCAN_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	jobID
*/
function xrxScanParseInitiateScan( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanResponse","JobID"] );
	return xrxGetValue( data );
}
 
/*************************  End of File  *****************************/
