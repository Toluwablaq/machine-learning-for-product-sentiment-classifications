from collections import Counter
from model import Product, Comment

from flask import Flask, request, send_file
from flask_cors import CORS
import database
import config
from sqlalchemy import text
import pandas as pd
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
import pickle
import joblib
from io import BytesIO

app = Flask(__name__)
CORS(app)
db = database.db_session

# Auto close db connection after each response regardless of success or error
app.teardown_appcontext(database.on_response_close)

@app.get('/dashboard')
def dashboard():
    products = []
    raw_query = text(f'''
        SELECT p.ROWID as pid, {config.product_column_names}, {config.product_column_image},
            MAX({config.comment_column_creted_date}) as last_comment_date
        FROM {config.product_table_name} p
        JOIN {config.comment_table_name} c ON pid = c.{config.comment_product_id}
        GROUP BY pid
        ORDER BY last_comment_date DESC
    ''')
    result = db.execute(raw_query)

    for data in result:
        products.append({'id': data[0], 'name': data[1], 'image': data[2], 'last_comment_date': data[3]})

    raw_query = text(f'SELECT {config.comment_column_body} FROM {config.comment_table_name}')
    result = db.execute(raw_query)
    dataset = pd.DataFrame(result)
    data_cleaning(dataset)
    predictions = predict_sentiment(dataset)
    top_words = most_frequent_word(dataset, 11)

    res_data = {
        'negative': predictions['Negative'],
        'positive': predictions['Positive'],
        'top_words': [x[0] for x in top_words if x[0] not in ['not']],
        'products': products
    }

    return res_data

@app.post('/submitdb')
def submit_db():
    print('hello')
    if 'database' not in request.files:
        return 'No file part', 400
    
    file = request.files['database']

    if file.filename == '':
        return 'No selected file', 400
    
    file.save('instance/file.db')
    return 'File saved successfully', 200

@app.get('/products')
def list_products():
    res_data = []
    products = db.query(Product)
    for product in products:
        res_data.append(product.to_dict())
    return res_data
    
@app.post('/products')
def create_product():
    product = Product(**request.get_json())
    print(product)
    db.add(product)
    db.commit()
    return ''

@app.get('/comments')
def list_comments():
    res_data = []
    comments = db.query(Comment)
    for comment in comments:
        res_data.append(comment.to_dict())
    return res_data

@app.get('/products/<int:product_id>/sentiment')
def get_product_sentiment(product_id):
    raw_query = text(f'SELECT {config.comment_column_body} FROM {config.comment_table_name} WHERE {config.comment_product_id} = :param')
    result = db.execute(raw_query, params={'param': product_id})
    dataset = pd.DataFrame(result)
    data_cleaning(dataset)
    predictions = predict_sentiment(dataset)
    top_words = most_frequent_word(dataset, 11)

    res_data = {
        'negative': predictions['Negative'],
        'positive': predictions['Positive'],
        'top_words': [x[0] for x in top_words if x[0] not in ['not']]
    }

    return res_data

@app.get('/products/<int:product_id>/sentiment/graph')
def get_product_sentiment_graph(product_id):
    raw_query = text(f'SELECT {config.comment_column_body} FROM {config.comment_table_name} WHERE {config.comment_product_id} = :param')
    result = db.execute(raw_query, params={'param': product_id})
    dataset = pd.DataFrame(result)
    data_cleaning(dataset)
    predictions = predict_sentiment(dataset)
    image_stream = generate_graph(predictions)

    # Send the image as a response
    return send_file(image_stream, mimetype='image/png')

@app.get('/products/<int:product_id>/sentiment/reviews')
def get_product_sentiment_reviews(product_id):
    raw_query = text(f'SELECT {config.comment_column_body} FROM {config.comment_table_name} WHERE {config.comment_product_id} = :param')
    result = db.execute(raw_query, params={'param': product_id})
    dataset = pd.DataFrame(result)
    data_cleaning(dataset)
    top_words = most_frequent_word(dataset, 11)
    
    return [x[0] for x in top_words if x[0] not in ['not']]


def get_stopwords():
    eng_stopwords = stopwords.words('english')
    eng_stopwords.remove('not')
    return eng_stopwords

def data_cleaning(dataset):
  ps = PorterStemmer()
  corpus=[]
  st_words=get_stopwords()
  import re
  for comment in dataset['body']:
    review = re.sub('[^a-zA-Z ]', '', comment)
    review = review.lower()
    review = review.split()
    review = set(review)
    review = [ps.stem(word) for word in review if not word in set(st_words)]
    review = ' '.join(review)
    corpus.append(review)
  dataset['body'] = corpus

def load_BoW():
    cvFile='c1_BoW_Sentiment_Model.pkl'
    cv = pickle.load(open(cvFile, "rb"))
    return cv

def predict_sentiment(dataset):
    cv = load_BoW()
    X_fresh = cv.transform(dataset['body']).toarray()

    classifier = joblib.load('Classifier_Sentiment_Model')
    y_pred = classifier.predict(X_fresh)

    dataset['predicted_label'] = y_pred.tolist()
    predictions=[]
    for label in dataset['predicted_label']:
        if label == 0:
            predictions.append("Negative")
        else:
            predictions.append("Positive")
    return Counter(predictions)

def most_frequent_word(dataset, count):
    words = ' '.join(dataset['body']).split()
    word_count = Counter(words)
    return word_count.most_common(count)

def generate_graph(data):
    labels = data.keys()
    sizes = data.values()

    plt.figure(figsize=(6, 6))
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')  
    plt.title('Distribution of Predicted Sentiments')
    
    # Save the plot as a BytesIO object
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)

    # Clear the plot to release resources
    plt.clf()
    plt.close()

    return image_stream





database.init_db()


if __name__ == "__main__":
    app.run(debug=True)