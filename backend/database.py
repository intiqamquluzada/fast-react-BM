import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Use environment variable or default to localhost
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
client = AsyncIOMotorClient(MONGODB_URL)
database = client.taskdb
task_collection = database.tasks
user_collection = database.users