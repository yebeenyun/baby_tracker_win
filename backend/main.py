import webview
from api import Api
import os

from constants import APP_NAME, DB_PATH, DESKTOP_HEIGHT, URL, DESKTOP_WIDTH

def start():
    api = Api(db_path=DB_PATH)
    window = webview.create_window(
        title=APP_NAME,
        url=URL,
        js_api=api,
        width=DESKTOP_WIDTH,
        height=DESKTOP_HEIGHT
    )
    webview.start(debug=True)

if __name__ == "__main__":
    start()