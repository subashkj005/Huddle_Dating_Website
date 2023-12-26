from fastapi import BackgroundTasks
from starlette.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
from random import randint
from app.config.settings import get_settings

settings = get_settings()


class EmailSchema(BaseModel):
    email: List[EmailStr]


conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_ADDRESS,
    MAIL_PASSWORD=settings.EMAIL_PASSWORD,
    MAIL_FROM=settings.EMAIL_ADDRESS,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Huddle: Connecting Hearts",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_email_with_otp(email: List[EmailStr], otp: str) -> JSONResponse:

    # Construct email body
    body = f"Your OTP is: {otp}"

    # Create MessageSchema
    message = MessageSchema(
        subject="OTP Verification",
        recipients=email,
        body=body,
        subtype=MessageType.html
    )

    # Send email
    fm = FastMail(conf)

    await fm.send_message(message)

    return JSONResponse(status_code=200, content={"message": "Email with OTP has been sent"})
