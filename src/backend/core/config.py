from pathlib import Path

from src.backend.services.autopark_loader import load_autopark

BASE_DIR = Path(__file__).resolve().parent.parent.parent


AUTOPARK = load_autopark(BASE_DIR / "autopark.json")
ORDERS_FILE = BASE_DIR / "orders.json"
