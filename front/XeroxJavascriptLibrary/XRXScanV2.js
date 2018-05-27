/* 
 * XrxScanV2.js
 * Copyright (C) Xerox Corporation, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox ScanV2 Api webservices.
 *
 * @revision 03/02/2012		TC		Created.
 *			 10/25/2012		TC		Updated the comments.
 *			 11/01/2012		TC		Validate the url passed in and give it default value
 *									if the url is null or empty.
 *			 11/02/2012		AHB		Added InitiateScanJobWithTemplate.
 *			 08/27/2013     NS	    ScanV2 API is renamed to ScanExtension(Version2) API in EIP 3.0 SDK.
 *			 07/11/2014		TC		Add the optional token parameter to xrxScanV2InitiateScanJob() and
 *									its helper function xrxScanV2InitiateScanJobRequest().
 *			 07/16/2014		TC		Remove xrxScanV2GetImage() and its helper functions 
 *									xrxScanV2GetImageRequest() and findMtomData() because
 *									making the GetImageFile() call from a browser is not recommended.
 *			 07/16/2014		TC		Remove the redundant xrxScanV2ParseInitiateScanJobWithTemplate() function.
 */

/****************************  GLOBALS  *******************************/

var XRX_SCANV2_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/scanservice/2"';

var XRX_SCANV2_PATH = '/webservices/ScanService/2';

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
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2GetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SCANV2_PATH;
    var sendReq = xrxScanV2GetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Scan interface version request.
*
* @return	string	xml request
*/
function xrxScanV2GetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SCANV2_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxScanV2ParseGetInterfaceVersion(response) 
{
    var data = xrxStringToDom(response);
    return xrxGetValue(xrxFindElement( data, ["Version", "MajorVersion"])) + "."
	    + xrxGetValue(xrxFindElement( data, ["Version", "MinorVersion"])) + "."
	    + xrxGetValue(xrxFindElement( data, ["Version", "Revision"]));
}


//  Initiate Scan Job with a job ticket


/**
* This function initiates a Scan Job with a job ticket
*
* @param	url					destination address
* @param	scanV2JobTicket     scanV2 job ticket (string of escaped Xml)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @param    token               Security token as a string. (optional)
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2InitiateScanJob( url, scanV2JobTicket, callback_success, callback_failure, timeout, async, token )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCANV2_PATH;
	var sendReq = xrxScanV2InitiateScanJobRequest( scanV2JobTicket, token );

	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the Initate Scan Job request.
*
* @param    jobTicket   job ticket in string form
* @param    token       Security token as a string. (optional)
* @return	string	    xml request
*/
function xrxScanV2InitiateScanJobRequest(scanV2JobTicket, token)
{
	var tokenTag = '';
	if (token != null && token != undefined && token != '')
	{
		tokenTag = xrxCreateTag( 'Token', '', token );
	}

	return	XRX_SOAPSTART
			+ xrxCreateTag( 'InitiateScanWithTicketRequest', XRX_SCANV2_NAMESPACE, scanV2JobTicket + tokenTag )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    jobID
*/
function xrxScanV2ParseInitiateScanJob( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanWithTicketResponse","JobID"] );
	return xrxGetValue( data );
}


//  Initiate Scan Job with a template


/**
* This function initiates a Scan Job with a template
*
* @param	url					destination address
* @param	templateName        Template name
* @param    isPool              boolean in string form - whether on device (false) or template pool (true)
* @param    token               token in string form
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxScanV2InitiateScanJobWithTemplate( url, templateName, isPool, token, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCANV2_PATH;
	var sendReq = xrxScanV2InitiateScanJobWithTemplateRequest( templateName, isPool, token );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the Initate Scan Job request.
*
* @param    templateName    name of template
* @param    isPool          boolean in string form - whether on device (false) or template pool (true)
* @param    token           token in string form
* @return	string	        xml request
*/
function xrxScanV2InitiateScanJobWithTemplateRequest( templateName, isPool, token )
{
	return	XRX_SOAPSTART
			+ xrxCreateTag( 'InitiateScanWithTemplateRequest', XRX_SCANV2_NAMESPACE, 
			    xrxCreateTag( 'ScanTemplateID', '', templateName)
			    + xrxCreateTag( 'IsFromTemplatePool', '', isPool )
			    + xrxCreateTag( 'Token', '', token ) )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    jobID
*/
function xrxScanV2ParseInitiateScanJobWithTemplate( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanWithTemplateResponse","JobID"] );
	return xrxGetValue( data );
}
 
/*************************  End of File  *****************************/
