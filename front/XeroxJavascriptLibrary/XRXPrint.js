/* 
 * XRXPrint.js
 * Copyright (C) Xerox Corporation, 2011.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Print Api webservices.
 *
 * @revision 	10/03/2011	TC	Created.
 * 				10/22/2012  TC 	Added xrxPrintParseGetInterfaceVersion() function,
 *								added error checking and comments.
 */

/****************************  CONSTANTS  *******************************/

var XRX_PRINT_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>' +
 '<SOAP-ENV:Envelope' +
                        ' xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"' +
                        ' xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"' +
                        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
 '<SOAP-ENV:Body>';

var XRX_PRINT_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_PRINT_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/WS-PrintService/1"';

var XRX_PRINT_PATH = '/webservices/WS-PrintService/1';

/****************************  FUNCTIONS  *******************************/

//  Print Interface Version

/**
* This function gets the print interface version.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxPrintGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
	if((url == null) || (url == ""))
		url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
    var sendReq = xrxPrintGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the get interface version request.
* 
*/
function xrxPrintGetInterfaceVersionRequest()
{
	return XRX_PRINT_SOAPSTART 
		+ xrxCreateTag('GetInterfaceVersionRequest', XRX_PRINT_NAMESPACE, '') 
		+ XRX_PRINT_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxPrintParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  Initiate Print Job

/**
* This function initiates a Print Job.
*
* @param	url			        WS-PrintService device destination address
* @param    printJobUrl         the url that contains the files to be printed
* @param    username            username for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    password            password for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    printJobTicket      print job ticket (string of escaped xml)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxPrintInitiatePrintJobURL( url, printJobUrl, username, password, printJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
	var sendReq = xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate print job request.
* 
* @param    printJobUrl         the url that contains the files to be printed
* @param    username            username for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    password            password for login to printJobUrl if authentication is required, '' if authentication is not required
* @param    printJobTicket      print job ticket (string of escaped xml)
*
* @return	string	xml request
*/
function xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket )
{
	var printJobUrlTag = xrxCreateTag('PrintDocumentURL', '', printJobUrl);
	var usernameTag = ""; 
	var passwordTag = "";

	if (username != "")
	{
		usernameTag = xrxCreateTag('UserName', '', username);
		passwordTag = xrxCreateTag('Password', '', password);
    }

	var printJobTicketTag = (printJobTicket != null)? xrxCreateTag( 'JobModelSchemaCommon_PrintJobTicket', '', printJobTicket ) : '';

	return XRX_PRINT_SOAPSTART 
		+ xrxCreateTag('InitiatePrintJobURLRequest', XRX_PRINT_NAMESPACE, printJobUrlTag + printJobTicketTag + usernameTag + passwordTag) 
		+ XRX_PRINT_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		jobID
*/
function xrxPrintParseInitiatePrintJobURL( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['InitiatePrintJobURLResponse','JobId'] );
	var jobID = xrxGetValue( data );

	return jobID;
}



/*************************  End of File  *****************************/
