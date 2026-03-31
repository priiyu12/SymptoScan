import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'disease_prediction_model.pkl')

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
    
    # Try to print what kind of model it is
    print("Model type:", type(model))
    
    # Try a fake prediction (adjust depending on your model input)
    fake_input = [[0] * 5]  # Assuming your model expects 5 features
    prediction = model.predict(fake_input)
    print("Prediction on fake input:", prediction)

except Exception as e:
    print("❌ Failed to load model:", e)
