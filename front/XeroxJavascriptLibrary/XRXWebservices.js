/* 
 * XrxWebservices.js
 * Copyright (C) Xerox Corporation, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to Xerox webservices.
 *
 * @revision    10/07/2007
 *              09/21/2012 
 *              10/15/2012  AHB Updated
 *              06/20/2013  3.10    AHB Added Synchronous behavior
 *              07/26/2013  3.11    AHB Added Mtom constants
 *              08/01/2013  3.12    AHB Added xrxParseStringSoap12ErrorResponse
 *              08/30/2013  3.0.13  AHB Added WsXConfig
 *                                  Added Authorization XRXWsSecurity.js
 *                                  Added Mtom
 *              07/20/2014  3.0.14  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.0.14.
 *              08/17/2015  3.5.01  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.5.01.
 *              10/29/2015  3.5.02  TC  Added 'xmlns:xop="http://www.w3.org/2004/08/xop/include"' 
 *										to  XRX_SOAPSTART_MTOM.
 *				06/20/2016  4.0.01  TC  Change the XMLHttpRequest object to a local variable in xrxCallAjax().
 *				01/19/2017  4.0.02  TC  Updated the version number.
 *				04/12/2017  4.0.03  TC  Updated the version number for the mustUnderstand="1" change.
 *
 *  When changing the version don't forget to change the version in the global below.
 */
 
/****************************  CONSTANTS  *******************************/

// Overall Webservices Library Version
var XRX_WEBSERVICES_LIBRARY_VERSION = "4.0.03"; 

var XRX_XML_TYPE_BOOLEAN = 'xsi:type="xsd:boolean"';

var XRX_XML_TYPE_NONE = '';

var XRX_SOAP11_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
    + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
    + 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" '
    + 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" '
    + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
    + '<soap:Body>';

var XRX_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

var XRX_SOAPEND = '</soap:Body></soap:Envelope>';
    
var XRX_SOAPSTART_MTOM = '<soap:Envelope' + 
	' xmlns:xop="http://www.w3.org/2004/08/xop/include"' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

var XRX_MIME_BOUNDARY = '----MIMEBoundary635101843208985196\r\n';

var XRX_MIME_BOUNDARY_END = '\r\n----MIMEBoundary635101843208985196\r\n';

var XRX_MIME_HEADER = 'content-id: <0.635101843208985196@example.org>\r\n'
        + 'content-type: application/xop+xml; charset=utf-8; type="application/soap+xml; charset=utf-8"\r\n'
        + 'content-transfer-encoding: binary\r\n\r\n';



/****************************  FUNCTIONS  *****************************/

/**
* This function calls the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param	headers				array of optional headers in format {name:value} or null (optional)
* @param	username			username for user credentials (blank will not be included)
* @param	password			password for user credentials (blank will not be included)
* @param    async               asynchronous = true, synchronous = false
* @return   If Async return will be a blank string - If Synch return will either be the response or an error string starting with "Failure"
*/
function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers, username, password, async )
{
	return xrxCallAjax( url, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout, username, password, async );
}

/**
* This function is the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	type				request type (GET or POST)
* @param	headers				array of arrays containing optional headers to set on the request or null
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param    username            optional username for ajax request
* @param    password            optional password for ajax request
* @param    async               asynchronous = true, synchronous = false
* @return   If Async return will be a blank string - If Synch return will either be the response or an error string starting with "Failure"
*/
function xrxCallAjax( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password, async )
{
	// Ajax Request Object
	var xrxXmlhttp = new XMLHttpRequest();
	
	// Ajax Request Xml
	var xrxEnvelope = null;
	
	// Storage for Success Callback Function Address
	var xrxAjaxSuccessCallback = null;
	
	// Storage for Failure Callback Function Address
	var xrxAjaxFailureCallback = null;

	if(async == undefined)
	    async = true;

	xrxEnvelope = envelope;
	xrxAjaxSuccessCallback = ((callback_success == undefined)?null:callback_success);
	xrxAjaxFailureCallback = ((callback_failure == undefined)?null:callback_failure);

	try
	{
	    if((username == undefined) || (password == undefined) || (username == null) || (password == null))
	        xrxXmlhttp.open( type, url, async );
	    else
	        xrxXmlhttp.open( type, url, async, username, password );
	}
	catch(exc)
	{
        var errString = "";
        var uaString = navigator.userAgent;
        if(!async && (uaString != undefined) && (uaString != null) && ((uaString = uaString.toLowerCase()).indexOf( "galio" ) >= 0))
            errString = "FAILURE: Synchronous Ajax Does Not Work in FirstGenBrowser!";
        else
            errString = "FAILURE: Failure to Open Ajax Object!";
	    xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, 0, errString );
	    return errString;
	}
	if(headers != null)
	{
		for(var i = 0;i < headers.length;++i)
		{
			xrxXmlhttp.setRequestHeader( headers[i][0], headers[i][1] );
		}
	} else
	{
	    xrxXmlhttp.setRequestHeader("SOAPAction", '""');
	    xrxXmlhttp.setRequestHeader( "Content-Type", "text/xml" );
	}
	if(async)
	{
		// response function
	    xrxXmlhttp.onreadystatechange = function() 
	    {
		    if((xrxXmlhttp != null) && (xrxXmlhttp.readyState == 4))
		    {
			    try
			    {
					xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
			    }
			    catch( e )
			    {
				    xrxAjaxFailureCallback( xrxEnvelope, "<comm_error>" + e.toString() + "</comm_error>", 0 );
			    }
		    }
	    }
	    xrxXmlhttp.send( xrxEnvelope );
	    if((timeout != undefined) && (timeout != null) && (timeout > 0) && (xrxAjaxFailureCallback != null)) {
			var msg = "<comm_error>COMM TIMEOUT(" + timeout + " sec)</comm_error>";
			setTimeout( "xrxAjaxFailureCallback( xrxEnvelope, msg, -99 )", timeout * 1000 );
		}
	} else
	{
	    try
	    {
	        xrxXmlhttp.send( xrxEnvelope );
	        xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
	    }
	    catch( e )
	    {
	        return "FAILURE: comm_error " + (((e != null) && (e.message != null))? e.message : "Exception" );
	    }
        return ((xrxXmlhttp.status == 200) ? "" : "FAILURE: " + xrxXmlhttp.status + " - ") + xrxXmlhttp.responseText;
    }
    return "";
}



/**
* This function calls the callbacks if they were given a value.
*
* @param    status      status code
* @param    response    websertvice response
*/
function xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, status, response )
{
    if((response == undefined) || (response == null))
        response = "";
    if(status != 200) 
    {
	    if(xrxAjaxFailureCallback != null) 
		    xrxAjaxFailureCallback( xrxEnvelope, response, status );
    } else 
    {
	    if(xrxAjaxSuccessCallback != null) 
		    xrxAjaxSuccessCallback( xrxEnvelope, response );
    }
}

// Helper functions

/**
* This function pulls the Mtom data from the response.
*
* @param	response	webservice response in string form
* @return	string		job data
*/
function findMtomData( response, idString, idString2 )
{
    var index = response.indexOf( idString );
    if((index > 0) && ((index = response.indexOf( idString, index + 1 )) > 0))
        return response.substring( index, response.lastIndexOf( idString2 ) + 1 );
    return "FAILURE: Cannot Locate Mtom Data!";
}

/**
* This function parses the interface version.
*
* @param	response	webservice response in string form
* @return	array	[MajorVersion],[MinorVersion],[Revision]
*/
function xrxParseInterfaceVersion( response )
{
	var result = new Array();
	var dom = xrxStringToDom( response );
	var data = xrxGetTheElement( dom, "InterfaceVersion" );
	var node = xrxFindElement( data, ["MajorVersion"] );
	if(node != null) result['MajorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["MinorVersion"] );
	if(node != null) result['MinorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["Revision"] );
	if(node != null) result['Revision'] = xrxGetValue( node );
	return result;
}

/**
* This function returns the parsed interface values.
*
* @param	response	    webservice response in string form
* @return	string		    Major.Minor.Revision
*/
function xrxParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

/**
* This function parses the error response.
*
* @param	response	webservice response in string form
* @return	fault portion of response in DOM form or null
*/
function xrxParseErrorResponse( response )
{
	var data = null;
	if((response != null) && (response != ""))
		data = xrxFindElement( xrxStringToDom( response ), ["Fault"] );
	return data;
}

/**
* This function parses the error response.
*
* @param	response	webservice response in string form
* @return	fault portion of response in DOM form or null
*/
function xrxParseStringSoap12ErrorResponse( response )
{
    var subcode = "";
    var reason = "";
    if((typeof(response) != "undefined") && (response != null))
    {
	    var index = response.indexOf( "Subcode" );
	    if(index > 0)
	        if((index = response.indexOf( "Value", index )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                subcode = response.substring( index + 1, response.indexOf( "<", index ) );
	    if((index = response.indexOf( "Reason" )) > 0)
	        if((index = response.indexOf( "Text" )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                reason = response.substring( index + 1, response.indexOf( "<", index ) );
	}
	if((subcode != "") || (reason != ""))
	    return subcode + ":" + reason;
	else
	    return "General Failure:" + response;
}

function xrxParsePayload( text, name )
{
    var result = "";
    var index;
    if((index = text.indexOf( ":" + name + ">" )) < 0)
        if((index = text.indexOf( "<" + name + ">" )) < 0)
            if((index = text.indexOf( ":" + name + " " )) < 0)
                index = text.indexOf( "<" + name + " " );
    if(index >= 0)
    {
        var fullname = xrxGetWholeName( text, name, index );
        index = text.indexOf( ">", index ) + 1;
        var index2 = text.indexOf( "/" + fullname, index );
        if(index2 > 0)
            result = text.substring( index, index2 - 1 );
    }
    return result;
}

function xrxGetWholeName( text, name, index )
{
    var result;
    var start = xrxBackSearch( text, '<', index );
    if((start >= 0) && (start < index))
        result = text.substring( start + 1, start + ((index - start) + name.length + 1) );
    else
        result = "";
    return result;
}

function xrxBackSearch( text, theChar, index )
{
    var result;
    for(result = index;(text.charAt( result ) != theChar) && (result >= 0);--result);
    return result;
}

/*************************  Support Files  *****************************/

/**
* This function returns the Library version.
*
* @return	string	version string
*/
function xrxGetWebservicesLibraryVersion()
{
    return XRX_WEBSERVICES_LIBRARY_VERSION;
}

/**
* This function creates an xml tag in a string.
*
* @param	label		tag
* @param	type		attribute
* @param	value		text value
*/
function xrxCreateTag( label, type, value )
{
    if(type == "")
    {
        return( "<" + label + ">" + value + "</" + label + ">" );
    }
    else
    {
        return( "<" + label + " " + type + ">" + value + "</" + label + ">" );
    }
}

/*************************  ASync Framework  *****************************/

// Singleton object
var xrxASyncFramework = new XrxASyncFramework();

/**
* This constructor creates an object that handles some of the complexities
* of async programming. It works on the idea of a 'framework'. This framework
* is an array that holds a series of steps each with its function to call if
* the previous level was successful and one to call if not. Storage of 
* intermediate values is accomplished by the store and recall functions.
*
* A typical setup would be:
*	framework = new Array();
*	framework[0] = ["loadTemplates"];
*	framework[1] = ["finishLoadTemplates","commFailure"];
*	framework[2] = ["finishInitiateScan","commFailure"];
*	xrxASyncFramework.load( framework );
*	xrxASyncFramework.start();
*
* The function loadTemplates would be called first. Somewhere in that function a 
* Ajax call will be made. When it returns the AsyncFramework will execute the 
* first function call of the next layer if the Ajax call was successful and the 
* second if a failure. This will continue until the framework is no longer called 
* or all layers are executed.
* 
* A traditional function with a webservice would be as you normally create it but with the exception of the success callback and the failure callback are fixed
* values of xrxASyncSuccessCallback and xrxASyncFailureCallback, as below:
*
* function getDefaultApplication()
* {
*    xrxWsXConfigGetPathwayDefaultApplication( "http://127.0.0.1", "Services", adminUserString, adminPasswordString, xrxASyncSuccessCallback, xrxASyncFailureCallback, 30, true );
* }
*
* Your callback functions remain the same with two additions, one, You get the parameters by calling for them and you finish with a mandatory call:
*
* function gda_success( request, response )
* {
*     response = xrxASyncFramework.recall( "p1" ); // calls for parameter 1 (0 based parameter list) which is the response
*     var app = new AppInfo( xrxWsXConfigParseGetPathwayDefaultApplication( response ) ).name;
*     if(app != null)
*     {
*         document.getElementById( 'defaultApplication' ).innerHTML = app;
*         for(var i = 0;i < applicationLen;++i)
*             if(applicationList[i].name == app)
*             {
*                 selectedApplicationIndex = i;
*                 selectApplication();
*                 break;
*             }
*     }
*     xrxASyncCallback( null, 0 ); // returns control to the framework
* }
*
* So in the following framework the first call is made and if failure goes to your error handler gen_failure() and your handler can decide if the framework continues.
* If successful it drops down to the next which is your success handler:
*
* framework = new Array();
* framework.push( ["getDefaultApplication", "gen_failure"] );
* framework.push( ["gda_success"] );
* xrxASyncFramework.load( framework );
* xrxASyncFramework.start();
*
* You can also add any normal non-webservice functions to the list and when you call xrxASyncCallback the second parameter can be 0 for success or 1 for failure.
*
*/
function XrxASyncFramework()
{
	this.framework = null;
	this.queue = new Array();
	this.step = 0;
	this.cancel = false;
	this.parameters = null;
	
	this.load = xrxASyncLoadFramework;
	this.start = xrxASyncStartFramework;
	this.stop = xrxASyncStopFramework;
	this.restart = xrxASyncStartFramework;
	this.store = xrxASyncStoreParameter;
	this.recall = xrxASyncGetParameter;
	this.clear = xrxASyncClear;
	this.success = xrxASyncSuccessCallback;
	this.failure = xrxASyncFailureCallback;
}

/**
* This function loads a new framework and returns internal values
* to default.
*
* @param	framework	framework to load
*/
function xrxASyncLoadFramework( framework )
{
	this.framework = framework;
	this.step = 0;
	this.cancel = false;
	this.parameters = new Array();
}

/**
* This function clears the data from the framework.
*/
function xrxASyncClear()
{
	this.cancel = true;
	this.parameters = null;
	this.framework = new Array();
	this.step = 0;
}

/**
* This function starts the framework executing.
*/
function xrxASyncStartFramework()
{
	eval( this.framework[this.step++][0] + "()" );
}

/**
* This function stops the framework.
*/
function xrxASyncStopFramework()
{
	this.cancel = true;
}

/**
* This function stores a given value.
*
* @param	name	name of stored value
* @param	value	value to store
*/
function xrxASyncStoreParameter( name, value )
{
	this.parameters[name] = value;
}

/**
* This function retreives a previously stored value.
*
* @param	name	name of stored value
*/
function xrxASyncGetParameter( name )
{
	return this.parameters[name];
}

/*************************  External Functions  *****************************/

/**
* This function is called upon successful conclusion of a webservice call.
*/
function xrxASyncSuccessCallback()
{
	xrxASyncCallback( arguments, 0 );
}

/**
* This function is called upon a failed conclusion of a webservice call.
*/
function xrxASyncFailureCallback()
{
	xrxASyncCallback( arguments, 1 );
}

/**
* This function is handles the callback. The arguments are stored 
* under p1 ... pn.
*
* @param	params	arguments sent from Ajax handler
* @param	code	0=successful, 1=failure
*/
function xrxASyncCallback( params, code )
{
	if(xrxASyncFramework.parameters != null)
	    if(params != null)
		    for(var i = 0;i < params.length;++i)
			    xrxASyncFramework.store( ("p" + i), params[i] );
	if(!xrxASyncFramework.cancel)
		if(xrxASyncFramework.framework[xrxASyncFramework.step] != undefined)
			if(xrxASyncFramework.framework[xrxASyncFramework.step] != null)
				eval( xrxASyncFramework.framework[xrxASyncFramework.step++][code] + "()" );
}

/*************************  End of File  *****************************/
