#!/bin/bash

if [ "$(uname)" = "Linux" ] && command -v nvidia-smi &> /dev/null; then
    echo "Linux with GPU detected; Using Docker compose"
    docker compose up --build -d
  elif [ "$(uname)" = "Darwin" ] &> /dev/null; then
    echo "MacOS detected; Please use native Ollama; A model will be pulled"
    ollama pull llama3.2
else
    echo "Linux without GPU or Windows detected, skipping..."
fi

