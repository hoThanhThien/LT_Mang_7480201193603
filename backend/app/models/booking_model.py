from sqlalchemy import Column, Integer, Date, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class BookingStatus(enum.Enum):
    Pending = 'Pending'
    Confirmed = 'Confirmed'
    Cancelled = 'Cancelled'

class Booking(Base):
    __tablename__ = 'booking'
    BookingID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey('user.UserID'))
    TourID = Column(Integer, ForeignKey('tour.TourID'))
    BookingDate = Column(Date)
    NumberOfPeople = Column(Integer)
    TotalAmount = Column(Numeric(10,2))
    Status = Column(Enum(BookingStatus), default=BookingStatus.Pending)
    DiscountID = Column(Integer, ForeignKey('discount.DiscountID'))
