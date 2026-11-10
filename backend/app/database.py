
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


def get_database_url() -> str:
    url = settings.DATABASE_URL

    # Support PostgreSQL URLs supplied by hosting providers.
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)

    elif url.startswith("postgresql://"):
        url = url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    return url


DATABASE_URL = get_database_url()

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """
    Provide one database session per API request.
    Always close the session after the request.
    """
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def create_database_tables() -> None:
    """
    Create tables registered with the declarative Base.

    Import model modules before calling this function so
    SQLAlchemy knows about their table definitions.
    """
    Base.metadata.create_all(bind=engine)
  
