import cv2
import numpy as np
import tensorflow as tf
from scipy import stats
import os


# Load the pre-trained CNN model & video
model = tf.keras.models.load_model('../model_windows/best_clothes.h5')
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

#cap = cv2.VideoCapture(video_path)

# Check if the video file opened successfully
if not cap.isOpened():
    print("Error: Couldn't open the video file.")
    exit()

# List to store the predicted class of each frame
predicted_classes = []

while True:
    ret, frame = cap.read()
    
    # If the video is over, break out of the loop
    if not ret:
        break
    
    # Flip the frame vertically
    flipped_frame = cv2.flip(frame, 0)

    # Resize and preprocess the flipped frame as required by your CNN model
    resized_frame = cv2.resize(flipped_frame, (224, 224))
    normalized_frame = resized_frame / 255.0  # normalization
    normalized_frame = np.expand_dims(normalized_frame, axis=0)  # Expand dims to match the model's input shape
    
    # Get the predicted class for the current frame
    frame_prediction = model.predict(normalized_frame)
    predicted_class = np.argmax(frame_prediction, axis=1)[0]  # Assuming model.predict returns class probabilities
    predicted_classes.append(predicted_class)

# Release the video capture object
cap.release()

# Calculate the most common class across all frames
print(predicted_classes)
print(stats.mode(predicted_classes))
#most_common_class_index = stats.mode(predicted_classes)[0][0]
most_common_class_index = stats.mode(predicted_classes)[0]

# dictionary of labels -> 파일 별로 다르게 해야될듯
label_map = {0: '가방_들다',
            1: '내복_내의_속옷',
            2: '바지',
            3: '복장_입다',
            4: '소매',
            5: '신_신발',
            6: '옷_의복_의상',
            7: '외투_겉옷',
            8: '지갑',
            9: '티셔츠_티'}

class_name = label_map[most_common_class_index]
print(class_name.replace('_', ', '))

