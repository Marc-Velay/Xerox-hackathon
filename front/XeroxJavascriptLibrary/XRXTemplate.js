
/* 
 * XrxTemplate.js
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Template Api webservices.
 *
 * @revision    04/26/2012 added GetInterfaceVersion and ReplaceTemplate
 *              10/15/2012 AHB Updated
 */

/****************************  CONSTANTS  *******************************/

var XRX_TEMPLATE_SOAPSTART = 
		'<?xml version=\"1.0\" encoding=\"utf-8\"?>'
		+ '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" '
		+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
		+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body>';

var XRX_TEMPLATE_SOAPEND = '</soap:Body></soap:Envelope>';

var XRX_TEMPLATE_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/template_management/1/"';

var XRX_TEMPLATE_PATH = '/webservices/office/template_management/1';

/****************************  FUNCTIONS  *******************************/

//  Template Interface Version

/**
* This function gets the Template interface version.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_TEMPLATE_PATH;
    var sendReq = xrxTemplateGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Template interface version request.
*
* @return	string	xml request
*/
function xrxTemplateGetInterfaceVersionRequest()
{
	return	XRX_TEMPLATE_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxTemplateParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}

//  Get Template List

/**
* This function gets the Template List from the device.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetTemplateList( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateListRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template List request.
*
* @return	string	xml request
*/
function xrxTemplateGetTemplateListRequest()
{
	return	XRX_TEMPLATE_SOAPSTART
			+ xrxCreateTag( 'ListTemplatesRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	array		associative array of the form
*						name = checksum
*/
function xrxTemplateParseGetTemplateList( response )
{
	var result = new Array();
	try
	{
	    var data = xrxGetTheElement( xrxStringToDom( response ), "TemplateEntries" );
	    var entries = xrxFindElements( data, "TemplateEntry" );
	    var name, checksum;
	    if(entries != null)
		    for(var i = 0;i < entries.length;++i)
			    if(((name = xrxGetElementValue( entries[i], "TemplateName" )) != null) &&
				    ((checksum = xrxGetElementValue( entries[i], "TemplateChecksum" )) != null))
			    result[name] = checksum;
    }
    catch( e )
    {
    }
	return result;
}

//  Get Template

/**
* This function gets the template from the device.
*
* @param	url					destination address
* @param	template			name of template
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateGetTemplate( url, template, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateRequest( template );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template request.
*
* @param	template	template name
* @return	string	xml request
*/
function xrxTemplateGetTemplateRequest( template )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'GetTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}
/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		template content or null
*/
function xrxTemplateParseGetTemplate( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["GetTemplateResponse","TemplateContent"] );
	return xrxGetValue( data );
}

//  Put Template

/**
* This function puts the provided template on the device.
*
* @param	url					destination address
* @param	templateName		template name
* @param	template			template content data
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplatePutTemplate( url, templateName, template, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplatePutTemplateRequest( templateName, template );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Put Template request.
*
* @param	templateName	template name
* @param	template		template content data
* @return	string	xml request
*/
function xrxTemplatePutTemplateRequest( templateName, template )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'PutTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		checksum or null
*/
function xrxTemplateParsePutTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Replace Template

/**
* This function puts the provided template content in the given template already on the device.
*
* @param	url					destination address
* @param	templateName		template name
* @param	templateContent		template content data
* @param	priorChecksum		checksum of template currently on device
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateReplaceTemplate( url, templateName, templateContent, priorChecksum, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Replace Template request.
*
* @param	templateName	    template name
* @param	templateContent		template content data
* @return	string	xml request
*/
function xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'ReplaceTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, templateContent ) 
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, priorChecksum ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		checksum or null
*/
function xrxTemplateParseReplaceTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Delete Template

/**
* This function deletes the template from the device.
*
* @param	url					destination address
* @param	template			template name
* @param	checksum			template checksum
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxTemplateDeleteTemplate( url, template, checksum, callback_success, 
									callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateDeleteTemplateRequest( template, checksum );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Delete Template request.
*
* @param	template	template content data
* @param	checksum	template checksum
* @return	string	xml request
*/
function xrxTemplateDeleteTemplateRequest( template, checksum )
{
	return	XRX_TEMPLATE_SOAPSTART
			    + xrxCreateTag( 'DeleteTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template )
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, checksum ) ) 
			    + XRX_TEMPLATE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	boolean		true if successful
*/
function xrxTemplateParseDeleteTemplate( response )
{
	if(xrxGetTheElement( xrxStringToDom( response ), "VoidResponse" ) != null)
		return true;
	else
		return false;
}

/*************************  End of File  *****************************/
