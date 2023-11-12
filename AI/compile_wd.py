import tensorflow as tf
import keras.models

# Load the pre-trained CNN model & video
#model = tf.keras.models.load_model('../model/best_clothes.h5')
model = tf.keras.models.load_model('./model/best_social.h5', compile=False)
model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])
model.save('best_social.h5')