#!/usr/bin/env bash
# This file is used by Render to build and run the FastAPI backend

set -eo pipefail

pip install --upgrade pip
pip install -r requirements.txt

# Run migrations or create tables if needed
python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"
