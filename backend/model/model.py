import tensorflow as tf

model = tf.keras.models.load_model('model.h5')

def load_model():
    return model