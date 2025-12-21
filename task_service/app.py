from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import jwt
import os
from functools import wraps

app = Flask(__name__)
CORS(app)

# Database Configuration
db_user = os.environ.get('DB_USER', 'root')
db_password = os.environ.get('DB_PASSWORD', 'rootpassword')
db_host = os.environ.get('DB_HOST', 'db')
db_name = os.environ.get('DB_NAME', 'task_db')

# MySQL 8.0 compatibility: add charset and connection parameters
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}?charset=utf8mb4'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'supersecretkey' # Must match Auth Service

db = SQLAlchemy(app)

# Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='To-Do') # To-Do, In-Progress, Done
    user_id = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "status": self.status,
            "user_id": self.user_id
        }

# Auth Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user_id):
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@app.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user_id):
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'message': 'Title is required'}), 400
    
    new_task = Task(title=data['title'], user_id=current_user_id, status=data.get('status', 'To-Do'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@app.route('/tasks/<int:id>', methods=['PUT'])
@token_required
def update_task(current_user_id, id):
    data = request.get_json()
    task = Task.query.filter_by(id=id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    if 'title' in data:
        task.title = data['title']
    if 'status' in data:
        task.status = data['status']
        
    db.session.commit()
    return jsonify(task.to_dict()), 200

@app.route('/tasks/<int:id>', methods=['DELETE'])
@token_required
def delete_task(current_user_id, id):
    task = Task.query.filter_by(id=id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
        
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200

def init_db():
    import time
    max_retries = 10
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            with app.app_context():
                db.create_all()
                print("Database tables created successfully!")
                return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1}/{max_retries}: Database connection failed, retrying in {retry_delay}s...")
                print(f"Error: {e}")
                time.sleep(retry_delay)
            else:
                print(f"Failed to connect to database after {max_retries} attempts: {e}")
                raise

if __name__ == '__main__':
    # Wait for DB to be ready with retry logic
    try:
        init_db()
    except Exception as e:
        print(f"Error creating DB tables: {e}")
        print("Service will continue to run but database operations may fail.")
    app.run(host='0.0.0.0', port=5001)
