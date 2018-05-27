// This file is for debugging only, please remove it from your page after debugging is done


var xrxWebservicesDebugIpAddress = "127.0.0.1";

function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers, username, password, async)
{
	// replace the ip address in the url with the debug ip address if ip address is used
	var debugUrl = url.replace(new RegExp("\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", 'gi'), xrxWebservicesDebugIpAddress);
	// replace the "localhost" in the url with the debug ip address if "localhost" is used
	debugUrl = debugUrl.replace(/localhost/i, xrxWebservicesDebugIpAddress);

	return xrxCallAjax( debugUrl, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout, username, password, async );
}

(function xrxWebservicesDebug(ip) {
	xrxWebservicesDebugIpAddress = ip ? ip : "127.0.0.1";
})("127.0.0.1");   // Replace "127.0.0.1" in this line with the ip address of your MFD

