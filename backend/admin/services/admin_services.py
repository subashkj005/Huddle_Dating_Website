from flask import jsonify
from config.security import generate_otp, get_admin_login_token, hash_password, is_password_strong_enough, verify_password
from models.models import db as database, Admin
from redis_conf.config import redis_instance
from redis_conf.controller import RedisController
from config.mail import send_email_with_otp
from logger.config import logger

db = database.session
redis = RedisController()


def register_new_admin(data):
    name = data.get('name', None)
    email = data.get('email', None)
    password = data.get('password', None)
    confirm_password = data.get('confirm_password', None)

    if not email or not password or not confirm_password:
        return jsonify({'error': "Invalid details"}), 400

    if password != confirm_password:
        return jsonify({'error': "Passwords doesn't match"}), 400

    if not is_password_strong_enough(password):
        return jsonify({'error': "Password is not strong enough"}), 400

    email_exists = db.query(Admin).filter_by(email=email).first()
    if email_exists:
        return jsonify({'error': "Email already registered"}), 400

    hashed_password = hash_password(password)
    admin_key = f"admin_temp_user:{email}"
    otp = generate_otp()

    print('=============================')
    logger.info(f"Admin OTP: {otp}")
    print('=============================')

    admin_data = {"name": name,
                  "email": email,
                  "password": hashed_password,
                  "otp": otp
                  }

    try:
        if redis_instance.exists(admin_key):
            redis_instance.hset(admin_key, mapping=admin_data)
        else:
            redis_instance.hmset(admin_key, mapping=admin_data)

        redis_instance.expire(admin_key, 240)
    except Exception as e:
        print('=============================')
        logger.error(f"Redis Connection ERROR: {e}")
        print('=============================')
        return jsonify({'error': "Server Issue, services will be available soon..!"})

    res = send_email_with_otp(email, str(otp))
    logger.info(res)

    return jsonify({'message': "Email sent Successfully"}), 200


def confirm_otp(data):
    email = data.get('email', None)
    otp = data.get('otp', None)

    admin_key = f"admin_temp_user:{email}"
    data_in_redis = redis.get_hash_data(admin_key)

    if data_in_redis['status'] == 'error':
        return jsonify({'error': "OTP Expired"}), 400

    admin_details = data_in_redis["data"]
    if not admin_details:
        return jsonify({'error': "OTP Expired"}), 400

    if admin_details["email"] != email or admin_details["otp"] != otp:
        return jsonify({'error': "Invalid OTP"}), 400

    admin = Admin(
        name=admin_details['name'],
        email=admin_details['email'],
        password=admin_details['password']
    )

    db.add(admin)
    db.commit()
    
    return jsonify({'message':'Admin created successfullly'})


def authenticate_admin(request):
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)
    
    admin = db.query(Admin).filter_by(email=email).first()
    if not admin:
        return jsonify({'error': "Account not found"}), 404
    
    if not verify_password(password, admin.password):
        return jsonify({'error': "Invalid password"}), 400
    
    return get_admin_login_token(admin, admin.role)
    
    
