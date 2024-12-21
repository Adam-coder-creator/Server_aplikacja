from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import logging

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql://user:password@db:5432/mydb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SessionData(Base):
    __tablename__ = "session_data"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    track_name = Column(String, nullable=False)
    laps_amount = Column(Integer, nullable=False)
    best_lap_time = Column(Float, nullable=True)
    cold_pressure_lf = Column(Float, nullable=False)
    cold_pressure_rf = Column(Float, nullable=False)
    cold_pressure_lr = Column(Float, nullable=False)
    cold_pressure_rr = Column(Float, nullable=False)
    hot_pressure_lf = Column(Float, nullable=False)
    hot_pressure_rf = Column(Float, nullable=False)
    hot_pressure_lr = Column(Float, nullable=False)
    hot_pressure_rr = Column(Float, nullable=False)
    setup_description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

class SessionDataCreate(BaseModel):
    track_name: str
    laps_amount: int
    best_lap_time: float | None
    cold_pressure_lf: float
    cold_pressure_rf: float
    cold_pressure_lr: float
    cold_pressure_rr: float
    hot_pressure_lf: float
    hot_pressure_rf: float
    hot_pressure_lr: float
    hot_pressure_rr: float
    setup_description: str | None

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_pdf(data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica", 10)
    y_position = height - 40

    headers_and_values = [
        ("Track name", data.track_name),
        ("Best lap time", str(data.best_lap_time) if data.best_lap_time else "-"),
        ("Laps amount", str(data.laps_amount)),
        ("Cold Pressure LF", str(data.cold_pressure_lf)),
        ("Cold Pressure RF", str(data.cold_pressure_rf)),
        ("Cold Pressure LR", str(data.cold_pressure_lr)),
        ("Cold Pressure RR", str(data.cold_pressure_rr)),
        ("Hot Pressure LF", str(data.hot_pressure_lf)),
        ("Hot Pressure RF", str(data.hot_pressure_rf)),
        ("Hot Pressure LR", str(data.hot_pressure_lr)),
        ("Hot Pressure RR", str(data.hot_pressure_rr)),
        ("Setup Description", data.setup_description or "-"),
        ("Created At", data.created_at.strftime("%Y-%m-%d %H:%M:%S")),
    ]

    for header, value in headers_and_values:
        c.drawString(30, y_position, header)
        c.drawString(200, y_position, value)
        y_position -= 20
        if y_position < 40:
            c.showPage()
            y_position = height - 40

    c.save()
    buffer.seek(0)
    return buffer

@app.post("/data")
async def create_session_data(data: SessionDataCreate, db: Session = Depends(get_db)):
    try:
        session_data = SessionData(**data.dict())
        db.add(session_data)
        db.commit()
        db.refresh(session_data)

        pdf_buffer = generate_pdf(session_data)
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=session_data.pdf"})
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=422, detail="Invalid data")
