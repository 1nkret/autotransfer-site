import json

from src.backend.core.config import ORDERS_FILE


def write_form_to_json(data: dict) -> None:
    """
    Append one order to orders.json file.

    Args:
        data (dict): order object with all fields
    """
    orders = []
    if ORDERS_FILE.exists():
        try:
            with ORDERS_FILE.open("r", encoding="utf-8") as f:
                orders = json.load(f)
        except json.JSONDecodeError:
            orders = []

    orders.append(data)

    with ORDERS_FILE.open("w", encoding="utf-8") as f:
        json.dump(orders, f, ensure_ascii=False, indent=2)
