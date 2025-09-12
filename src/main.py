import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from backend.routers import fleet, applications
from src.backend.core.config import BASE_DIR

app = FastAPI()

app.mount("/static", StaticFiles(directory=BASE_DIR / "front" / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "front" / "templates")

app.include_router(fleet.router, prefix="/api/fleet")
app.include_router(applications.router, prefix="/api/applications")


@app.get("/")
async def index_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app)
