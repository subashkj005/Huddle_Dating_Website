import uuid

from faker import Faker
from pymysql import IntegrityError
from app.models.enums import EducationalLevel, Gender, InterestedIn
from app.models.models import Prompt, User, UserGallery, UserInterestSettings, UserInterests, Work
from app.config.database import db_dependency


fake = Faker()


def create_fake_user(session):
    print('1\n')
    user = User(
        id=str(uuid.uuid4()),
        name=fake.name(),
        email=fake.email(),
        phone_number=fake.numerify(text='##########'),
        password=fake.password(),
        age=fake.random_int(min=18, max=99),
        date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=25),
        height=fake.random_int(min=150, max=200),
        weight=fake.random_int(min=40, max=120),
        location=fake.city(),
        gender=fake.random_element(
            elements=(Gender.MALE, Gender.FEMALE, Gender.OTHERS)),
        profile_picture=fake.image_url(),
        latitude=fake.latitude(),
        longitude=fake.longitude(),
        bio=fake.text(),
        education_level=fake.random_element(elements=(EducationalLevel.HIGH_SCHOOL, EducationalLevel.TRADE_OR_TECH,
                                            EducationalLevel.IN_COLLEGE, EducationalLevel.GRADUATE, EducationalLevel.POSTGRADUATE, EducationalLevel.DIPLOMA)),
        interested_in=fake.random_element(
            elements=(InterestedIn.MALE, InterestedIn.FEMALE, InterestedIn.OTHERS)),
        super_likes=fake.random_int(min=0, max=10),
        followers=fake.random_int(min=0, max=100),
        following=fake.random_int(min=0, max=100),
        is_active=True,
        is_logged=False,
        is_premium_user=fake.boolean(),
        is_verified=fake.boolean(),
        verified_at=fake.date_time_this_decade(),
        created_at=fake.date_time_this_decade(),
        updated_at=fake.date_time_this_decade(),
        role="user"
    )
    print('2\n')
    user.work = Work(
        id=str(uuid.uuid4()),
        title=fake.job(),
        company=fake.company()
    )
    print('3\n')
    user.prompts = [
        Prompt(id=str(uuid.uuid4()), prompt=fake.text()) for _ in range(fake.random_int(min=1, max=5))
    ]
    print('4\n')
    user.interests = [UserInterests(
        id=str(uuid.uuid4()),
        workout=fake.random_element(
            elements=("Active", "Sometimes", "Almost", "Never")),
        drinks=fake.random_element(
            elements=("Frequently", "Socially", "Rarely", "Never")),
        smoking=fake.random_element(
            elements=("Frequently", "Socially", "Rarely", "Never")),
        dating_purpose=fake.random_element(elements=(
            "Relationship", "Something Casual", "Don't know right now", "Marriage")),
        zodiac_sign=fake.random_element(elements=("Aries", "Taurus", "Gemini", "Cancer", "Leo",
                                                  "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"))
    )]
    print('5\n')
    user.gallery = [
        UserGallery(id=str(uuid.uuid4()), image=fake.random_element(elements=("static/temp/F5aYIuyXYAAga0.jpg",
                                                                              "static/temp/F5aYIuzXQAAON9A.jpg",
                                                                              "static/temp/GDNq2BuWIAAmXQP.jpg",
                                                                              "static/temp/jhasdifhjsdfhja.jpg",
                                                                              "static/temp/JHGjhghkgkHG.jpg",
                                                                              "static/temp/UFjJHgugljJGH.jpg"))) for _ in range(3)
    ]
    print('6\n')
    user.settings = UserInterestSettings(
        id=str(uuid.uuid4()),
        max_age=fake.random_int(min=21, max=25),
        min_age=fake.random_int(min=18, max=20),
        distance=fake.random_int(min=1, max=80),
        gender=fake.random_element(
            elements=(Gender.MALE, Gender.FEMALE, Gender.OTHERS))
    )
    print('7\n')
    return user


def store_fake_data(session, num_users=10):
    count = 1
    try:
        users = []
        for _ in range(num_users):
            user = create_fake_user(session)
            users.append(user)
            print(f'Completed {count}\n')
            count += 1
        session.add_all(users)
        session.commit()
        return "Success"
    except IntegrityError as e:
        # Handle unique constraint violations, such as duplicate email addresses
        print(f"IntegrityError: {e}")
        session.rollback()
        return "Integrity Failed"
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
        return "Exception Failed"
    finally:
        session.close()
    
