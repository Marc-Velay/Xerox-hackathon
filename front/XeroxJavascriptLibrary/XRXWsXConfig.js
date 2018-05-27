/* 
 * XrxWsXConfig.js
 * Copyright (C) Xerox Corporation, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox WsXConfig Api webservices.
 *
 * @revision 08/08/2013		AHB		First draft.
 * @revision 01/23/2014     TC      Added Network Config and Security Config functions.
 * @revision 10/29/2015     TC		Added AddCertificate() function to Security Config.
 */

/****************************  GLOBALS  *******************************/

var XRX_WSXCONFIG_UI_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-UI/1';
var XRX_WSXCONFIG_UI_NAMESPACE = 'xmlns="' + XRX_WSXCONFIG_UI_ACTION + '"';
var XRX_WSXCONFIG_NETWORK_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-Network/1';
var XRX_WSXCONFIG_NETWORK_NAMESPACE = 'xmlns="' + XRX_WSXCONFIG_NETWORK_ACTION + '"';
var XRX_WSXCONFIG_SECURITY_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-Security/1';
var XRX_WSXCONFIG_SECURITY_NAMESPACE = 'xmlns="' + XRX_WSXCONFIG_SECURITY_ACTION + '"';

var XRX_WSXCONFIG_UI_PATH = '/webservices/XConfig-UI/01';
var XRX_WSXCONFIG_NETWORK_PATH = '/webservices/XConfig-Network/01';
var XRX_WSXCONFIG_SECURITY_PATH = '/webservices/XConfig-Security/01';

/****************************  FUNCTIONS  *******************************/

/********************************  UI  **********************************/


//  WsXConfig UI Interface Version


/**
* This function gets the interface version and returns the parsed values.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigUIGetInterfaceVersion( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
    var sendReq = xrxWsXConfigGetInterfaceVersionRequest( XRX_WSXCONFIG_UI_NAMESPACE, XRX_WSXCONFIG_UI_ACTION, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxWsXConfigUIParseGetInterfaceVersion( response ) 
{
    return xrxParseGetInterfaceVersion( response );
}


//  WsXConfig Network Interface Version


/**
* This function gets the interface version.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigNetworkGetInterfaceVersion( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_WSXCONFIG_NETWORK_PATH;
    var sendReq = xrxWsXConfigGetInterfaceVersionRequest( XRX_WSXCONFIG_NETWORK_NAMESPACE, XRX_WSXCONFIG_NETWORK_ACTION, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxWsXConfigNetworkParseGetInterfaceVersion( response ) 
{
    return xrxParseGetInterfaceVersion( response );
}


//  WsXConfig Security Interface Version


/**
* This function gets the interface version and returns the parsed values.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSecurityGetInterfaceVersion( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
    var sendReq = xrxWsXConfigGetInterfaceVersionRequest( XRX_WSXCONFIG_SECURITY_NAMESPACE, XRX_WSXCONFIG_SECURITY_ACTION, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxWsXConfigSecurityParseGetInterfaceVersion( response ) 
{
    return xrxParseGetInterfaceVersion( response );
}

/************************  GetInterfaceVersion Support Functions  ****************************************/

/**
* This function builds the interface version request.
*
* @return	string	xml request
*/
function xrxWsXConfigGetInterfaceVersionRequest( myNamespace, myAction, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', myNamespace, '' ) 
			+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, myAction + "/GetInterfaceVersion", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}


//  GetDefaultPathway


/**
* This function gets the default pathway.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetDefaultPathway( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigGetDefaultPathwayRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigGetDefaultPathwayRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetDefaultPathwayRequest', XRX_WSXCONFIG_UI_NAMESPACE, "" ) 
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/GetDefaultPathway", url + "/" );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    default pathway
*/
function xrxWsXConfigParseGetDefaultPathway( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["Pathway","Name"] );
	return xrxGetValue( data );
}


//  SetDefaultPathway


/**
* This function sets the default pathway.
*
* @param	url					destination address
* @param	pathway				name of pathway
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSetDefaultPathway( url, pathway, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigSetDefaultPathwayRequest( pathway, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigSetDefaultPathwayRequest( pathway, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'SetDefaultPathwayRequest', XRX_WSXCONFIG_UI_NAMESPACE, 
		    xrxCreateTag( 'Pathway', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, pathway ) ) )
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/SetDefaultPathway", url + "/" );
    }
    catch(e)
    {}
    return result;
}


//  EnumeratePathwayList


/**
* This function gets the list of pathways for the given pathway.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigEnumeratePathwayList( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigEnumeratePathwayListRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigEnumeratePathwayListRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'EnumeratePathwayListRequest', XRX_WSXCONFIG_UI_NAMESPACE, "" ) 
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/EnumeratePathwayList", url + "/" );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array	    pathway names
*/
function xrxWsXConfigParseEnumeratePathwayList( response )
{
    var result = new Array();
    var list = xrxFindElements( xrxStringToDom( response ), "Pathway" );
    if(list == null)
        list = new Array();
    for(var i = 0;i < list.length;++i)
        result[i] = xrxGetElementValue( list[i], "Name" );
	return result;
}


//  GetPathwayDefaultApplication


/**
* This function gets the default application for the given pathway.
*
* @param	url					destination address
* @param	pathway				given pathway
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetPathwayDefaultApplication( url, pathway, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigGetPathwayDefaultApplicationRequest( pathway, admin, adminPassword );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @return	string	    xml request
*/
function xrxWsXConfigGetPathwayDefaultApplicationRequest( pathway, admin, adminPassword )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetPathwayDefaultApplicationRequest', XRX_WSXCONFIG_UI_NAMESPACE, 
		    xrxCreateTag( 'Pathway', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, pathway ) ) )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	node	    Dom node containing application info
*/
function xrxWsXConfigParseGetPathwayDefaultApplication( response )
{
	return xrxFindElement( xrxStringToDom( response ), ["Application"] );
}


//  SetPathwayDefaultApplication


/**
* This function sets the default application.
*
* @param	url					destination address
* @param	pathway				name of pathway
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSetPathwayDefaultApplication( url, pathway, name, vendor, isNative, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigSetPathwayDefaultApplicationRequest( pathway, name, vendor, isNative, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigSetPathwayDefaultApplicationRequest( pathway, name, vendor, isNative, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'SetPathwayDefaultApplicationRequest', XRX_WSXCONFIG_UI_NAMESPACE, 
		    xrxCreateTag( 'Pathway', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, pathway ) )
		    + xrxCreateTag( 'Application', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, name )
		        + xrxCreateTag( 'Vendor', XRX_XML_TYPE_NONE, vendor )
		        + xrxCreateTag( 'IsNative', XRX_XML_TYPE_NONE, isNative ) ) )
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/SetPathwayDefaultApplication", url + "/" );
    }
    catch(e)
    {}
    return result;
}


//  GetDADHDefaultApplication


/**
* This function gets the DADH default application.
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetDADHDefaultApplication( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigGetDADHDefaultApplicationRequest( admin, adminPassword );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @return	string	    xml request
*/
function xrxWsXConfigGetDADHDefaultApplicationRequest( admin, adminPassword )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetDADHDefaultApplicationRequest', XRX_WSXCONFIG_UI_NAMESPACE, '' )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	node	    Dom node containing application info
*/
function xrxWsXConfigParseGetDADHDefaultApplication( response )
{
	return xrxFindElement( xrxStringToDom( response ), ["Application"] );
}


//  SetDADHDefaultApplication


/**
* This function sets the default application.
*
* @param	url					destination address
* @param	pathway				name of pathway
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSetDADHDefaultApplication( url, name, vendor, isNative, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigSetDADHDefaultApplicationRequest( name, vendor, isNative, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigSetDADHDefaultApplicationRequest( name, vendor, isNative, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'SetDADHDefaultApplicationRequest', XRX_WSXCONFIG_UI_NAMESPACE, 
		    xrxCreateTag( 'Application', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, name )
		        + xrxCreateTag( 'Vendor', XRX_XML_TYPE_NONE, vendor )
		        + xrxCreateTag( 'IsNative', XRX_XML_TYPE_NONE, isNative ) ) )
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/SetPathwayDefaultApplication", url + "/" );
    }
    catch(e)
    {}
    return result;
}


//  EnumerateApplicationList


/**
* This function gets the list of applications for the given pathway.
*
* @param	url					destination address
* @param	pathway				pathway desired
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigEnumerateApplicationList( url, pathway, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_UI_PATH;
	var sendReq = xrxWsXConfigEnumerateApplicationListRequest( pathway, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}   

/**
* This function builds the request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function xrxWsXConfigEnumerateApplicationListRequest( pathway, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'EnumerateApplicationListRequest', XRX_WSXCONFIG_UI_NAMESPACE, 
		    xrxCreateTag( 'Pathway', XRX_XML_TYPE_NONE, 
		        xrxCreateTag( 'Name', XRX_XML_TYPE_NONE, pathway ) ) ) 
		+ XRX_SOAPEND;
	try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_UI_ACTION + "/EnumerateApplicationList", url + "/" );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    default pathway
*/
function xrxWsXConfigParseEnumerateApplicationList( response )
{
    var el = xrxFindElements( xrxStringToDom( response ), "Application" );
	return ((el != null)?el:new Array());
}

/******************************  Network  **********************************/

// GetProxy

/**
* This function gets the proxy
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetProxy( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_NETWORK_PATH;
	var sendReq = xrxWsXConfigGetProxyRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the GetProxy request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    xml request
*/
function xrxWsXConfigGetProxyRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetProxyRequest', XRX_WSXCONFIG_NETWORK_NAMESPACE, '' )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_NETWORK_ACTION + "/GetProxy", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	node	    Dom node containing the proxy information
*/
function xrxWsXConfigParseGetProxy( response )
{
    var el = xrxFindElements( xrxStringToDom( response ), "ProtocolConfig" );
	return ((el != null)?el:new Array());
}

// SetProxy

/**
* This function sets the proxy
*
* @param	url					destination address
* @param    proxyConfigTag      proxy config tags as a string.
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSetProxy( url, proxyConfigTag, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_NETWORK_PATH;
	var sendReq = xrxWsXConfigSetProxyRequest( proxyConfigTag, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the SetProxy request.
*
* @param    proxyConfigTag      A string that contains the proxy setting tags in the request
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigSetProxyRequest( proxyConfigTag, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'SetProxyRequest', XRX_WSXCONFIG_NETWORK_NAMESPACE, proxyConfigTag )
		+ XRX_SOAPEND;

    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_NETWORK_ACTION + "/SetProxyEnabled", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/******************************  Security  **********************************/

// GetSSLStatus

/**
* This function gets the SSL Status
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetSSLStatus( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	var sendReq = xrxWsXConfigGetSSLStatusRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the GetSSLStatus request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigGetSSLStatusRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetSSLStatusRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, '' )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/GetSSLStatus", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    Response data
*/
function xrxWsXConfigParseGetSSLStatus( response )
{
	var node = xrxStringToDom( response );
    return xrxGetElementValue( node, 'ResponseData' );
}

// SetSSLStatus

/**
* This function sets the SSL Status
*
* @param	url					destination address
* @param	data				boolean indicating the desired state of SSL
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigSetSSLStatus( url, data, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	var sendReq = xrxWsXConfigSetSSLStatusRequest( data, admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the SetSSLStatus request.
*
* @param	data				boolean indicating the desired state of SSL
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigSetSSLStatusRequest( data, admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'SetSSLStatusRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, xrxCreateTag( 'ProvidedData', '', data) )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/SetSSLStatus", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

// GetFIPSCapability

/**
* This function gets the FIPS Capability
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetFIPSCapability( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	var sendReq = xrxWsXConfigGetFIPSCapabilityRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the GetSSLStatus request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigGetFIPSCapabilityRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetFIPSCapabilityRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, '' )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/GetFIPSCapability", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    Response data
*/
function xrxWsXConfigParseGetFIPSCapability( response )
{
	var node = xrxStringToDom( response );
    return xrxGetElementValue( node, 'ResponseData' );
}

// GetFIPSMode

/**
* This function gets the FIPS Mode
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetFIPSMode( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	var sendReq = xrxWsXConfigGetFIPSModeRequest( admin, adminPassword, sendUrl );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the GetFIPSMode request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigGetFIPSModeRequest( admin, adminPassword, url )
{
	var result = XRX_SOAPSTART
		+ xrxCreateTag( 'GetFIPSModeRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, '' )
		+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/GetFIPSMode", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    Response data
*/
function xrxWsXConfigParseGetFIPSMode( response )
{
	var node = xrxStringToDom( response );
    return xrxGetElementValue( node, 'ResponseData' );
}

// GetServerCertificate

/**
* This function gets the server certificate
*
* @param	url					destination address
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigGetServerCertificate( url, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	
	var sendReq = xrxWsXConfigGetServerCertificateRequest( admin, adminPassword, sendUrl );
	
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}

/**
* This function builds the GetServerCertificate request.
*
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigGetServerCertificateRequest( admin, adminPassword, url )
{
	var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
		+ xrxCreateTag( 'GetServerCertificateRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, '' )
		+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/GetServerCertificate", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the certificate in the response.
*
* @param	response	webservice response in string form
* @param    beginStr    beginning string of the certificate, e.g. "----BEGIN CERTIFICATE----"
* @param    endStr      end string of the certificate, e.g. "----END CERTIFICATE----"
* @return	string	    the certificate or an empty string if the certificate isn't found
*/
function xrxWsXConfigParseCertificate( response, beginStr, endStr )
{
    var index = response.indexOf( beginStr );
	var str = response.substring(index);

    if(index > 0)
	{
		return str.substring( 0, str.indexOf( endStr ) + endStr.length );
	}
	else
	{
		return '';
	}
}

// CreateSelfSignedCertificate

/**
* This function sets the server certificate
*
* @param	url					destination address
* @param    certTag				certification tags as a string.
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigCreateSelfSignedCertificate( url, certTag, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
	// alert("xrxWsXConfigCreateSelfSignedCertificate");
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	
	var sendReq = xrxWsXConfigCreateSelfSignedCertificateRequest( certTag, admin, adminPassword, sendUrl );
	
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}

/**
* This function builds the CreateSelfSignedCertificate request.
*
* @param    certTag				A xml string that contains the certificate tags in the request
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigCreateSelfSignedCertificateRequest( certTag, admin, adminPassword, url )
{
	var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
		+ xrxCreateTag( 'CreateSelfSignedCertificateRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, certTag )
		+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/CreateSelfSignedCertificate", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}

// AddCertificate

/**
* This function uploads a certificate to the device, regardless of the type.
*
* @param	url					destination address
* @param    cert				The binary certificate to upload
* @param	certPassword		An optional element to specify a password to access a certificate
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    async               asynchronous = true, synchronous = false
* @return 	Async   blank string or comm error beginning with "FAILURE"
*           Sync    response or comm error beginning with "FAILURE
*/
function xrxWsXConfigAddCertificate( url, cert, certPassword, admin, adminPassword, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_WSXCONFIG_SECURITY_PATH;
	
	var sendReq = xrxWsXConfigAddCertificateRequest( cert, certPassword, admin, adminPassword, sendUrl );

	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}

/**
* This function builds the AddCertificate request.
*
* @param    cert				The binary certificate to upload
* @param	certPassword		An optional element to specify a password to access a certificate
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @param	url					destination address
* @return	string	    		xml request
*/
function xrxWsXConfigAddCertificateRequest( cert, certPassword, admin, adminPassword, url )
{
	var XRX_MIME_HEADER_TWO = 'content-id: <1.635101843208985196@example.org>\r\n'
        + 'content-type: application/octet-stream\r\n'
        + 'content-transfer-encoding: binary\r\n\r\n';
		
	var XRX_MIME_BOUNDARY_END_TWO = '\r\n----MIMEBoundary635101843208985196--\r\n';
	
	var XRX_BYTES_CID = '<xop:Include href="cid:1.635101843208985196@example.org" />';
		
	var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM
		+ xrxCreateTag( 'AddCertificateRequest', XRX_WSXCONFIG_SECURITY_NAMESPACE, 
			xrxCreateTag('Bytes', '', XRX_BYTES_CID) + xrxCreateTag('passWordCertificate', '', certPassword) )
		+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END + XRX_MIME_HEADER_TWO + cert + XRX_MIME_BOUNDARY_END_TWO;
			
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
		{
            result = addWsSecurity( result, admin, adminPassword, XRX_WSXCONFIG_SECURITY_ACTION + "/AddCertificate", url + "/" );
		}
    }
    catch(e)
    {}
    return result;
}
 
/*************************  End of File  *****************************/
