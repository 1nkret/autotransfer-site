import json
from pathlib import Path


def load_autopark(filename: Path):
    with open(filename, encoding="UTF-8") as file:
        data = json.load(file)

    return data

