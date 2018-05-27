/* 
 * XRXWsSecurity.js
 * Copyright (C) Xerox Corporation, 2013.  All rights reserved.
 *
 * This file creates the WS-Security header in a SOAP request for Authentication.
 *
 * @revision    08/15/2013 AHB	    Created.
 * @revision    08/23/2013 AHB	    Added Ws-Addressing.
 * @revision    01/27/2014 TC       Updated the base64 encoding and 
 *                                  sha1 JavaScript library.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SECURITY_HEADER = '<wsa:Action>[Action]</wsa:Action><wsa:MessageID>[MessageId]</wsa:MessageID>'
    + '<wsa:ReplyTo><wsa:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:Address></wsa:ReplyTo><wsa:To>[To]</wsa:To>'
    + '<wsse:Security env:mustUnderstand="1"><wsu:Timestamp wsu:Id="[TimestampId]"><wsu:Created>[Created]</wsu:Created>'
    + '<wsu:Expires>[Expires]</wsu:Expires></wsu:Timestamp><wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"'
    + ' wsu:Id="[SecurityId]"><wsse:Username>[Username]</wsse:Username><wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">'
    + '[PasswordDigest]</wsse:Password><wsse:Nonce>[Nonce]</wsse:Nonce><wsu:Created>[Created2]</wsu:Created></wsse:UsernameToken></wsse:Security>';


/****************************  FUNCTIONS  *******************************/

/**
* This function Authorization fields to a soap request made by the Xerox Javascipt library.
*   
* @param	envelope            current soap request
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml request
*/
function addWsSecurity( envelope, admin, adminPassword, action, to )
{
    return envelope.replace( '</env:Header>', getSecurityHeader( admin, adminPassword, action, to ) + '</env:Header>' );
}

/**
* This function builds the Ws-Security header.
*   
* @param	envelope            current soap request
* @param	admin				admin username (blank will not be included)
* @param	adminPassword		admin password (blank will not be included)
* @return	string	    xml security header
*/
function getSecurityHeader( admin, adminPassword, action, to )
{
    var result = XRX_SECURITY_HEADER;
    
    //Get current time
    var myDate = new Date();
    // localize to Zulu time
    myDate.setHours( myDate.getHours() + 4 );
    var expDate = new Date( myDate );
    expDate.setHours( expDate.getHours() + 1 );
    var created = formatDate( myDate );
    var expires = formatDate( expDate );
    var mid = "urn:uuid:89d1c807-be18-422e-8ff7-" + myDate.getFullYear() + myDate.getMonth() 
        + myDate.getDay() + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds() + myDate.getMilliseconds();
    result = result.replace( "[MessageId]", 'urn:uuid:f7f5154b-976a-4ace-a187-390202166a70' );
    result = result.replace( "[TimestampId]", 'Timestamp-26637172-1c4c-4fcc-90b7-1431d919e337' );
    result = result.replace( "[SecurityId]", 'SecurityToken-db71b28d-6f96-42f8-b029-0cf1bbcdfc4d' );
    result = result.replace( "[Created]", created );
    result = result.replace( "[Created2]", created );
    result = result.replace( "[Expires]", expires );
    result = result.replace( "[Username]", admin );
    result = result.replace( "[Action]", action );
    result = result.replace( "[To]", to );
	
    //Generate nonce
    var nonce = generateNonce( myDate );
	
	// base 64 encoded nonce
	var nonce64 = B64.encode(nonce);   
    result = result.replace( "[Nonce]", nonce64 );
	
    //Generate digest
    var digest = generatePasswordDigest( nonce, created, adminPassword );
    result = result.replace( "[PasswordDigest]", digest );
    return result;
}

/**
* This function builds the Password Digest.
*   
* @param	nonce               nonce
* @param	created             time in proper format
* @param	password	    	password
* @return	string	    		base 64 encoded sha1 hashed digest
*/
function generatePasswordDigest( nonce, created, password) 
{
    try 
    {
        var pass = nonce + created + password;
        return b64_sha1( pass );
    } 
    catch(e) 
    {
        alert('GPD Exception:'+e.message); 
    }
    return "";
}

/**
* This function generates the nonce (number once).
*   
* @param	date        Date object with current time
* @return	string	    nonce
*/
function generateNonce( date ) 
{ 
	try 
	{
		var milliTime = date.getTime();
		var s = (milliTime + "");
		return s;
    } 
    catch(e) 
	{
        alert('GN Exception:'+e.message);         
    }
    return "";
}

/**
* This function formats the date and time into the proper string format: yyyy-MM-ddThh:mm:ssZ
*   
* @param	d1          current Date object
* @return	string	    properly formated date string
*/
function formatDate( d1 )
{
    var curr_year = d1.getFullYear();

    var curr_month = d1.getMonth() + 1; //Months are zero based
    if(curr_month < 10)
        curr_month = "0" + curr_month;

    var curr_date = d1.getDate();
    if(curr_date < 10)
        curr_date = "0" + curr_date;

    var curr_hour = d1.getHours();
    if(curr_hour < 10)
        curr_hour = "0" + curr_hour;

    var curr_min = d1.getMinutes();
    if(curr_min < 10)
        curr_min = "0" + curr_min;

    var curr_sec = d1.getSeconds();     
    if(curr_sec < 10)
        curr_sec = "0" + curr_sec;

    return curr_year + "-" + curr_month + "-" + curr_date + "T" + curr_hour + ":" + curr_min + ":" + curr_sec + "Z";
}



/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "="; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}
