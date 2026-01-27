import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None


def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)


def get_location_names():
    return __locations


def load_save_artifacts():
    print("loading saved artifacts....start")

    global __data_columns
    global __locations
    global __model

    # path of server directory (where util.py exists)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = base_dir  # Files are in the root directory

    # build correct paths
    columns_path = os.path.join(artifacts_dir, "columns.json")
    model_path = os.path.join(artifacts_dir, "bangaluru_home_price_model.pickel")

    with open(columns_path, "r") as f:
        __data_columns = json.load(f)["data_columns"]
        __locations = __data_columns[3:]

    with open(model_path, "rb") as f:
        __model = pickle.load(f)

    print("loading saved artifacts....done")


if __name__ == "__main__":
    load_save_artifacts()
    print(get_location_names())
    print(get_estimated_price("1st phase jp nagar", 1000, 3, 3))
    print(get_estimated_price("1st phase jp nagar", 1000, 2, 2))
