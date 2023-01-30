import os, json

BASE_FOLDER = os.path.dirname(os.path.abspath(__file__))
RESOURCE_DIR = os.path.join(BASE_FOLDER, "resources")

def getUser(user_id):
    try:
        with open(os.path.join(RESOURCE_DIR, "users.json"), encoding="utf-8") as f:
            users = json.loads(f.read())
            for i in users:
                if i['id'] == user_id:
                    return i
    except:
        ...

def getUserByEmail(email):
    try:
        with open(os.path.join(RESOURCE_DIR, "users.json"), encoding="utf-8") as f:
            users = json.loads(f.read())
            for i in users:
                if i['email'] == email:
                    return i
    except:
        ...