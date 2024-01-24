from enum import Enum


class Role(Enum):
    USER = 'user'

class Gender(Enum):
    MALE = 'Male'
    FEMALE = 'Female'
    OTHERS = 'Others'


class InterestedIn(str, Enum):
    MALE = 'Male'
    FEMALE = 'Female'
    OTHERS = 'Others'
 

class EducationalLevel(str, Enum):
    HIGH_SCHOOL = 'High School'
    TRADE_OR_TECH = 'Trade / Tech'
    IN_COLLEGE = 'Incollege'
    GRADUATE = 'Graduate'
    POSTGRADUATE = 'Postgraduate'
    DIPLOMA = 'Diploma'
    
    