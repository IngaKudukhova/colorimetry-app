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
    
    print(X)

    print(X.columns)

    print(model.feature_names_in_)

    prediction = model.predict(X)[0]

    distances, indices = model.kneighbors(X)

    nearest_distance = distances[0][0]

    print('Distance:', nearest_distance)

    threshold = 0.25

    if nearest_distance > threshold:

        return jsonify({

            'substance': 'Unknown substance',

            'confidence': 0,

            'distance': nearest_distance,

            'modelProfile': None
        })

    if group == 'amino':

        df = pd.read_csv(
            'datasets/amino.csv'
        )

    else:

        df = pd.read_csv(
            'datasets/phenols.csv'
        )

    substance_rows = df[
        df['substance'] == prediction
    ]

    model_profile = {

        'r1': substance_rows['r1'].mean(),

        'g1': substance_rows['g1'].mean(),

        'b1': substance_rows['b1'].mean(),

        'r2': substance_rows['r2'].mean(),

        'g2': substance_rows['g2'].mean(),

        'b2': substance_rows['b2'].mean(),
    }

    probabilities = model.predict_proba(X)[0]

    confidence = max(
        0,
        1 - nearest_distance
    )

    return jsonify({

        'substance': prediction,

        'confidence': confidence,

        'modelProfile': model_profile
    })

    # return jsonify({

    #     'substance': prediction,

    #     'confidence': round(
    #         float(confidence),
    #         2
    #     )
    #     'modelProfile': model_profile
    # })


if __name__ == '__main__':

    app.run(port=5000)

