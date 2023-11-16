import cv2
import numpy as np
import tensorflow as tf
import keras.models
from sklearn.metrics import accuracy_score
import os
from scipy import stats
import os
import sys
from os.path import dirname, realpath
import io

## Solve Korean letters encoding issues.
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

## Get the path of parents of parent directory of the file.
filepath = realpath(__file__)
dir_of_file = dirname(filepath)
parent_dir_of_file = dirname(dir_of_file)
parents_parent_dir_of_file = dirname(parent_dir_of_file)

## Get the arguments from ai.js file.
game_id, word_id = sys.argv[1], sys.argv[2]


# Load the pre-trained CNN model & video
model = tf.keras.models.load_model(parent_dir_of_file+ '/model_windows/best_econ.h5')
#model = tf.keras.models.load_model('../model_windows/best_clothes.h5', compile=False)
#model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])

video_path = parents_parent_dir_of_file + '/game_videos/'+ game_id +'/' + word_id + '.mp4'

#path = "C:\Dev\Handy-AI\AI\\videos"
#video_path = os.path.join(path, "가방_들다_test.mp4")
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
most_common_class_index = stats.mode(predicted_classes)[0][0]


# dictionary of labels -> 파일 별로 다르게 해야될듯
label_map = {0: '근로자_고용인_노동자_노무자_사원_일꾼_종업원_직원',
            1: '생활비_생계비',
            2: '소득',
            3: '신용카드',
            4: '영수증_수표',
            5: '월급_급료_봉급_월봉',
            6: '일자리_일터_직장',
            7: '지출',
            8: '지폐_현금_현찰',
            9: '카드'}

## dictionary of word_ids
id_map = {
    1141: 0,
    1182: 1,
    1237: 2, 
    1172: 3, 
    1179: 4,
    1162: 5, 
    1154: 6, 
    1212: 7,
    1187: 8,
    1183: 9
}

intended = id_map[int(word_id)]
class_name = label_map[most_common_class_index]


if intended == most_common_class_index: 
    print('true')
else: 
    print('false')

#class_name = label_map[predicted_class]
#print(class_name.replace('_', ', '))