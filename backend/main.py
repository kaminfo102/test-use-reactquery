from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import List
import os
from pydantic import BaseModel

# Database setup
DATABASE_URL = "sqlite:///./categories.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String)
    slug = Column(String, unique=True, index=True)
    test_count = Column(Integer, default=0)
    

Base.metadata.create_all(bind=engine)

# Pydantic models
class CategoryBase(BaseModel):
    title: str
    description: str
    image_url: str
    slug: str
    test_count: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],  # Astro dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/categories/", response_model=List[CategoryResponse])
async def get_categories(skip: int = 0, limit: int = 10):
    db = next(get_db())
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories

@app.post("/api/categories/", response_model=CategoryResponse)
async def create_category(category: CategoryCreate):
    db = next(get_db())
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/api/categories/{slug}", response_model=CategoryResponse)
async def get_category(slug: str):
    db = next(get_db())
    category = db.query(Category).filter(Category.slug == slug).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category