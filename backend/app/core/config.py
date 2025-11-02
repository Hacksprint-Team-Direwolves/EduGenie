import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = os.environ.get("EDUGENIE_DB", "sqlite:///./edugenie.db")
SECRET_KEY = os.environ.get("EDUGENIE_SECRET", "change_this_in_prod")
