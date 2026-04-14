import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine

# The local SQLite DB will be created here
DATABASE_URL = "sqlite+aiosqlite:///./content_os.db"
DATABASE_URL_SYNC = "sqlite:///./content_os.db"

# Async engine (used by most routers)
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Sync engine (used by pipeline router which has synchronous query patterns)
sync_engine = create_engine(DATABASE_URL_SYNC, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

Base = declarative_base()

async def init_db():
    # Create tables via async engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Also create via sync engine for pipeline router compatibility
    Base.metadata.create_all(bind=sync_engine)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
