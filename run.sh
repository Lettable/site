#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development

# Run the Flask application
python app.py
