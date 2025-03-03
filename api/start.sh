#!/bin/bash

read -sp "Enter your HuggingFace token: " HF_TOKEN
echo ""

if [ "$(uname)" = "Linux" ] && command -v nvidia-smi &> /dev/null; then
    echo "Linux with GPU detected; Using Docker compose"
    HF_TOKEN=$HF_TOKEN docker compose up --build -d

  elif [ "$(uname)" = "Darwin" ] &> /dev/null; then
    echo "MacOS detected; TODO"
  else
    echo "Linux without GPU or Windows detected, skipping..."
fi
