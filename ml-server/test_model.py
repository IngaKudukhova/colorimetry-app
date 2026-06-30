import joblib
try:
    m = joblib.load('/models/amino_model.pkl')
    print('OK:', type(m))
except Exception as e:
    print('ERROR:', e)