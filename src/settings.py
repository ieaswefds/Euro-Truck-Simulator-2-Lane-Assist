'''
Settings interface


ChangeProfile(profileName)
- Profilename is a string with the current .json file name
    
    >>> ChangeProfile("default.json")


UpdateSettings(category, name, data)
- Category is a string with the category name
- Name is a string with the setting name
- Data is the data to be written to the setting
    
    >>> UpdateSettings("General", "ShowFPS", True)


GetSettings(category, name)
- Category is a string with the category name
- Name is a string with the setting name
    
    >>> GetSettings("General", "ShowFPS")
    
CreateSettings(category, name, data)
- Category is a string with the category name
- Name is a string with the setting name
- Data is the data to be written to the setting
! In case the setting already exists, it will be overwritten with UpdateSettings()

    >>> CreateSettings("Controller", "IndicateRight", 3)
'''

import json
from src.logger import print

def EnsureFile(file):
    try:
        with open(file, "r") as f:
            pass
    except:
        with open(file, "w") as f:
            f.write("{}")

def ChangeProfile(profileName):
    try:
        with open(r"profiles\currentProfile.txt", "w") as f:
            f.truncate(0)
            f.write(profileName)
    except Exception as ex:
        print(ex.args)

# Change settings in the json file
def UpdateSettings(category, name, data):
    try:
        profile = open(r"profiles\currentProfile.txt", "r").readline().replace("\n", "")
        EnsureFile(profile)
        with open(profile, "r") as f:
            settings = json.load(f)

        settings[category][name] = data
        with open(profile, "w") as f:
            f.truncate(0)
            json.dump(settings, f, indent=6)
    except Exception as ex:
        print(ex.args)

# Get a specific setting
def GetSettings(category, name):
    try:
        profile = open(r"profiles\currentProfile.txt", "r").readline().replace("\n", "")
        EnsureFile(profile)
        with open(profile, "r") as f:
            settings = json.load(f)
        return settings[category][name]
    except Exception as ex:
        print(ex.args)


# Create a new setting
def CreateSettings(category, name, data):
    try:
        profile = open(r"profiles\currentProfile.txt", "r").readline().replace("\n", "")
        EnsureFile(profile)
        with open(profile, "r") as f:
            settings = json.load(f)

        # If the setting doesn't exist then create it 
        if not category in settings:
            settings[category] = {}
            settings[category][name] = data
        
        # If the setting exists then overwrite it
        if category in settings:
            settings[category][name] = data
            
        with open(profile, "w") as f:
            f.truncate(0)
            json.dump(settings, f, indent=6)
    except Exception as ex:
        print(ex.args)
        
def AddToList(category, name, data):
    try:
        profile = open(r"profiles\currentProfile.txt", "r").readline().replace("\n", "")
        EnsureFile(profile)
        with open(profile, "r") as f:
            settings = json.load(f)

        # If the setting doesn't exist then create it 
        if not category in settings:
            settings[category] = {}
            settings[category][name] = []
            settings[category][name].append(data)
        
        # If the setting exists then overwrite it
        if category in settings:
            settings[category][name].append(data)
            
        with open(profile, "w") as f:
            f.truncate(0)
            json.dump(settings, f, indent=6)
    except Exception as ex:
        print(ex.args)
        

def RemoveFromList(category, name, data):
    try:
        profile = open(r"profiles\currentProfile.txt", "r").readline().replace("\n", "")
        EnsureFile(profile)
        with open(profile, "r") as f:
            settings = json.load(f)

        # If the setting doesn't exist then don't do anything 
        if not category in settings:
            return
        
        # If the setting exists then overwrite it
        if category in settings:
            settings[category][name].remove(data)
            
        with open(profile, "w") as f:
            f.truncate(0)
            json.dump(settings, f, indent=6)
        
    except Exception as ex:
        print(ex.args)