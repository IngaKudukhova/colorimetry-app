from flask import Flask, request, jsonify

import joblib

import pandas as pd

app = Flask(__name__)

@app.route('/')

def home():

    return 'ML server is running'
amino_model = joblib.load(
    'models/amino_model.pkl'
)

phenols_model = joblib.load(
    'models/phenols_model.pkl'
)

@app.route('/predict', methods=['POST'])
def predict():

    data = request.json

    group = data['group']

    values = [
        data['r1'],
        data['g1'],
        data['b1'],
        data['r2'],
        data['g2'],
        data['b2']
    ]

    max_value = max(values)

    normalized = [
        v / max_value
        for v in values
    ]

    X = pd.DataFrame(
        [normalized],
        columns=[
            'r1',
            'g1',
            'b1',
            'r2',
            'g2',
            'b2'
        ]
    )

    if group == 'amino':

        model = amino_model

    elif group == 'phenols':

        model = phenols_model

    else:

        return jsonify({
            'message': 'Unknown group'
        }), 400
    
    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    confidence = max(probabilities)

    return jsonify({

        'substance': prediction,

        'confidence': round(
            float(confidence),
            2
        )

    })

if __name__ == '__main__':

    app.run(port=5000)

