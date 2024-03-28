#image_processing.py 
#Date   :2024/3/24 
#Author :Yong Yao Wen

import sys
import cv2
import math
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def save_image(image, filename):
    cv2.imwrite(filename, cv2.cvtColor(image, cv2.COLOR_RGBA2BGRA))

def process_image(input_path, output_path):
    # Create the options that will be used for ImageSegmenter
    base_options = python.BaseOptions(model_asset_path='src/models/hair_segmenter.tflite')
    options = vision.ImageSegmenterOptions(base_options=base_options, output_category_mask=True)

    # Create the image segmenter
    with vision.ImageSegmenter.create_from_options(options) as segmenter:
        # Load the input image
        image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
        if image is None:
            print("Error: Input image not found.")
            return
        
        # Convert BGR to RGBA , make sure Alpha layer is in image
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)
        mediapipe_image = mp.Image(image_format=mp.ImageFormat.SRGBA, data=image)

        # Retrieve the masks for the segmented image
        segmentation_result = segmenter.segment(mediapipe_image)
        category_mask = segmentation_result.category_mask

        # Define colors for background and hair
        bg_color = (0, 0, 0, 0) # Transparent
        image_data = mediapipe_image.numpy_view()
        bg_image = np.zeros(image_data.shape, dtype=np.uint8)
        bg_image[:] = bg_color

        condition = np.stack((category_mask.numpy_view(),) * 4, axis=-1) > 0.2
        output_image = np.where(condition, bg_image, image_data)

        # Save the output image
        save_image(output_image, output_path)

# Process the image when executed as a script
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python hair_segmentation.py <input_image_path> <output_image_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    process_image(input_path, output_path)
