import os
import motor.motor_asyncio

MONGODB_URI = os.environ.get("MONGODB_URI", "")

_client = None
_db = None

def get_mongo_db():
    global _client, _db
    if not MONGODB_URI:
        return None
    if _db is None:
        _client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
        _db = _client["fitai"]
    return _db

async def mongo_save_session(session_data: dict):
    db = get_mongo_db()
    if db is None:
        return None
    try:
        result = await db["sessions"].insert_one(session_data)
        return str(result.inserted_id)
    except Exception:
        return None

async def mongo_get_stats(user_id: str = "default"):
    db = get_mongo_db()
    if db is None:
        return None
    try:
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": None,
                "total_sessions": {"$sum": 1},
                "total_calories": {"$sum": "$calories"},
                "total_minutes": {"$sum": {"$divide": ["$duration", 60]}},
                "total_exercises": {"$sum": "$exercises_completed"},
            }},
        ]
        results = await db["sessions"].aggregate(pipeline).to_list(1)
        return results[0] if results else None
    except Exception:
        return None

async def mongo_get_history(user_id: str = "default", limit: int = 20):
    db = get_mongo_db()
    if db is None:
        return []
    try:
        cursor = db["sessions"].find(
            {"user_id": user_id},
            sort=[("date", -1)],
            limit=limit,
        )
        docs = await cursor.to_list(limit)
        for d in docs:
            d["_id"] = str(d["_id"])
        return docs
    except Exception:
        return []
