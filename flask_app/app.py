from flask import Flask, render_template, request, jsonify
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), 'tasks.json')

def load_tasks():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(DATA_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(load_tasks())

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Task text is required'}), 400
    tasks = load_tasks()
    task = {
        'id': str(uuid.uuid4()),
        'text': text,
        'completed': False,
        'created_at': datetime.now().strftime('%b %d, %Y')
    }
    tasks.insert(0, task)
    save_tasks(tasks)
    return jsonify(task), 201

@app.route('/toggle/<task_id>', methods=['POST'])
def toggle_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            save_tasks(tasks)
            return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/delete/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [t for t in tasks if t['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
