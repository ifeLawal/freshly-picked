import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool
from sqlmodel import SQLModel

from app.config import settings

# Import all models so their tables are registered with SQLModel.metadata
# before Alembic inspects it for autogenerate support
import app.models  # noqa: F401

# This is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# SQLModel.metadata holds all table definitions registered via SQLModel models.
# Used by Alembic's autogenerate to diff against the live database schema.
target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine, though an
    Engine is acceptable here as well. By skipping the Engine creation we don't
    even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the script output.
    """
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_migrations(connection) -> None:
    """Configure the Alembic context with a live connection and run migrations.

    Called inside an async context via connection.run_sync so that SQLAlchemy's
    async engine can hand off a synchronous connection to Alembic.
    """
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    Creates an async engine using the app's settings (loaded from .env) and
    runs migrations by passing a sync-compatible connection to Alembic via
    run_sync. NullPool is used to avoid connection pooling during migrations.
    """
    connectable = create_async_engine(settings.database_url, poolclass=NullPool)

    async with connectable.connect() as connection:
        await connection.run_sync(do_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
