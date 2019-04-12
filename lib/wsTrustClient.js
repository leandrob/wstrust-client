/*!
 * WsTrust Client
 * @author Leandro Boffi (@leandroboffi)
 */
const template = ({ endpoint, username, password, scope }) => {
		return `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</a:Action><a:To s:mustUnderstand="1">${endpoint}</a:To><o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><o:UsernameToken u:Id="uuid-6a13a244-dac6-42c1-84c5-cbb345b0c4c4-1"><o:Username>${username}</o:Username><o:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${password}</o:Password></o:UsernameToken></o:Security></s:Header><s:Body><trust:RequestSecurityToken xmlns:trust="http://docs.oasis-open.org/ws-sx/ws-trust/200512"><wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"><a:EndpointReference><a:Address>${scope}</a:Address></a:EndpointReference></wsp:AppliesTo><trust:KeyType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer</trust:KeyType><trust:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</trust:RequestType><trust:TokenType>urn:oasis:names:tc:SAML:2.0:assertion</trust:TokenType></trust:RequestSecurityToken></s:Body></s:Envelope>`;
	};

var https = require('https');
var url = require('url');

exports.version = '0.0.1';

exports.requestSecurityToken = function(options, callback, errorCallback) {

	// Defined variable
	var endpoint = options.endpoint;
	var username = options.username;
	var password = options.password;
	var scope = options.scope;

	var message = render(template, { endpoint, username, password, scope});
	var uri = url.parse(options.endpoint);

	var post_options = {
		host: uri.host,
		port: '443',
		path: uri.pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/soap+xml; charset=utf-8',
			'Content-Length': message.length
		}
	};

	var req = https.request(post_options, function(resp) {

		resp.setEncoding('utf8');

		resp.on('data', function(data) {

			var rstr = {
				token: parseRstr(data),
				response: resp,

			};

			callback(rstr);
		});
	});

	req.write(message);
	req.end();

	req.on('error', function (e) { errorCallback(e); });
};

// Parses the RequestSecurityTokenResponse
function parseRstr(rstr){
	var startOfAssertion = rstr.indexOf('<Assertion ');
	var endOfAssertion = rstr.indexOf('</Assertion>') + '</Assertion>'.length;
	var token = rstr.substring(startOfAssertion, endOfAssertion);
	return token;
}

// Render string templates
function render(template, data) {
	return template(data);
}
