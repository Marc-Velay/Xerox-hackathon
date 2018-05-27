/* 
 * PrintHelp.js
 *
 * This file encapsulates the functions to Xerox webservices.
 *
 */

/****************************  CONSTANTS  *******************************/



/****************************  VARIABLES  *******************************/

var urlStr = "";
var input = "";
var jobId = "";


/****************************  FUNCTIONS  *******************************/

/*
* Get Session Info
*/
function getSessionInfo() 
{
    xrxSessionGetSessionInfo("http://127.0.0.1", getSessionInfo_callback_Success, getSessionInfo_callback_failure);
}

/**
* This function is called if the getSessionInfo call is successful.
* It extracts the accounting info from the getSeesionInfo call, 
* creats a print job ticket and submit a print job.
*
* @param request	request envelope of webservice call
* @param response	webservice response in string form
*/
function getSessionInfo_callback_Success(request, response) 
{
    // Extract the accounting info from the getSessionInfo response
    // and create the input tag of the print job ticket.
    var data = xrxSessionParseGetSessionInfo(response);

    var jba = xrxGetElementValue(data, "jba");

    var xsa = xrxGetElementValue(data, "xsa");

    if ((jba != null) && (jba != "") && (jba != undefined)) {
        var jbaUserId = xrxGetElementValue(data, "userID");
        var jbaAcctId = xrxGetElementValue(data, "accountID");

        input = xrxPrintInputJBA(jbaUserId, jbaAcctId);
    }

    if ((xsa != null) && (xsa != "") && (xsa != undefined)) {
        var xsaUserId = xrxGetElementValue(data, "userID");
        var xsaAcctType = xrxGetElementValue(data, "AccountType");
        var xsaAcctId = xrxGetElementValue(data, "AccountID");

        input = xrxPrintInputXSA(xsaUserId, xsaAcctType, xsaAcctId);
    }
	
	getDeviceCapability();
}

/**
* This function handles the response when the GetSessionInfo call fails
*
* @param request	soap request for the GetSessionInfo call
* @param response	soap response for the GetSessionInfo call
*/
function getSessionInfo_callback_failure(envelope, response) {
    writeSR3("GetSessionInfo failed", false);
    setTimeout("writeSR3('', false)", 10000);
}

/**
 * This function get the device capabilities
 */
function getDeviceCapability()
{
	xrxDeviceConfigGetDeviceCapabilities( "http://127.0.0.1", getDeviceCapabilities_success, getDeviceCapatilities_failure, null);
}

/**
 * This function handles the response when get device capabilities call is successful.
 * It displays the print options based on print device capabilities. 
 *
 * @param    request        GetDeviceCapabilities soap request
 * @param	 response		GetDeviceCapabilities soap response
*/   
function getDeviceCapabilities_success(request, response)
{
	var data = xrxDeviceConfigParseGetDeviceCapabilities( response );

	var colorEffects = xrxFindElement( data, ["Output", "ColorEffectsTypeCapabilities"] );
	
	if (colorEffects)
	{
		document.getElementById("color").innerHTML = getOptions(colorEffects, "AllowedValue");
	}
	
	var printCapabilities = getCapabilitiesByService(data, "Print");
	
	if (printCapabilities)
	{
		var collation = xrxFindElement( printCapabilities, ["SheetCollateCapabilities"] );
		if (collation)
		{
			var collationDefault = xrxGetElementValue( printCapabilities, "DefaultValue" );
			document.getElementById("collation").innerHTML = getOptions(collation, "AllowedValue", collationDefault);
		}
		
		var sides = xrxFindElement( printCapabilities, ["Output", "SidesCapabilities", "SidesSupported"] );
		if (sides)
		{
			var sidesDefault = xrxGetElementValue( printCapabilities, "DefaultValue" );
			document.getElementById("sides").innerHTML = getOptions(sides, "AllowedValue", sidesDefault );
		}
	}
	
	var trayDefault = xrxGetElementValue(data, "InputTrayNameDefault");
	document.getElementById("tray").innerHTML = getOptions(data, "InputTrayName", trayDefault);
	
	xrx_load_widgets();
} 

/**
 * This function retrieves the device capabilities by service.
 * 
 * @param 	data		Device capabilities node.
 * @param 	serviceType	Service type as a string.
 * @return	node 		The node that contains the device capabilities if the service type is found or null
 *
 */
function getCapabilitiesByService( data, serviceType )
{
	var arr = xrxFindElements(data, "CapabilitiesByService");
	for (var i = 0; i < arr.length; i++)
	{
		var service = xrxGetElementValue ( arr[i], "ServiceType" );

		if (service == serviceType)
		{
			return xrxFindElement( arr[i], ["DeviceJobProcessingCapabilities"] );
		}
	}
	
	return null;
}	

/**
 * This function returns the select options as a string.
 * 
 * @param 	data		The device capabilities node for a feature.
 * @param	id			Element id for the select control for the feature.
 * @param	defaultVal	The default value from the feature.
 *
 * @return	The Select control options for the feature as a string.
 *
 */
function getOptions(data, id, defaultVal)
{
	var arr = xrxFindElements(data, id);
	var optionStr = "";
	
	for (var i = 0; i < arr.length; i++)
	{
	
		var val = xrxGetValue( arr[i] );
		var displayVal = val;
		switch (val)
		{
			case "MonochromeGrayscale":
				displayVal = "GrayScale";
				break;
			default:
				break;
		}
		
		if (val == defaultVal)
		{
			optionStr += '<option selected value="' + val + '">' + displayVal + '</option>';
		}
		else
		{
			optionStr += '<option value="' + val + '">' + displayVal + '</option>';
		}
	}

	return optionStr;
}	

/**
 * This function handles the response when get device capabilities fails.
 *
 * @param   request        GetDeviceCapabilities soap request
 * @param	response	   GetDeviceCapabilities soap response
*/   
function getDeviceCapatilities_failure(request, response)
{
    writeSR3("GetDeviceCapabilities failed", false);
    setTimeout("writeSR3('', false)", 10000);
}

/**
 * This function makes the InitiatePrintJobURL call.
 */
function startPrint() {
    var finishing = document.getElementById('collation').value;
    var sides = document.getElementById('sides').value;
	var tray = document.getElementById('tray').value;

    // Create the output tag of the print job ticket. 
    var output = xrxPrintOutput("None", "None", "None", "Color", finishing, "1", sides, tray);

    // Create the JobProcessing tag of the print job ticket.
    var jobProcessing = xrxPrintJobProcessing(input, output);

    // Create the JobDescription tag of the print job ticket.
    urlStr = getCookie('url');
	
    var from = urlStr.lastIndexOf("/");

    var to = urlStr.length;

    var filename = urlStr.substring(from + 1, to);
			
    var jobDescription = xrxPrintJobDescription(filename, "Pull Print App");

    // Create the print job ticket
    // var printJobTicket = null;			// Default value will be used if set print job ticket to null
    var printJobTicket = xrxPrintJobTicket(jobDescription, jobProcessing);

    var useridStr = getCookie('uid');
    var passwordStr = getCookie('password');

    // Submit the print job.
    xrxPrintInitiatePrintJobURL("http://127.0.0.1", urlStr, useridStr, passwordStr,
		 printJobTicket, print_callback_success, print_callback_failure);
}

/**
* This function handles the response when InitiatePrintJobURL is successful. 
*
* @param    request         InitiatePrintJobURL soap request
* @param	response		InitiatePrintJobURL soap response
*/    
function print_callback_success( envelope, response )
{
    jobId = xrxPrintParseInitiatePrintJobURL(response);
	writeSR3(jobId + " submitted successfully.", false);
	xrxGetJobDetails("http://127.0.0.1", "Print", "JobId", jobId, callback_success_job_details, callback_failure_job_details);
}

/**
* This function handles the response when InitiatePrintJobURL fails. 
*
* @param    request         InitiatePrintJobURL soap request
* @param	response		InitiatePrintJobURL soap response
*/   
function print_callback_failure(request, response, status) 
{
    writeSR3("PullPrint failed", false);
    setTimeout("writeSR3('', false)", 10000);
}

/**
* This function handles the response when GetJobDetails is successful. 
*
* @param    request         GetJobDetails soap request
* @param	response		GetJobDetails soap response
*/              
function callback_success_job_details(request, response)
{
    var jobDetails = xrxJobMgmtParseGetJobDetails(response);
    var jobStateNode = xrxFindElement(jobDetails, ["JobInfo", "JobState"]);
    var jobState = xrxGetValue(jobStateNode);
    
    var jobStateMsg = jobId + " : " + jobState;
    writeSR3(jobStateMsg, false);
    
    if (jobState == 'Completed')
    {
        var jobStateReason = xrxJobMgmtParseJobStateReasons(response);
        var jobStateReasonMsg =  " - " + jobStateReason;
        writeSR3(jobStateReasonMsg, true);
        
        setTimeout("writeSR3('', false)", 10000);
    }
    else
    {
        setTimeout("xrxGetJobDetails(\"http://127.0.0.1\", \"Print\", \"JobId\", jobId, callback_success_job_details, callback_failure_job_details)", 5000);
    }
}
  
/**
* This function handles the response when GetJobDetails fails. 
*
* @param    request         GetJobDetails soap request
* @param	response		GetJobDetails soap response
*/      
function callback_failure_job_details(request, response)
{
    writeSR3("GetJobDetails failed", false);
    setTimeout("writeSR3('', false)", 10000);
}

//
// Help functions
//

/**
 * Help function, build the PrintJobTicket.
 * 
 * @param jobDescription    job description tag string
 * @param jobProcessing     job processing tag string
 * @return string PrintJobTicket tag in escaped form
 */
function xrxPrintJobTicket(jobDescription, jobProcessing)
{
	var ticketStr = '<?xml version=\"1.0\" encoding=\"utf-8\"?>' +
		xrxCreateTag('PrintJobTicket', 'xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"http://schemas.xerox.com/enterprise/eipjobmodel/1\"', jobDescription + jobProcessing);
    return xrxEscape( ticketStr ); 
}

/**
 * Help function, build the JobDescription tag in the PrintJobTicket
 *
 * @param jobName   job name 
 * @param jobOriginating    job owner
 * @return string JobDescription tag in PrintJobTicket 
 */
function xrxPrintJobDescription(jobName, jobOriginating)
{
    return xrxCreateTag('JobDescription', '', 
		xrxCreateTag('JobName', '', jobName) + xrxCreateTag('JobOriginatingUserName', '', jobOriginating));
}

/**
 * Help function, build the JobProcessing tag in the PrintJobTicket
 * @param input     input tag string
 * @param output    output tag string
 * @return string   JobProcessing tag in PrintJobTicket
 */
function xrxPrintJobProcessing(input, output)
{
    return xrxCreateTag('JobProcessing', '', input + output);
}

/**
 * Help function, build the Input tag in the PrintJobTicket when the accouting type is JBA
 * 
 * @param jbaUserId JBA user id
 * @param jbaAcctId JBA account id
 * @return string   Input tag in PrintJobTicket 
 */
function xrxPrintInputJBA(jbaUserId, jbaAcctId)
{
    return xrxCreateTag('Input', '', 
		xrxCreateTag('Accounting', '', xrxCreateTag('Jba', '',
			xrxCreateTag('JobAccountingUserId', '', jbaUserId) + xrxCreateTag('JobAccountId', '', jbaAcctId))));
}


/**
 * Help function, build the Input tag in the PrintJobTicket when the accouting type is XSA
 *
 * @param xsaUserId     XSA user id
 * @param xsaAcctType   XSA account type
 * @param xsaAcctId     XSA account id
 * @return string       Input tag in PrintJobTicket
 */
function xrxPrintInputXSA(xsaUserId, xsaAcctType, xsaAcctId)
{
   return xrxCreateTag('Input', '', 
		xrxCreateTag('Accounting', '', xrxCreateTag('Xsa', '',
			xrxCreateTag('AccountUserId', '', xsaUserId) + xrxCreateTag('AccountTypeInfo', '', 
				xrxCreateTag('AccountType', '', xsaAcctType) + xrxCreateTag('AccountID', '', xsaAcctId)) + 
			xrxCreateTag('AccountBillingId', '', ''))));	
}


/**
 * Help function, build the Output tag in the PrintJobTicket
 *
 * @param staple    StapleFinishing value
 * @param punch     PunchFinishing value
 * @param fold      FoldFinishing value
 * @param color     ColorEffectsType value
 * @param collate   SheetCollate value
 * @param copies    Number of copies
 * @param sides     Output plex value
 * @param inputTray Input tray value
 * @return string   Output tag in PrintJobTicket
 *
 */
function xrxPrintOutput(staple, punch, fold, color, collate, copies, sides, inputTray)
{
    var finishingTag = xrxCreateTag('Finishings', '', 
			xrxCreateTag('StapleFinishing', '', staple) + xrxCreateTag('PunchFinishing', '', punch) + xrxCreateTag('FoldFinishing', '', fold));

    var colorEffectsTag = xrxCreateTag('ColorEffectsType', '', color);

    var collationTag = xrxCreateTag('SheetCollate', '', collate);

    var copiesTag = xrxCreateTag('Copies', '', copies);

    var sidesTag = xrxCreateTag('Sides', '', sides);

    var trayTag = xrxCreateTag('InputTraysCol', '', xrxCreateTag('InputTrayName', '', inputTray));

    return xrxCreateTag('Output', '', finishingTag + colorEffectsTag + collationTag + copiesTag + sidesTag + trayTag);
}

/*
* Function to escape the unescaped characters in a xml payload.
*
* @param text	string to modify
*/
function xrxEscape( text )
{
	text = unescape( text );
	text = xrxReplaceChars( text, "<", "&lt;" );
	text = xrxReplaceChars( text, ">", "&gt;" );
	return text;
}
