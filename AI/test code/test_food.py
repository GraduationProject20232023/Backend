import cv2
import numpy as np
import tensorflow as tf
import keras.models
from sklearn.metrics import accuracy_score
import os

# Load the pre-trained CNN model & video
model = tf.keras.models.load_model('../model_windows/best_food.h5')
#model = tf.keras.models.load_model('../model_windows/best_clothes.h5', compile=False)
#model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])
path = "C:\Dev\Handy-AI\AI\\videos"
video_path = os.path.join(path, "가방_들다_test.mp4")


if os.path.isfile(video_path):	# 해당 파일이 있는지 확인
    # 영상 객체(파일) 가져오기
    print('video_path: ', video_path)
    cap = cv2.VideoCapture(video_path)
else:
    print("파일이 존재하지 않습니다.")  

# Check if the video file opened successfully
if not cap.isOpened():
    print("Error: Couldn't open the video file.")
    exit()

# list to store frames of video
frames = []
while True:
    ret, frame = cap.read()
    
    # If the video is over, break out of the loop
    if not ret:
        break
    
    # 좌우반전
    flipped_frame = cv2.flip(frame, 0)

    # Resize and preprocess the flipped frame as required by your CNN model
    resized_frame = cv2.resize(flipped_frame, (224, 224))
    normalized_frame = resized_frame / 255.0 # normalization
    
    frames.append(normalized_frame)

# Release the video capture object
cap.release()

frames_array = np.array(frames)

# Evaluate the frames using the CNN model
predictions = model.predict(frames_array)
average_predictions = np.mean(predictions, axis = 0)

# Get the index of the class with the highest average score
predicted_class = np.argmax(predictions, axis=1)

# dictionary of labels -> 파일 별로 다르게 해야될듯
label_map = {0: '물',
            1: '소금',
            2: '술_알코올',
            3: '쌀',
            4: '양파',
            5: '오이',
            6: '재료',
            7: '커피',
            8: '콜라',
            9: '토마토'}

class_name = label_map[predicted_class]
print(class_name)