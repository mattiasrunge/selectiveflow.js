selectiveflow.js
================

Selective Flow is a helper library with which a flow of steps can be defined. Each step has criterias that incomming events will be matched towards, if the event maches a step, a callback with all received events for that step will be called.
Criterias can be added dynamically which can be useful when used from anothers steps callback, thus a dynamic matching can be done to capture events that are dependent on other steps events.

