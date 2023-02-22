"""
Populates mongo atlas cluster with dummy profiles

"""

import names
import numpy as np
import pymongo




# Objective: Populate MDB with dummy profile data to help with design testing

MONGO_UNAME = "capstone"
MONGO_PASS = "scirenNetAtlasCS495"
MONGO_URI = f"mongodb+srv://{MONGO_UNAME}:{MONGO_PASS}@sciren.37fl68g.mongodb.net/?retryWrites=true&w=majority"

USER_CLASSES = ['admin', 'teacher', 'student', 'researcher']

def get_email(name) -> str:

    name = names.get_first_name().lower().strip()
    return f"{name}@google.com"

def get_pass(pass_length: int = 18) -> str:
    password = ""
    pass_chars = [np.random.randint(97,122) for _ in range(18)]
    for i, ci in enumerate(pass_chars):
        if i % 3 == 0:
            password += str(ci)
        else:
            password += chr(ci)            
    return password

def get_full_name(random_seed) -> str:
    return names.get_full_name()



def get_unique_user_id(client, user_type: str = "admin"):
    """ Gets a unique user ID for the user."""
    
    pass

def get_user_dict() -> dict: 
    """ Creates a full user dict. """
    return {
        'email': "",        # str
        'password': "",     # str
        'firstname': "",    # str
    }


if __name__ == "__main__":
    print("Populating MongoDB.")
    
    print("Connecting to mongodb")
    mclient = pymongo.MongoClient(MONGO_URI)
    db = mclient.sciren
    col_users = db.users
    print("Connected to MongoDB.")
    
    print("\n\n\n")
    
    for i in range(10):        
        print(f"- {i}: {get_pass()}")

    
    
    # new_count = int(input("Add how many users?   "))
    
    # for idx in range(new_count):
    #     col_users.insert_one
    

    # new_count = input("Add how many users?")
