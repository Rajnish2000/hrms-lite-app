import os
import mongoengine as me
from dotenv import load_dotenv

load_dotenv()

def connect_mongo():
    me.connect(host=os.getenv("MONGO_URI"))
