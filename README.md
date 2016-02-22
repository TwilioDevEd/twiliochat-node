# twiliochat-node

Node.js | Express  implementation of Twilio Chat

[![Build
Status](https://travis-ci.org/TwilioDevEd/twiliochat-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/twiliochat-node)

### Run the application

1. First clone this repository and `cd` into its directory:
   ```bash
   $ git clone git@github.com:TwilioDevEd/browser-calls-node.git

   $ cd browser-calls-node
   ```

1. Install project's dependencies:

    ```bash
    $ npm install
    ```
1. Edit the following environments vars in the `.env` file. Be sure to replace the place holders with real information

   ```
   export TWILIO_ACCOUNT_SID=Your-Account-SID
   export TWILIO_API_KEY=Your-Twilio-API-KEY
   export TWILIO_API_SECRET=Your-Twilio-API-SECRET
   export TWILIO_IPM_SERVICE_SID=Your-Twilio-IPM-SERVICE-SID

   ```

  You can find your `TWILIO_ACCOUNT_SID` in your
  [Twilio Account Settings](https://www.twilio.com/user/account/settings).
  For `TWILIO_API_KEY` and `TWILIO_API_SECRET` you need to go
  [here](https://www.twilio.com/user/account/ip-messaging/dev-tools/api-keys). There
  youl'll be able to create a new API key obtaining the two required values.
  For `TWILIO_IPM_SERVICE_SID` you can go [here](https://www.twilio.com/user/account/ip-messaging/services),
  where you must create an IP Messaging Service. When the service is created you'll
  have access to the service's SID.


1. Start the development server

    ```bash
    $ npm start
    ```

1. Expose the application to the wider Internet using [ngrok](https://ngrok.com/)

    ```bash
    $ ngrok http 3000 -host-header="localhost:3000"
    ```

That's it

## Run the tests

1. Run backend tests

    ```bash
    $ mocha test
    ```

1. Run javascript tests:
   ```bash
   $ cd public && npm install && npm test
   ```

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
