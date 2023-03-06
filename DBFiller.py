"""
Populates mongo atlas cluster with dummy profiles

"""
import names
import numpy as np
import pymongo
from datetime import date

# Objective: Populate MDB with dummy profile data to help with design testing

MONGO_UNAME = "test"
MONGO_PASS = "sciren-admin"
MONGO_URI = f"mongodb+srv://{MONGO_UNAME}:{MONGO_PASS}@sciren.37fl68g.mongodb.net/?retryWrites=true&w=majority"

USER_CLASSES = ['admin', 'teacher', 'researcher', 'student']

def get_pass(pass_length: int = 18) -> str:
    password = ""
    pass_chars = [np.random.randint(97,122) for _ in range(18)]
    for i, ci in enumerate(pass_chars):
        if i % 3 == 0:
            password += str(ci)
        else:
            password += chr(ci)            
    return password

def get_unique_user_id(collection, user_type: str = "admin"):
    user_count = len(list(collection.find()))
    numid = ""
    for i in range(8-len(str(user_count))):
        numid += "0"
    numid += str(user_count)
    numid = numid[:4]+"-"+numid[4:]
    if(user_type == "admin"):
        uid = "00-"+numid
    elif(user_type == "teacher"):
        uid = "01-"+numid
    elif(user_type == "researcher"):
        uid = "02-"+numid
    elif(user_type == "student"):
        uid = "03-"+numid
    else:
        uid = "04-"+numid
    return uid
    
def get_grades_taught() -> str:
    start = np.random.randint(1,11)
    return str(start)+"-"+str(np.random.randint(start+1,13))

def get_user_dict(collection) -> dict: 
    """ Creates a full user dict. """
    fname = names.get_first_name().lower().strip()
    lname = names.get_last_name().lower().strip()
    user_type = USER_CLASSES[np.random.randint(0,4)]
    return {
        'userid': get_unique_user_id(collection, user_type),
        'email': f"{fname[0]+lname+str(np.random.randint(0,10))}@google.com",        # str
        'password': get_pass(),     # str
        'firstname': fname,    # str
        'lastname' : lname,
        'grades_taught': get_grades_taught(),
        'joindate': date.today(),
        'usertype': user_type,
        'academicinterest': ["Very",]
    }

if __name__ == "__main__":
    print("Populating MongoDB.")
    
    print("Connecting to mongodb")
    mclient = pymongo.MongoClient(MONGO_URI)
    db = mclient.sciren
    col_users = db.users
    print("Connected to MongoDB.")
    
    print("\n\n\n")
    yorn = input("Would you like to delete users? y or n ")
    if("y" in yorn.lower()):
        pass
        # delete all users
    yorn = input("Would you like to add users? y or n ")
    if("y" in yorn.lower()):
        count = int(input("How many Users to add? "))
        for i in range(count):
            col_users.insert_one(get_user_dict(col_users))
            print(f"Completed user {i} of {count}")