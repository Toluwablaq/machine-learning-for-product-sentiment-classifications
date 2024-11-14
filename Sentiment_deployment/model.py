import random
from sqlalchemy import Column, Date, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base, db_session

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, autoincrement='auto')
    name = Column(String(50), nullable=False)
    image = Column(String(120), nullable=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'image': self.image}

class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, autoincrement='auto')
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    body = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.current_timestamp())

    def to_dict(self):
        return {'id': self.id, 'product_id': self.product_id, 'body': self.body}

def populate_products(products):
    for item in products:
        product = Product(**item)
        db_session.add(product)
    db_session.commit()

def populate_comments(comments):
    for item in comments:
        comment = Comment(product_id=item['product_id'], body=item['body'])
        db_session.add(comment)
    db_session.commit()





# def pulate_users():
#     from datetime import date
#     user1 = User(name='Bob Alice', email='user1@example.com', phone='08030424356', password_hashed='pbkdf2:sha256:260000$NLH6aGzmd1mIX07e$3f481d32ce597f3fa3c5c30984f065f3bf84069936874e773d72937cbf48574b', account_type='applicant')
#     user2 = User(name='Mr Joel Smith', email='user2@example.com', phone='08079427821', password_hashed='pbkdf2:sha256:260000$NLH6aGzmd1mIX07e$3f481d32ce597f3fa3c5c30984f065f3bf84069936874e773d72937cbf48574b', account_type='employer')
#     db_session.add(user1)
#     db_session.add(user2)
#     db_session.flush()

#     applicant = Applicant(
#         user_id=user1.id,
#         qualification_level = 4,
#         date_of_birth = date.fromisoformat('2017-03-21'),
#         profile_picture='',
#         resume='',
#         skills='coding,eat,play'
#     )

#     employer = Employer(
#         user_id=user2.id, 
#         # sector='Faculty of Computing', 
#         profile_picture=''
#     )

#     db_session.add(applicant)
#     db_session.add(employer)
#     db_session.commit()

# def pulate_qualifications():
#     qualifications = [
#         ("Doctorate",	1),
#         ("Master's Degree",	2),
#         ("Postgraduate Diploma",	3),
#         ("Bachelor's Degree",	4),
#         ("Higher National Diploma",	5),
#         ("National Diploma",	6),
#         ("Undergraduate",	7),
#         ("Secondary Schl Cert.",	8),
#         ("Primary Schl Cert.",	9)
#     ]
#     for q, l in qualifications:
#         db_session.add(
#             Qualification(name=q, level=l)
#         )
#     db_session.commit()

# def pulate_skills():
#     skills = ['communication', 'driving', 'hardwording']
#     for sk in skills:
#         db_session.add(Skill(name=sk))
#     db_session.commit()