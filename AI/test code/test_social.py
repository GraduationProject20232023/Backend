import cv2
import numpy as np
import tensorflow as tf
import keras.models
from sklearn.metrics import accuracy_score
import os
import argparse
from scipy import stats
import time
import difflib
parser = argparse.ArgumentParser()
parser.add_argument("-i", "--intended", dest = "intended", type = str, action= "store")
args = parser.parse_args()
print('intended: ', args.intended)
# Load the pre-trained CNN model & video
#model = tf.keras.models.load_model('../model/best_clothes.h5')
#start = time.time()
model = tf.keras.models.load_model('../model_windows/best_social.h5')
#model = tf.keras.models.load_model('../model/best_clothes.h5', compile=False)
#model.compile(optimizer= keras.optimizers.Adam(learning_rate=0.0001), loss= 'categorical_crossentropy', metrics=['accuracy'])
#print("time1: ", time.time()-start)
# start = time.time()
path = "C:\Dev\Handy-AI\AI\\videos"
video_path = os.path.join(path, "회사원.mp4")
if os.path.isfile(video_path):	# 해당 파일이 있는지 확인
    # 영상 객체(파일) 가져오기
    print('video_path: ', video_path)
    cap = cv2.VideoCapture(video_path)
else:
    print("파일이 존재하지 않습니다.")  




# # Load the pre-trained CNN model & video
# model = tf.keras.models.load_model('best_social.h5')
# video_path = 'path_to_your_video.mp4'
# cap = cv2.VideoCapture(video_path)

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

#print('predicted_classes: ', predicted_classes)
#print('stats.mode(predicted_classes): ', stats.mode(predicted_classes))
#print('stats.mode(predicted_classes): ', stats.mode(predicted_classes)[0])
#print('stats.mode(predicted_classes): ', stats.mode(predicted_classes)[0][0])
#print(most_common_class_index = stats.mode(predicted_classes)[0])
#most_common_class_index = stats.mode(predicted_classes)[0][0]
most_common_class_index = stats.mode(predicted_classes)[0]

# dictionary of labels -> 파일 별로 다르게 해야될듯
label_map = {0: '기업_회사_사',
            1: '뉴스',
            2: '말_말하다_언어',
            3: '방문',
            4: '버스',
            5: '이웃',
            6: '지하철_전철',
            7: '친구_동무_벗_우인',
            8: '한국어_한국말_국어',
            9: '회사원'}

class_name = label_map[most_common_class_index]

print(class_name.replace('_', ', '))
# print("===" + args.intended + "===")
# print(type(class_name))
# print(type(args.intended))
# print(class_name == str(args.intended))
# print(''.join(difflib.ndiff(class_name, class_name)))
# print(''.join(difflib.ndiff(class_name, args.intended)))
# print(''.join(difflib.ndiff(class_name, func1(args.intended))))
# if class_name == args.intended:
#     print('True')
# else:
#     print('False')


# print("time2: ", time.time()-start)