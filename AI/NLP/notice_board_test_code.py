import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

## disable warnings
import warnings
warnings.filterwarnings("ignore")


# Define the function to clean the text
def clean_text_v2(text):
    # Remove emojis and other non-textual symbols, keep numbers
    text = re.sub(r'[^\w\s]', '', text)
    return text

# Define the function to clean and weight the title and context
def clean_and_weight_text(title, context, title_weight=3, context_weight=7):
    # Clean the title and context
    cleaned_title = clean_text_v2(title)
    cleaned_context = clean_text_v2(context)
    # Combine the title and context with weights
    weighted_text = cleaned_title * title_weight + " " + cleaned_context * context_weight
    return weighted_text

# Load the model and vectorizer
def load_model_and_vectorizer(model_path, vectorizer_path):
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    return model, vectorizer

# Function to make a prediction
def predict_noticeboard_type(model, vectorizer, title, context):
    weighted_text = clean_and_weight_text(title, context)
    text_tfidf = vectorizer.transform([weighted_text])
    predicted_label = model.predict(text_tfidf)
    noticeboard_type = "Information Noticeboard" if predicted_label[0] == 1 else "Free Noticeboard"
    return noticeboard_type



# Example usage
if __name__ == "__main__":
    # Paths to the model and vectorizer files
    #model_path = './best_svm_model.joblib'
    model_path = './AI/NLP/best_svm_model.joblib'
    #vectorizer_path = 'tfidf_vectorizer.joblib'
    vectorizer_path = './AI/NLP/tfidf_vectorizer.joblib'
    # Load the saved model and vectorizer
    svm_model, tfidf_vectorizer = load_model_and_vectorizer(model_path, vectorizer_path)

    ## Open input text
    #with open('input_text2.txt', 'r', encoding='UTF-8') as f:
    with open('./AI/NLP/input_text2.txt', 'r', encoding='UTF-8') as f:
        ## read the title
        title = f.readline().strip()
        #print(f"title: {title}")
        ## read the context
        context = f.read()
        #print(f"context: {context}")

    # Example title and context
    #title = "[조교채용] 서울캠퍼스 공과대학 화학공학전공 조교 모집 (~11.13)"
    # context = """
    # 1. 모집 부서 및 인원 : 서울캠퍼스 공과대학 신소재화공시스템공학부 화학공학전공, 1명
    # 2. 응모자격
    #  가. 4년제 대학 졸업자 및 동등 이상의 학력 소지자
    #  나. 컴퓨터 활용 능력자 우대
    # 3. 근무조건 : 연봉 약2,500만원(본교 보수규정에 따름)
    # - 주5일(하절기(3월~10월) 09:00~17:30/동절기(11월~2월) 09:00~17:00)
    # - 근무기간 1년 단위 계약으로 최대 2년까지 근무
    # 4. 서류접수　
    # - 기간 : 2023년 11월 6일(월) ~ 11월 13일(월)
    # 5. 제출방법
    #  가. 이메일 접수 : [email protected]
    #  나. 우편접수 및 방문접수 : 화학공학전공사무실 (과학관 I동 501호)
    # [(우04066)서울시 마포구 와우산로 94 홍익대학교 과학관(I동) 화학공학전공 사무실 501호]
    # 6. 제출서류
    #  가. 이력서 및 자기소개서 1부(첨부 양식 활용)
    #  나. 개인정보 제공 및 활용 동의서(첨부 양식 활용)
    #  다. 최종학력 성적증명서 및 졸업증명서 각 1부
    #       (석사 이상자의 경우 대학 성적증명서 및 졸업증명서도 첨부)
    #  라. 기타(해당자에 한하여 제출): 경력증명서, 자격증 및 공인외국어성적표 사본
    #  마. 추후 면접 합격자에 한하여 주민등록등본, 추천서, 성범죄경력조회회신서,
    #      주민등록초본(주민등록초본은 남자만 해당, 병적사항 기재)            
    #  바. 채용서류반환청구서(해당자만, 첨부 양식 활용)
    # 7. 기 타
    #  - 면접일시 : 서류 심사 후 합격자에 한해 개별 통보
    # 8. 문 의 : 02-320-1129
    # 9. 채용서류 반환 안내 : 「채용절차의 공정화에 관한 법률」에 의거, 채용탈락 통보를 받은 날로부터 20일 이내에 별첨의 ‘채용서류 반환 청구서’를 채용서류 접수처로 제출하시면 채용서류를 다음과 같이 반환해 드립니다.
    #  가. 반환기간 : 반환 청구일로부터 20일 이내
    #  나. 반환방법 : 채용서류의 우편발송 또는 접수처 방문수령
    #  다. 우편발송 시 반환비용 : 본인부담
    # """

    # Make a prediction
    noticeboard = predict_noticeboard_type(svm_model, tfidf_vectorizer, title, context)
    #print(f"The text belongs to: {noticeboard}")
    print(noticeboard)