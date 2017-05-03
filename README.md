<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>


# Twilio Chat - Node

[![Build Status](https://travis-ci.org/TwilioDevEd/twiliochat-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/twiliochat-node)

Node.js | Express  implementation of Twilio Chat


## Local Development

1. First clone this repository and `cd` into its directory:
   ```bash
   git clone https://github.com/TwilioDevEd/twiliochat-node.git \
   cd twiliochat-node
   ```

1. Install project's dependencies:

    ```bash
    npm install
    ```
1. Copy the sample configuration file and edit it to match your configuration.

   ```bash
   cp .env.example .env
   ```

  You can find your `TWILIO_ACCOUNT_SID` in your
  [Twilio Account Settings](//www.twilio.com/console).
  For `TWILIO_API_KEY` and `TWILIO_AUTH_TOKEN` you need to go
  [IP Messaging](//www.twilio.com/console/ip-messaging). There
  youl'll be able to create a new API key obtaining the two required values.
  For `TWILIO_IPM_SERVICE_SID` you can go [IP Messaging dashboard](//www.twilio.com/console/ip-messaging/dashboard),
  where you must create an IP Messaging Service. When the service is created you'll
  have access to the service's SID.

1. Start the development server

    ```bash
    npm start
    ```


## Expose your localhost to the internet

If you want your chat application to be reachable publicly in the internet, you can use
a service like [ngrok](//ngrok.com/).

1. Expose the application to the wider Internet

   ```bash
   ngrok http 3000
   ```


## Run the tests

1. Run backend tests

    ```bash
    npm test
    ```

1. Run javascript tests:

   ```bash
   cd public \
   npm install \
   npm test
   ```

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](//www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
