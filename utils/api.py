import time


def expire_tokens(tokens):
    for key in tokens.keys():
        ttl = tokens[key]['expire'] - time.time()
        if ttl < 0:
            del tokens[key]
    return tokens
