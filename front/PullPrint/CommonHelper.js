
/*
 * CommonHelper.js 
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved. 
 *
 * This file contains functions to start a scan job and to handle the response
 * using the Scan Job Web Service Library
 */

/**
 * This function sets the display for an element.
 * @param   id          Element id.
 * &param   displayVal  Display value. "block" for display, "none" for not display.
 */  
function set_display(id, displayVal)
{
    var v1 = document.getElementById(id);
    v1.style.display = displayVal;
}

/**
* This writes the message to the SR3 area if it exists.
*
* @param msg	message to write
* @param append	true = append
*/
function writeSR3( msg, append )
{
	if(append == undefined) append = true;
	var sr3 = document.getElementById( "xrx:StatusRegionSR3" );
	if(sr3 != null)
	{
		if(!append) sr3.innerHTML = "";
		sr3.appendChild( document.createTextNode( msg ) );
	}		
} 
 
/**
* This writes the message to the SR2 area if it exists.
*
* @param msg	message to write
* @param append	true = append
*/
function writeSR2( msg, append )
{
	if(append == undefined) append = true;
	var sr2 = document.getElementById( "xrx:StatusRegionSR2" );
	if(sr2 != null)
	{
		if(!append) sr2.innerHTML = "";
		sr2.appendChild( document.createTextNode( msg ) );
	}		
}

/**
* This function disables/enables a Xerox widget while taking into 
* account the differences between Rev 1 and Rev 2.
*
* @param id			ID of widget
* @param disable	true=disable widget
*/
function disable(id, disable) {

    var node = document.getElementById(id);

    var version = getXeroxWidgetVersion();

    var action = "Addition";

    var val = "unselectable";

    if ((disable == undefined) || disable) {
        if (version == "Xerox Widgets Rev 1") {
            node.setAttribute('disabled', "true");
            val = "disabled";
        }
        else {
            node.setAttribute('unselectable', "true");
        }
    }
    else {
        if (node.hasAttribute('disabled')) {
            node.removeAttribute('disabled');
            val = "disabled";
        }
        else {
            if (node.hasAttribute('unselectable'))
                node.removeAttribute('unselectable');
        }
        action = "Removal";
    }
    xrxSendDomAttrModifiedEvent(node, false, false, val, null, null, action, true);
}

/**
* This calls the Session Api exit function to exit EIP mode.
*/
function exit()
{
	xrxSessionExitApplication( "http://127.0.0.1", null );
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function xSetSelectRadio(nodeName, value) {
    var node = document.getElementById(nodeName);
    if (node != null) {
        for (var i = 0; i < node.options.length; ++i) {
            if (node.options[i].value == value) {
                return i;
            }
        }
    }
    return 0;
}
