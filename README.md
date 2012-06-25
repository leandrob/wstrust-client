
# WS-Trust Client 0.1

> Simple WS-Trust Client for Node.js

### Installation

```bash
$ npm install wstrust-client
```

### Example Code

```javascript

var trustClient = require('wstrust-client');

trustClient.requestSecurityToken({
    scope: 'https://yourapp.com',
    username: 'Your Username Here',
    password: 'Your Password Here',
    endpoint: 'https://your-ws-trust-endpoint-address-here'
}, function (rstr) {

	// Access the token and enjoy it!
	var rawToken = rstr.token;

	console.log(rawToken);

}, function (error) {
	
	// Error Callback
	console.log(error)

}

```

### License (MIT)

Copyright (c) 2012, Leandro Boffi.

**

### Author: [Leandro Boffi][0]

[0]: http://github.com/leandrob/
