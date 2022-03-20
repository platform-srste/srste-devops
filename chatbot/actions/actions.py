from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
import requests
import json
import os

class ActionCustom(Action):

     def name(self) -> Text:
         return "action_custom"

     async def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         

         payload = {'text':'hi how are you?', 'appId': 'appId2', 'intent': tracker.get_intent_of_latest_message(), 'slots': tracker.slots }
         headers = {'content-type': 'application/json'}
         srsteEndpoint = os.environ["CHATBOT_SERVER_URL"];
         r = requests.post(srsteEndpoint + '/base/api/va_custom_action', json=payload, headers=headers)
         result = r.json()
         
         dispatcher.utter_message(text= r.text)

         return [SlotSet(result["outputName"], result["outputValue"])]
