import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# 1. Configuration
# Path Fix: Backend folder se ek step peeche (Root) phir dataset folder
DATASET_PATH = os.path.join('..', 'dataset')
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10  # Initial training ke liye 10 kaafi hain

def train_model():
    # 2. Data Preparation & Augmentation
    # Mumbai ki humidity aur light conditions ko simulate karne ke liye augmentation zaruri hai
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # 20% data testing ke liye
    )

    print("Loading Training data from:", os.path.abspath(DATASET_PATH))
    
    train_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    num_classes = train_generator.num_classes
    print(f"Detected Classes: {num_classes}")

    # 3. Model Architecture (MobileNetV2: Best for Mobile/PWA)
    # 
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False  # Pre-trained weights ko freeze kar diya

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])

    # 4. Compile
    model.compile(
        optimizer='adam', 
        loss='categorical_crossentropy', 
        metrics=['accuracy']
    )

    # 5. Training
    print("Starting training...")
    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS
    )

    # 6. Save Model and Class Labels
    # Save directly to the current directory (backend/model/)
    model.save('crop_disease_model.h5')
    
    # Classes ko save karna zaruri hai taaki backend sahi se result dikha sake
    with open('classes.txt', 'w') as f:
        for cls in train_generator.class_indices.keys():
            f.write(f"{cls}\n")
            
    print("✅ Training complete! model.h5 aur classes.txt taiyar hain.")

if __name__ == "__main__":
    if os.path.exists(DATASET_PATH):
        train_model()
    else:
        print(f"❌ Error: Dataset folder nahi mila! Path check karein: {os.path.abspath(DATASET_PATH)}")