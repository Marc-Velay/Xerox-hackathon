
/* 
* XrxXmlHandler.js
* Copyright (C) Xerox Corporation, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
*
* This file contains functions to handle XML as the Galio Ant browser 
* does not have XML support at this time.
*
*  Revisions
*               07/11/2011  BRP Updated to allow faster XML parsing
*               10/15/2012  AHB Updated
*               08/01/2013  AHB Updated formatting
*               08/30/2013  AHB Commented out error alert
*/

/****************************  Constants  *****************************/

/****************************  XML Parser  *****************************/

/**
* This is the top level call to get a DOM structure from a text XML message.
*
* @param thedoc		string XML
* @return Dom structure representing text given
*/
function xrxStringToDom( thedoc )
{
	return( new DOMParser().parseFromString( thedoc, "text/xml" ) );
}

/**************  XML Conversion Dom to String  ******************/

/**
* This function writes a XML DOM structure to a well formed 
* XML text representation.
*
* @param document	xml document
*/
function xrxDomToString( doc )
{
	return new XMLSerializer().serializeToString( doc );
}

/**********************  Helper Functions  *******************************/

/**
* This function makes the DOM call to get a new XML document.
*/
function xrx_getXmlDocument()
{
	return xrx_getXmlDocumentNS( "", "root" );
}

/**
* This function makes the DOM call to get a new XML document.
*/
function xrx_getXmlDocumentNS( ns, name )
{
	return document.implementation.createDocument( ns, name, null );
}

/**
* This function gets the element name of the node and strips off any 
* namespace prefix.
*
* @param node	node to get the name of
* @return unqualified name of node
*/
function xrxGetElementName( node )
{
	var name = "";
	try
	{
		var names = (node.nodeName).split( ":" );
		name = names[names.length - 1];
	}
	catch( e )
	{}
	return name;
}

/**
* This function searches the given DOM structure for nodes
* with the given name.
*
* @param xmldoc		XML document
* @param name		name of node to search for
* @return	array of nodes with given name or null
*/
function xrxFindElements( xmldoc, name )
{
	var result = null;
	var pos = 0;
	if(name == xrxGetElementName( xmldoc ))
	{
		result = new Array();
		result[pos++] = xmldoc;
	}
	var number = xmldoc.childNodes.length;
	for(var i = 0;i < number;++i)
	{
		if(name == xrxGetElementName( xmldoc.childNodes[i] ))
		{
			if(result == null) 
			    result = new Array();
			result[pos++] = xmldoc.childNodes[i];
		} else
		{
			if(xmldoc.childNodes[i].nodeType != 3)
			{
				var children = xrxFindElements( xmldoc.childNodes[i], name );
				if(children != null)
				{
					if(result == null) 
					    result = new Array();
					for(var x = 0;x < children.length;++x) 
					    result[pos++] = children[x];
                }
            }
        }
    }
    return result;
}

/***************************************************************************
* This function searches the given DOM structure for first node
* with the given name.
*
* @param xmldoc		XML document
* @param name		name of node to search for
* @return	array[0] of node with given name or null
***************************************************************************/
function xrxFindFirstElement( xmldoc, name ) 
{
    var result = null;
    var pos = 0;
    if (name == xrxGetElementName(xmldoc)) 
    {
        result = new Array();
        result[pos++] = xmldoc;
    }
    if (result == null) 
    {
        var number = xmldoc.childNodes.length;
        for (var i = 0; i < number; ++i) 
        {
            if (name == xrxGetElementName(xmldoc.childNodes[i])) 
            {
                if (result == null) 
                {
                    result = new Array();
                    result[pos++] = xmldoc.childNodes[i];
                    break;
                }
            } else 
            {
                if (xmldoc.childNodes[i].nodeType != 3) 
                {
                    var children = xrxFindFirstElement(xmldoc.childNodes[i], name);
                    if (children != null) 
                    {
                        if (result == null) 
                        {
                            result = new Array();
                            result[pos++] = children[0];
                        }
                    }
				}
			} 	
		}
	}
	return result;
}

/**
* This function searches the given DOM structure for the node 
* with the given name. This is done by searching given structure 
* for nodes with the given name and returning the first one. This 
* assumes the section of DOM structure given will only have one 
* node by that name.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	first node found with given name or null
*/
function xrxGetTheElement( root, name )
{
	var list = xrxFindElements( root, name );
    return (((list != null) && (list.length > 0)) ? list[0] : null);
}

/***************************************************************************
* This function searches the given DOM structure for the first node 
* with the given name. This is done by searching given structure 
* and returning the first one. 
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	first node found with given name or null
***************************************************************************/
function xrxGetTheFirstElement( root, name ) 
{
    var list = xrxFindFirstElement(root, name);
	return (((list != null) && (list.length > 0))?list[0]:null);
}

/**
* This function searches the given DOM structure for the node 
* with the given name. This is done by searching given structure 
* for nodes with the given name and returning the first one. This 
* assumes the section of DOM structure given will only have one 
* node by that name.
*
* @param    root		    DOM structure
* @param    elements		array forming path names of node to search for
* @return	first node found with given name or null
*/
function xrxFindElement( root, elements )
{
	var list;
	var node = root;
	for(var i = 0;((node != null) && (i < elements.length));++i)
	{
		list = xrxFindElements( node, elements[i] );
        node = ((list != null) ? list[0] : null);
	}
	return node;
}

/**
* This function searches the given DOM structure for the node 
* with the given name and returns its value.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	value of first node found with given name or empty 
*			string or null if node not found
*/
function xrxGetElementValue( root, name )
{
	return xrxGetValue( xrxGetTheElement( root, name ) );
}

/***************************************************************************
* This function searches the given DOM structure for the first node 
* with the given name and returns its value.
*
* @param root		DOM structure
* @param name		name of node to search for
* @return	value of first node found with given name or empty 
*			string or null if node not found
***************************************************************************/
function xrxGetFirstElementValue( root, name ) 
{
    return xrxGetValue(xrxGetTheFirstElement( root, name ));
}

/**
* This function gets the value of the given element from a text string child
* if one exists.
*
* @param	el		given element
* @return	string	value of text string child or "" if tag there but empty 
*					or null if tag is not there
*/
function xrxGetValue( el )
{
	if(el != null)
		if(el.hasChildNodes())
		{
			var node = el.firstChild;
			while(node != null)
				if(node.nodeType == 3)
					return node.nodeValue;
				else
					node = node.nextSibling;
			return "";
		} else
		{
			return "";
		}
	else
		return null;
}

/**
* This function builds a node in a Xml Structure recursively using the 
* arguments given.
*
* @param	xmlDoc	xml document being built
* @param	params	array structure defining structure (see buildRequest()
*/
function xrxCreateNode( xmlDoc, params )
{
	return xrxCreateNodeNS( xmlDoc, xrxns, params );
}

/**
* This function builds a node in a Xml Structure recursively using the 
* arguments given.
*
* @param	xmlDoc	xml document being built
* @params	ns	namespace
* @param	params	array structure defining structure (see buildRequest()
*/
function xrxCreateNodeNS( xmlDoc, ns, params )
{
	var names = params[0].split( ":" );
	var node = xmlDoc.createElementNS( ns, names[names.length - 1] );
	if(names.length == 2) 
	    node.prefix = names[0];
	if(params.length > 1)
	{
		var child;
		for(var i = 1;i < params.length;++i)
		{
			if(typeof( params[i] ) != "string")
			{
				child = xrxCreateNodeNS( xmlDoc, ns, params[i] );
			} else
			{
				if(params[i] == "attribute")
				{
					node.setAttribute( params[i+1], params[i+2] );
					i += 2;
				} else
				{
					child = xmlDoc.createTextNode( params[i] );
				}
			}
			node.appendChild( child );
		}
	}
	return node;
}
 
 /**
 * This function builds a node using the current namespace value.
 *
 * @param xmlDoc	xml document being built
 * @param name		name of node to create
 * @return	created node
 */
 function xrxCreateSingleNode( xmlDoc, name )
 {
	return xmlDoc.createElementNS( xrxns, name );
 }
 
 /**
 * This function finds all elements of a given class.
 *
 * @param className	name of desired class
 * @return	array of nodes with given class
 */
function xrxGetElementsByClassName( className )
{
    var found = new Array();
    var tags = document.getElementsByTagName( "*" );
    var names;
    for(var i = 0;i < tags.length;i++)
    {
        names = tags[i].className.split(" ");
        for(var x = 0;x < names.length;x++)
            if(names[x] == className) 
                found.push( tags[i] );
    }
    return found;
}

/***************************  Support Functions  ****************************/

/**
* This function extends the String class to include a function to 
* trim whitespace from both ends.
*/
function xrxWSTrim( str )
{
    return xrxWSLtrim( xrxWSRtrim( str ) );
}

/**
* This function extends the String class to include a function to 
* trim whitespace from the left end.
*/
function xrxWSLtrim( str )
{
	var i;
	for(i = 0;i < str.length;++i) 
	    if(str.charAt(i) != ' ') 
	        break;
	if(i > 0) 
	    return str.substring( i, str.length );
    return str;
}

/**
* This function extends the String class to include a function to 
* trim whitespace from the right end.
*/
function xrxWSRtrim( str )
{
    var i;
	for(i = (str.length - 1);i >= 0;--i) 
	    if(str.charAt(i) != ' ') 
	        break;
	if(i < (str.length - 1)) 
	    return str.substring( 0, i );
    return str;
}

/*
* Function to replace characters in a string. Replacement is global. Necessary as current 
* browser has problems with String.replace().
*
* @param text	string to modify
* @param str	string to search for
* @param rstr	replacement string
* @return modified string
*/
function xrxReplaceChars( text, str, rstr )
{
	var result = new Array();
    try
    {
	    var index = text.indexOf( str );
	    var l = str.length;
	    var start = 0;
	    var cell = 0;
	    while(index >= 0)
	    {
		    result[cell++] = text.substring( start, index );
		    result[cell++] = rstr;
		    start = index + l;
		    index = text.indexOf( str, start );
	    }
	}
	catch( e )
	{
	    //alert(e);
	}
    result[cell] = text.substring( start );
	return( result.join( "" ) );
}

/*
* Function to unescape the escaped characters in a xml payload.
*
* @param text	string to modify
*/
function xrxUnescape( text )
{
	//text = unescape( text );
	text = xrxReplaceChars( text, "&lt;", "<" );
	text = xrxReplaceChars( text, "&gt;", ">" );
	//text = xrxReplaceChars( text, "&#xA;", "\\n" );
	text = xrxReplaceChars( text, "&quot;", "\"" );
	text = xrxReplaceChars( text, "&amp;", "&" );
	return text;
}


/**************************  End of File  *******************************************/
