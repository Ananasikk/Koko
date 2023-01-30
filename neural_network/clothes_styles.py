from tensorflow.python.keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Dense, Flatten
from keras.layers import Dropout
from keras.layers.convolutional import Conv2D, MaxPooling2D
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# каталог с данными для обучения
train_dir = 'F:/Diplom/train_style/train'

# каталог с данными для проверки
val_dir = 'F:/Diplom/train_style/val'

# каталог с данными для тестирования
test_dir = 'F:/Diplom/train_style/test'

# Количество эпох
epochs = 25
# Размер мини-выборки
batch_size = 16
# Количество изображений для обучения
nb_train_samples = 4800
# Количество изображений для проверки
nb_validation_samples = 2000
# Количество изображений для тестирования
nb_test_samples = 2000
# размеры изображения
img_width, img_height = 28, 28
# Размерность тензора на основе изображения для входных данных в нейронную сеть
# backend Tensorflow, channels_last
input_shape = (img_width, img_height, 1)
def preparation():
    datagen = ImageDataGenerator(rescale=1. / 255) # нормализация

    # генератор данных для обучения на основе изображений из каталога
    train_gen = datagen.flow_from_directory(train_dir, 
                                              target_size=(img_width,img_height),
                                              color_mode='grayscale',
                                              batch_size=batch_size,
                                              class_mode='categorical')

    # генератор данных для проверки на основе изображений из каталога
    val_gen = datagen.flow_from_directory(val_dir, 
                                            target_size=(img_width,img_height),
                                            color_mode='grayscale',
                                            batch_size=batch_size,
                                            class_mode='categorical')

    # генератор данных для тестирования на основе изображений из каталога
    test_gen = datagen.flow_from_directory(test_dir, 
                                             target_size=(img_width,img_height),
                                             color_mode='grayscale',
                                             batch_size=batch_size,
                                             class_mode='categorical')
    return train_gen, val_gen, test_gen

def train(train_gen, val_gen, test_gen):
    # Д О Б А В Л Е Н И Е   С Л О Е В
    model = Sequential() # последовательная модель
    # Первый слой свертки - размерность выходного пространства: 128, 
    # ядро свёртки: 3х3
    model.add(Conv2D(filters=32, kernel_size = 3, padding = 'same', 
                 activation ='relu', input_shape=(28,28,1)))
    # Первый слой подвыборки, размер уменьшения размерности 2х2
    model.add(MaxPooling2D(pool_size=2))
    model.add(Dropout(0.5) )# слой регуляризации
    # Второй слой свертки - размерность выходного пространства: 64, 
    # ядро свёртки: 3x3
    model.add(Conv2D(filters=64, kernel_size = 3, padding = 'same', 
                 activation ='relu'))
    # Второй слой подвыборки, размер уменьшения размерности 2х2
    model.add(MaxPooling2D(pool_size=2))
    # слой регуляризации
    model.add(Dropout(0.5))
    model.add(Conv2D(filters=128, kernel_size = 3, padding = 'same', 
                 activation ='relu')) # Третий сверточный слой
    model.add(MaxPooling2D(pool_size=2)) # Третий слой подвыборки 2х2
    model.add(Dropout(0.3)) # слой регуляризации
    model.add(Flatten()) #преобразование из двумерного вида в плоский
    model.add(Dense(256, activation = 'relu')) # полносвязный слой
    model.add(Dropout(0.5)) # слой регуляризации
    model.add(Dense(4, activation = 'softmax')) # выходной слой
    
    model.summary() # Сводка модели
    
    # Компиляция сети
    model.compile(optimizer = 'adam', loss = 'categorical_crossentropy',
              metrics = ['accuracy'])

    # Обучение модели
    his = model.fit(train_gen,
                    batch_size = batch_size,
                    epochs = epochs,
                    validation_data = val_gen,
                    validation_batch_size = batch_size)

    model.save('fashion_style_1.h5') #сохраняем модель в файл
    # Оцениваем качество работы сети с помощью генератора
    scores = model.evaluate(test_gen)
    print("Точность работы сети на тестовых данных: %.2f%%" % (scores[1]*100))
    
    return his

def draw_graphs(par1,par2,lbl): # отрисовка графиков
   plt.plot(history.history[par1], label = lbl + 'на обучающем наборе')
   plt.plot(history.history[par2], label = lbl + 'на проверочном наборе')
   plt.xlabel('Эпоха обучения')
   plt.ylabel(lbl)
   plt.legend()
   plt.show()

train_generator, val_generator, test_generator = preparation()
history = train(train_generator, val_generator, test_generator)
draw_graphs('accuracy','val_accuracy','Доля верных ответов')
draw_graphs('loss','val_loss','Потери')

print('\nhistory dict:', history.history)

