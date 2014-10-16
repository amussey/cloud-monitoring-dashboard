import time
import json
import requests

def expire_tokens(tokens):
    for key in tokens.keys():
        ttl = tokens[key]['expire'] - time.time()
        if ttl < 0:
            # make a call to invalidate the token

            del tokens[key]
    return tokens


# Clean the response from monitoring and remove unnecessary information.
def clean_monitoring_response(response):
    response = response["values"]

    for server in response:
        for alarm in server['alarms']:
            del alarm['check_id']
            del alarm['criteria']

        for alarm in server['latest_alarm_states']:
            alarm['alarm'] = server['alarms'][next(index for (index, d) in enumerate(server['alarms']) if d['id'] == alarm['alarm_id'])]
            alarm['check'] = server['checks'][next(index for (index, d) in enumerate(server['checks']) if d['id'] == alarm['check_id'])]
            del alarm['alarm_id']
            del alarm['check_id']
            del alarm['entity_id']

        del server['alarms']
        del server['checks']
        server['alarms'] = server['latest_alarm_states']
        del server['latest_alarm_states']

    return response
