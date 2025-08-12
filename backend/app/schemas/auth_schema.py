from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: str
    role_id: Optional[int] = 3  # Default to user role

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

class UserResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    full_name: str
    email: str
    phone: str
    role_name: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str
