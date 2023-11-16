import cv2
import numpy as np
import tensorflow as tf
import keras.models
from sklearn.metrics import accuracy_score
import os
import sys
from scipy import stats
from os.path import dirname, realpath

filepath = realpath(__file__)

dir_of_file = dirname(filepath)
parent_dir_of_file = dirname(dir_of_file)
parents_parent_dir_of_file = dirname(parent_dir_of_file)
#print(parents_parent_dir_of_file)
game_id, word_id = sys.argv[1], sys.argv[2]
#game_id = '2'
#word_id = '796'
#print('game_id from python file: ', game_id)
#print('word_id from same: ', word_id)

# Load the pre-trained CNN model & video
model = tf.keras.models.load_model(parent_dir_of_file+ '/model_windows/best_house.h5')
#model = tf.keras.models.load_model('../model_windows/best_clothes.h5', compile=False)
#model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])
#path = "C:\Dev\Handy-AI\AI\\videos"
path = parents_parent_dir_of_file + '/game_videos/'+ game_id +'/'
#print(os.path.isdir(path))
#video_path = os.path.join(path, "가방_들다_test.mp4")
video_path = os.path.join(path, word_id + '.mp4')
#print(video_path)
#print('Does the video exist: ', os.path.isfile(video_path))
#print(video_path)
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

# Dictionary of labels
label_map = {
    0: '가방_들다',
    1: '내복_내의_속옷',
    2: '바지',
    3: '복장_입다',
    4: '소매',
    5: '신_신발',
    6: '옷_의복_의상',
    7: '외투_겉옷',
    8: '지갑',
    9: '티셔츠_티'
}
id_map = {
    806: 0,
    796: 1,
    804: 2, 
    780: 3,
    773: 4,
    777: 5, 
    772: 6, 
    794: 7,
    781: 8,
    808: 9
}


class_name = label_map[predicted_class]
#print(id_map[int(word_id)])
#print(predicted_class)
intended = id_map[int(word_id)]
if intended == predicted_class: 
    print(True)
else: 
    print(False)

class_name = label_map[most_common_class_index]
#print(class_name)


# # list to store frames of video
# frames = []
# while True:
#     ret, frame = cap.read()
    
#     # If the video is over, break out of the loop
#     if not ret:
#         break
    
#     # 좌우반전
#     flipped_frame = cv2.flip(frame, 0)

#     # Resize and preprocess the flipped frame as required by your CNN model
#     resized_frame = cv2.resize(flipped_frame, (224, 224))
#     normalized_frame = resized_frame / 255.0 # normalization
    
#     frames.append(normalized_frame)

# # Release the video capture object
# cap.release()

# frames_array = np.array(frames)

# # Evaluate the frames using the CNN model
# predictions = model.predict(frames_array)
# average_predictions = np.mean(predictions, axis = 0)

# # Get the index of the class with the highest average score
# predicted_class = np.argmax(predictions, axis=1)

# # dictionary of labels -> 파일 별로 다르게 해야될듯
# label_map = {0: '계단_층계',
#             1: '냉장고',
#             2: '방',
#             3: '열쇠_키',
#             4: '치약',
#             5: '침대',
#             6: '칫솔',
#             7: '컴퓨터',
#             8: '텔레비전_티브이',
#             9: '화장실_변소'}

# id_map = {
#     806: 0,
#     796: 1,
#     804: 2, 
#     780: 3,
#     773: 4,
#     777: 5, 
#     772: 6, 
#     794: 7,
#     781: 8,
#     808: 9
# }



# class_name = label_map[predicted_class]
# print(id_map[int(word_id)])
# print(predicted_class)
# #print(class_name.replace('_', ', '))