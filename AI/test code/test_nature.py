import cv2
import numpy as np
import tensorflow as tf
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
model = tf.keras.models.load_model(parent_dir_of_file+ '/model_windows/best_nature.h5')
#model = tf.keras.models.load_model('../model_windows/best_clothes.h5', compile=False)
#model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])

video_path = parents_parent_dir_of_file + '/game_videos/'+ game_id +'/' + word_id + '.mp4'
#- path = "C:\Dev\Handy-AI\AI\\videos"
#- video_path = os.path.join(path, "가방_들다_test.mp4")
 
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
#most_common_class_index = stats.mode(predicted_classes)[0][0]
most_common_class_index = stats.mode(predicted_classes)[0]
# dictionary of labels -> 파일 별로 다르게 해야될듯
label_map = {0: '강',
            1: '덥다_더위',
            2: '바다_해양',
            3: '별',
            4: '산_메_뫼',
            5: '시원하다_평화_화평',
            6: '온도',
            7: '재해_피해_해',
            8: '추위_냉각_북_한랭_차다_춥다',
            9: '흐리다'}

id_map = {
    1714: 0,
    1705: 1,
    1717: 2, 
    1772: 3,
    1710: 4,
    1690: 5, 
    1691: 6, 
    1731: 7,
    1707: 8,
    1706: 9
}

intended = id_map[int(word_id)]

class_name = label_map[most_common_class_index]

if intended == most_common_class_index: 
    print('true')
else: 
    print('false')
## class_name = label_map[most_common_class_index]
## print(class_name.replace('_', ', '))
