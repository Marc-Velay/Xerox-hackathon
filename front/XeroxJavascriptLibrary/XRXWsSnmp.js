/* 
 * XRXWsSnmp.js
 * Copyright (C) Xerox Corporation, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox WS-SNMP Api webservices.
 *
 * @revision    01/24/2013 TC      	Created.
 * 		        03/11/2013 TC	    Updated after code review.
 * 		        06/25/2013 AHB	    Added Synchronous capability.
 * 		        07/07/2013 AHB	    Moved url check to XRXWebservices.
 * 		        08/01/2013 AHB	    Updated Constants.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SNMP_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/SNMP/1"';

var XRX_SNMP_PATH = '/webservices/SNMP/1';


/****************************  FUNCTIONS  *******************************/


//  WsSnmp Get Interface Version


/**
* This function gets the EIP WsSnmp interface version.
*
* @param	url			        destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetInterfaceVersionRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the WsSnmp get interface version request.
*
* @return	string	xml request
*/
function xrxWsSnmpGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SNMP_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxWsSnmpParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}


//  Get


/**
* This function retrieves a data value associated with a specific OID.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpGetRequest function.
*
* @param	url			        destination address
* @param	communityString		SNMP get community string
* @param	oid			        OID string
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGet( url, communityString, oid, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetRequest( communityString, oid );
	
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the WsSnmp Get request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP get community string
* @param	oid			    OID string
* @return	string	        xml request
*/
function xrxWsSnmpGetRequest( communityString, oid )
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				   + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				   + xrxCreateTag( 'OID', '', oid ) ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	An object of { OID:'', Type:'', returnValue:'' }	
*/
function xrxWsSnmpParseGet( response )
{
    var data = {};
    var domObj = xrxStringToDom( response );
    data.OID = xrxGetElementValue( domObj, 'OID' );
    data.Type = xrxGetElementValue( domObj, 'Type' );
    data.returnValue = xrxGetElementValue( domObj, 'returnValue' );
    return data;
}


//  WsSnmp GetNext


/**
* This function obtains the OID and the value of the next item in the MIB tree.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpGetNextRequest function.
*
* @param	url			        destination address
* @param	communityString	    SNMP get community string
* @param	oid			        OID string
* @param	callback_success    function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*						        of seconds (0[default] = no timeout)(optional)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpGetNext( url, communityString, oid, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SNMP_PATH;
    var sendReq = xrxWsSnmpGetNextRequest( communityString, oid );
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the WsSnmp GetNext request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP get community string
* @param	oid			    OID string
* @return	string	        xml request
*/
function xrxWsSnmpGetNextRequest( communityString, oid )
{
	return	XRX_SOAPSTART
		    + xrxCreateTag( 'GetNextRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				    + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				    + xrxCreateTag( 'OID', '', oid ) ) 
		    + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	An object of { OID:'', Type:'', returnValue:'' }
*/
function xrxWsSnmpParseGetNext( response )
{
    var data = {};
    var domObj = xrxStringToDom( response );
    data.OID = xrxGetElementValue( domObj, 'OID' );
    data.Type = xrxGetElementValue( domObj, 'Type');
    data.returnValue = xrxGetElementValue( domObj, 'returnValue');
    return data;
}


// WsSnmp Set


/**
* This function sets a data value associated with a specific OID.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded in xrxWsSnmpSetRequest function.
*
* @param	url			        destination address
* @param	communityString		SNMP set private community string
* @param	oidArr			    Array of oids. Each oid contains an OID string, an OID type and a Set Value.
* 					            So the array looks like this: [ oidString, oidType, setValue, oidString, oidType, setValue, ...].
* @param	callback_success	function to callback upon successful completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout			    function to call an error routine after a set amount 
*					            of seconds (0 = no timeout)
* @param	async	            asynchronous = true synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE"
*/
function xrxWsSnmpSet( url, communityString, oidArr, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var len = oidArr.length;
    if ((len >= 3) && (len%3 == 0))
    {
	    var sendUrl = url + XRX_SNMP_PATH;
	    var sendReq = xrxWsSnmpSetRequest(communityString, oidArr);
	    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
    } else
    {
	    return "FAILURE: Xerox Javascript Library - Invalid OID Array provided";
    }
}

/**
* This function builds the request.
* The SNMP version is currently restricted to the value '2c' so it is hardcoded.
*
* @param	communityString	SNMP set private community string
* @param	oidArr			Array of oids. Each oid contains an OID string, an OID type and a Set Value.
* 					        So the array looks like this: [ oidString, oidType, setValue, oidString, oidType, setValue, ...].
* @return	string	xml request if oidArr contains the right number of parameters or error string otherwise. 
*/
function xrxWsSnmpSetRequest( communityString, oidArr )
{
    var len = oidArr.length;
    if ((len >= 3) && (len%3 == 0))
    {
	    var oidTags = '';
	    for( var i = 0; i < len; i = i + 3)
	    {
	        oidTags += xrxCreateTag( 'theOID', '', xrxCreateTag( 'OID', '', oidArr[i] ) +
				        xrxCreateTag( 'Type', '', oidArr[i+1] ) +
				        xrxCreateTag( 'setValue', '', oidArr[i+2] ) );
	    }
	    return	XRX_SOAPSTART
		        + xrxCreateTag( 'SetRequest', XRX_SNMP_NAMESPACE, xrxCreateTag( 'SNMPVersion', '', '2c' )
				        + xrxCreateTag( 'SNMPv2cData', '', xrxCreateTag( 'communityString', '', communityString ) )
				        + oidTags ) 
		        + XRX_SOAPEND;
    } else
    {
	    return "FAILURE: Xerox Javascript Library - Invalid OID Array provided";
    }
}

/*************************  End of File  *****************************/
