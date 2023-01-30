import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Dense, Flatten
from keras.layers import Dropout
from keras.layers.convolutional import Conv2D, MaxPooling2D

np.random.seed(1)

# загрузка данных для тестирования и обучения fashion mnist
(x_train, y_train),(x_test, y_test) = tf.keras.datasets.fashion_mnist.load_data()

# набор для проверки (выделяем первые 5000) из тренировочного набора
(x_train, x_valid) = x_train[5000:], x_train[:5000]
(y_train, y_valid) = y_train[5000:], y_train[:5000]

def preparation(x_tr, x_ts, x_v): # ПОДГОТОВКА ДАННЫХ
    # изменение размерности с (28,28) на (28,28,1)
    x_tr = x_tr.reshape(x_tr.shape[0],28,28,1)
    x_v = x_v.reshape(x_v.shape[0],28,28,1)
    x_ts = x_ts.reshape(x_ts.shape[0],28,28,1)

    # нормализация
    x_tr = x_tr.astype('float32')/255
    x_v = x_v.astype('float32')/255
    x_ts = x_ts.astype('float32')/255
    return x_tr, x_ts, x_v
    
def train(x_tr, y_tr, x_v, y_v, x_ts, y_ts):
    # Д О Б А В Л Е Н И Е   С Л О Е В
    model = Sequential() # последовательная модель
    # Первый слой свертки - размерность выходного пространства: 128, 
    # ядро свёртки: 3х3
    model.add(Conv2D(filters=64, kernel_size = 3, padding = 'same', 
                 activation ='relu', input_shape=(28,28,1)))
    # Первый слой подвыборки, размер уменьшения размерности 2х2
    model.add(MaxPooling2D(pool_size=2))
    model.add(Dropout(0.5)) # слой регуляризации

    # Второй слой свертки - размерность выходного пространства: 64, 
    # ядро свёртки: 3x3
    model.add(Conv2D(filters=128, kernel_size = 3, padding = 'same', 
                 activation ='relu'))
    model.add(MaxPooling2D(pool_size=2)) # Второй слой подвыборки
    model.add(Dropout(0.5)) # слой регуляризациии

    # преобразование из двумерного вида в плоский
    model.add(Flatten())
    model.add(Dense(256, activation = 'relu')) # полносвязный слой
    model.add(Dropout(0.5)) # слой регуляризации
    model.add(Dense(10, activation = 'softmax')) # выходной слой

    model.summary() # Сводка модели

    # Компиляция сети
    model.compile(optimizer = 'adam', loss = 'sparse_categorical_crossentropy',
              metrics = ['accuracy'])

    # Обучение сети
    hist = model.fit(x = x_tr, y = y_tr, 
              batch_size = 64, epochs = 25, 
              validation_data = (x_v, y_v))
    #model.save('fashion_1.h5') #сохраняем модель в файл
    score = model.evaluate(x_ts, y_ts)
    # Оценка модели
    print("\nТочность работы на тестовых данных: %.2f%%" % (score[1]*100))
    return hist

def draw_graphs(par1,par2,lbl): # отрисовка графиков
    plt.plot(history.history[par1], label = lbl + 'на обучающем наборе')
    plt.plot(history.history[par2], label = lbl + 'на проверочном наборе')
    plt.xlabel('Эпоха обучения')
    plt.ylabel(lbl)
    plt.xticks(np.arange(0,25,step=5))
    plt.legend()
    plt.show()
    
x_train, x_test, x_valid = preparation(x_train, x_test, x_valid)
print(x_train.shape)
history = train(x_train,y_train,x_valid,y_valid, x_test, y_test)

draw_graphs('accuracy','val_accuracy','Доля верных ответов')
draw_graphs('loss','val_loss','Потери')