from flask_mail import Mail, Message
from config.settings import get_settings
from logger.config import logger

settings = get_settings()

mail = Mail()

def mail_init_app(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_USERNAME'] = settings.EMAIL_ADDRESS
    app.config['MAIL_PASSWORD'] = settings.EMAIL_PASSWORD
    
    mail.init_app(app)   

    
def send_email_with_otp(email, otp):
    
    body = f"Your OTP is: {otp}"
    
    msg = Message(
        subject="OTP Verification",
        sender=settings.EMAIL_ADDRESS,
        recipients=[email],
        body=body  
    )
    
    try:
        mail.send(msg)
        return 'Email sent successfully'
    except Exception as e:
        logger.error(f"Exception at sending email : {e}")
        return 'Email failed to sent'
    
