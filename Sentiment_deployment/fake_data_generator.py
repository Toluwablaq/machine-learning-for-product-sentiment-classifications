from datetime import datetime
import json
import random

import database
import model

def generate_fake_product():
    product_name = "Product " + str(random.randint(10, 100))
    image_url = 'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
    return {'name': product_name, 'image': image_url}

def generate_fake_comment(product_id):
    comment_body = "Comment " + str(random.randint(10, 100))
    return {'body': comment_body, 'product_id': product_id}

def generate_fake_product_data(num_products):
    products = [generate_fake_product() for _ in range(num_products)]
    return products

def generate_fake_comment_data(product_id, num_comments):
    comments = [generate_fake_comment(product_id) for _ in range(num_comments)]
    return comments

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=2)

def populate_to_product_db(num_products):
    model.populate_products(generate_fake_product_data(num_products))

def populate_to_comment_db(num_of_comments_per_product):
    for i in range(1, 11):
        model.populate_comments(generate_fake_comment_data(i, num_of_comments_per_product))

def populate_products_from_file():
    products = []
    with open('products.tsv') as file:
        for line in file:
            products.append({'body': line, 'product_id': random.randint(1, 5)})
    model.populate_products(products)

def populate_comments_from_file():
    comments = []
    with open('a2_RestaurantReviews_FreshDump.tsv') as file:
        for line in file:
            comments.append({'body': line, 'product_id': random.randint(1, 5)})
    model.populate_comments(comments)

if __name__ == "__main__":
    num_products_to_generate = 5
    num_of_comments_per_product = 5

    database.init_db()

    populate_to_product_db(num_products_to_generate)
    # populate_to_comment_db(num_of_comments_per_product)
    populate_comments_from_file()
