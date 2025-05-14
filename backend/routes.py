from fastapi import APIRouter, HTTPException, Depends
from models import Task, TaskInDB
from database import task_collection
from bson import ObjectId
from auth_helpers import get_current_user
from typing import List


router = APIRouter()

def task_helper(task) -> TaskInDB:
    return TaskInDB(
        id=str(task["_id"]),
        title=task["title"],
        description=task.get("description"),
        completed=task["completed"],
        user_id=task["user_id"]
    )

@router.post("/tasks", response_model=TaskInDB)
async def create_task(task: Task, current_user=Depends(get_current_user)):
    task_dict = task.dict()
    task_dict["user_id"] = str(current_user["_id"])
    result = await task_collection.insert_one(task_dict)
    new_task = await task_collection.find_one({"_id": result.inserted_id})
    return task_helper(new_task)

@router.get("/tasks", response_model=List[TaskInDB])
async def get_tasks(current_user=Depends(get_current_user)):
    tasks = await task_collection.find({"user_id": str(current_user["_id"])}).to_list(100)
    return [task_helper(task) for task in tasks]

@router.get("/tasks/{task_id}", response_model=TaskInDB)
async def get_task_detail(task_id: str, current_user=Depends(get_current_user)):
    task = await task_collection.find_one({"_id": ObjectId(task_id), "user_id": str(current_user["_id"])})
    if task:
        return task_helper(task)
    raise HTTPException(status_code=404, detail="Task not found")

@router.patch("/tasks/{task_id}", response_model=TaskInDB)
async def patch_task(task_id: str, task_update: dict, current_user=Depends(get_current_user)):
    update_data = {k: v for k, v in task_update.items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    updated = await task_collection.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])},
        {"$set": update_data},
        return_document=True
    )
    if updated:
        return task_helper(updated)
    raise HTTPException(status_code=404, detail="Task not found")

@router.put("/tasks/{task_id}", response_model=TaskInDB)
async def update_task(task_id: str, task: Task, current_user=Depends(get_current_user)):
    updated = await task_collection.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])},
        {"$set": task.dict()},
        return_document=True
    )
    if updated:
        return task_helper(updated)
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user=Depends(get_current_user)):
    result = await task_collection.delete_one({"_id": ObjectId(task_id), "user_id": str(current_user["_id"])})
    if result.deleted_count == 1:
        return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
