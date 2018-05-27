/* 
 * XRXCopy.js
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Copy Api webservices.
 *
 * @revision    03/08/2010 TC
 *              09/12/2012 Expanded functionality - AHB
 *              10/15/2012  AHB Updated
 *              10/19/2012  AHB Updated InitiateCopyJobRequest to place no ticket when ticket is null
 */

/****************************  CONSTANTS  *******************************/

var XRX_COPY_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>' +
                        '<SOAP-ENV:Envelope' +
                        ' xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"' +
                        ' xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"' +
                        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
                        ' <SOAP-ENV:Body>';

var XRX_COPY_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_COPY_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/CopyService/1"';

var XRX_COPY_PATH = '/webservices/CopyService/1';

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
function xrxCopyGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return	string	xml request
*/
function xrxCopyGetInterfaceVersionRequest()
{
	return	XRX_COPY_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_COPY_NAMESPACE, '' ) 
			+ XRX_COPY_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxCopyParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  Initiate Copy Job

/**
* This function initiates Copy Job.
*
* @param	url					destination address
* @param    copyJobTicket       copy job ticket (string of escaped Xml)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*
* Below is the SOAP message with empty job ticket.
*
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope 
xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" 
xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<SOAP-ENV:Body>
<InitiateCopyJobRequest xmlns="http://xml.namespaces.xerox.com/enterprise/CopyService/1"></InitiateCopyJobRequest>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>
*
*/
function xrxCopyInitiateCopyJob( url, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_COPY_PATH;
	var sendReq = xrxCopyInitiateCopyJobRequest( copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate copy job request.
* 
* @param    copyJobTicket   Copy job ticket in string escaped form
*
* @return	string	xml request
*/
function xrxCopyInitiateCopyJobRequest( copyJobTicket )
{
    return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'InitiateCopyJobRequest', XRX_COPY_NAMESPACE, 
            ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) ) 
        + XRX_COPY_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	jobID
*/
function xrxCopyParseInitiateCopyJob( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['InitiateCopyJobResponse','JobId'] );
	return xrxGetValue( data );
}

//  Get Copy Job Details

/**
* This function gets the details on a Copy Job.
*
* @param	url					destination address
* @param    jobId               job Id of desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*
*/
function xrxCopyGetCopyJobDetails( url, jobId, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_COPY_PATH;
	var sendReq = xrxCopyGetCopyJobDetailsRequest( jobId );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate copy job request.
* 
* @param    jobId               job Id of desired job
*
* @return	string	xml request
*/
function xrxCopyGetCopyJobDetailsRequest( jobId )
{
    return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'GetCopyJobDetailsRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_COPY_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxCopyParseGetCopyJobDetails( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "CopyJobXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

//  Cancel Copy Job

/**
* This function cancels the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCopyCancelCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyCancelCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxCopyCancelCopyJobRequest( jobId )
{
	return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'CancelCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_COPY_SOAPEND;
}

//  Pause Copy Job

/**
* This function pauses the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCopyPauseCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyPauseCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxCopyPauseCopyJobRequest( jobId )
{
	return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'PauseCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_COPY_SOAPEND;
}

//  Resume Copy Job

/**
* This function resumes the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCopyResumeCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyResumeCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxCopyResumeCopyJobRequest( jobId )
{
	return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'ResumeCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_COPY_SOAPEND;
}

/**
* This function continues the requested 2-sided platen job based on the passed in job identifier.
*
* @param	url					destination address
* @param	jobId				job Id of desired job
* @param	copyJobTicket		copy job ticket (string of escaped Xml)(optional)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCopyContinueSideTwoCopyJob( url, jobId, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyContinueSideTwoCopyJobRequest( jobId, copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the continue side two copy job request.
* 
* @param    jobId			job Id of desired job
* @param    copyJobTicket	Copy job ticket in string escaped form
*
* @return	string	xml request
*/
function xrxCopyContinueSideTwoCopyJobRequest( jobId, copyJobTicket )
{
    return XRX_COPY_SOAPSTART +
        xrxCreateTag( 'ContinueSideTwoCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', jobId ) +
            ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) )
        + XRX_COPY_SOAPEND;
}


/*************************  End of File  *****************************/
