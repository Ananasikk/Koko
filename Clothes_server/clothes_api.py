# from crypt import methods
from datetime import datetime
from flask import Flask, request, send_file, jsonify, Response, make_response
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import json, os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as Image2
from IPython.display import Image
import numpy as np 
import pandas as pd
from werkzeug.security import generate_password_hash,  check_password_hash
import re, time
from flask_login import LoginManager, login_user
from UserLogin import UserLogin
from accessData import getUserByEmail

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], expose_headers=['Access-Control-Allow-Origin'])

BASE_FOLDER = os.path.dirname(os.path.abspath(__file__))
RESOURCE_DIR = os.path.join(BASE_FOLDER, "resources")

login_manager = LoginManager(app)

# читаем данные типов одежды из json файла
with open(os.path.join(RESOURCE_DIR, "types.json"), encoding="utf-8") as ft:
    types = json.loads(ft.read())

# читаем данные стилей одежды из json файла
with open(os.path.join(RESOURCE_DIR, "styles.json"), encoding="utf-8") as fs:
    styles = json.loads(fs.read())

def clothes_definition(c_type, c_style):
    return {
        "type": types[c_type]['name'],
        "style": styles[c_style]
    }

def recognition (img_path):
    print(
        os.path.join(RESOURCE_DIR, "fashion_1.h5")
    )
    model = load_model(os.path.join(RESOURCE_DIR, "fashion_1.h5"))
    model_style = load_model(os.path.join(RESOURCE_DIR,'fashion_style_1.h5'))

    Image(img_path, width=150, height=150)

    # загружаем изображение из файла 
    img = Image2.load_img(img_path, target_size=(28,28), color_mode='grayscale')

    # предварительная обработка изображения
    x = Image2.img_to_array(img) # преобразуем картинку в массив
    x = np.expand_dims(x, axis=0) # добавляем еще одну размерность, так как модель рассчитана на распознавание сразу большого количества изображений
    x = x.reshape(x.shape[0],28,28,1) # изменение размерности
    x = 255 - x # инвертируем изображение
    x = x / 255 # нормализация

    # Запускаем распознавание
    prediction = model.predict(x)
    prediction = np.argmax(prediction)
    prediction_style = model_style.predict(x)
    prediction_style = np.argmax(prediction_style)

    return prediction, prediction_style

def choiceFromExistClothes(gender, c_style, userTypes):
    RESOURCE_DIR_EXIST_CLOTHES = os.path.join(RESOURCE_DIR, "images")
    list_products = []
    df = pd.read_csv(os.path.join(RESOURCE_DIR,'recClothesData.csv'), index_col=0)
    for i in userTypes:
        query_str = f"gender == '{gender}' and type == {i} and usage == {c_style}"
        img_list = df.query(query_str)
        if len(img_list) == 0:
            continue
        else:
            sample = img_list.sample(1) # выбор рандомной записи в датафрейме
            print(sample['price'][sample.index[0]])
            list_products.append({'path': os.path.join(RESOURCE_DIR_EXIST_CLOTHES, sample['filename'][sample.index[0]]),
                                'link': sample['link'][sample.index[0]], 'price': int(sample['price'][sample.index[0]])})

    return list_products

def append_to_json(filepath, data):
    """
    Запись данных в конец JSON файла.
    NOTE: Предполагается, что файл заканчивается на } 
    :param filepath: путь к файлу
    :param data: добавляемые данные (dict)
    """

    # construct JSON fragment as new file ending
    new_ending = ",\n    {" + json.dumps(data)[1:-1] + "}\n]"

    # edit the file in situ - first open it in read/write mode
    with open(filepath, 'r+', encoding="utf-8") as f:

        f.seek(0, 2)        # move to end of file
        index = f.tell()    # find index of last byte

        # walking back from the end of file, find the index 
        # of the original JSON's closing '}'
        while not f.read().startswith('}'):
            index -= 1
            if index == 0:
                raise ValueError("can't find JSON object in {!r}".format(filepath))
            f.seek(index)

        # starting at the original ending } position, write out
        # the new ending
        f.seek(index+1)
        f.write(new_ending)

def find_lastId_json(filepath):
    """ 
    Поиск последнего id в файле json
    """
    try:
        with open(filepath, encoding="utf-8") as f:
            users = json.loads(f.read())

        num =  len(users)
        if num > 0:    
            last_id = num - 1
        return last_id
    except:
        ...


# загружает экземпляр класса пользователя при каждом запросе от сайта
@login_manager.user_loader
def load_user(user_id):
    print("load_user") # не забыть убрать
    return UserLogin().fromJSON(user_id)
        

# default
@app.route('/')
def hello():
    return "Hey!" + datetime.now().strftime("%d.%m.%Y %H:%M:%S")

# получение изображения и отправка определенного нейросетью типа и стиля
@app.route('/upload', methods=['POST'])
def upload_img():
    print('in the upload_file!')
    f = request.files['file']
    f.save(secure_filename(f.filename))
    print('file uploaded successfully!')
    c_type, c_style = recognition(f.filename)
    print(clothes_definition(c_type, c_style))

    return clothes_definition(c_type, c_style)

# отправка типов одежды пользователю
@app.route('/upload', methods=['GET'])
def get_c_types():
    return types

@app.route('/recomendation', methods=['POST'])
def getCard():
    gender = request.json['gender'] # выбранная пользователем категория (мужчинам, женщинам и т д)
    type = request.json['type'] # тип одежды определенный нейросейтью
    style = request.json['style'] # стиль одежды определенный нейросетью
    userTypes = request.json['userTypes'] # предметы одежды, которые хочет подобрать пользователь
    print('Пол: ' + gender + ' тип: ' + type + ' стиль: ' + style)
    c_style = styles.index(style)
    
    list_products = choiceFromExistClothes(gender, c_style, userTypes)
    print(list_products)
    return list_products
    
@app.route('/login', methods=['POST'])
def login():
    user = getUserByEmail(request.json['email'])
    if user and check_password_hash(user['psw'], request.json['psw']):
        userLogin = UserLogin().create(user)
        login_user(userLogin)

        return 'ok'
    else:
        return 'Неверный логин или пароль'

@app.route('/register', methods=['POST'])
def register():
    try:
        hash = generate_password_hash(request.json['psw'])
        num_id = find_lastId_json(os.path.join(RESOURCE_DIR,'users.json')) + 1
        data = { "id" :  num_id, 
            "UserName": request.json['name'], "email": request.json['email'], 
            "phone" : request.json['phone'], "psw": hash, "time": time.time()
            }
        append_to_json(os.path.join(RESOURCE_DIR,'users.json'), data)
        return({ "status": 200 })
    except:
        return({ "status": 500 })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

