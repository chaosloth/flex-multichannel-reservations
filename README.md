# Reject all pending reservations in Twilio Flex

Twilio Flex Plugins enables the rejection of pending all Task Router reservations if the worker (agent) is moved into a timeout state.  For example if the agent is  handling multichannel interactions across voice, sms, chat, (or others) and they miss a voice reservation, Task Router workspace may be configured to change the worker to a specific state. This plugin adds logic to _also_ reject all pending reservations, potentially from other channels or other workflows.

# Explanation of logic
- Listen for changes to the Worker Activity using the Worker Client
- If the activity is the timeout state, get a list of reservations
- Create a promise for each reservation
- Executed the promises, catch any errors - typically one error (promise) will error as the reservation is already rejected


## Configuration and installation
1. In Task Router => Activities, create an new activity with the availability set to _Unavailable_.  For exanmple an activity named "Timeout"
2. In Task Router => Settings, set the timeout activity to the newly created activity
3. Within the plugin, change the `CUSTOM_TIMEOUT_STATE_NAME` to the name of the newly created activity
4. Deploy the plugin
