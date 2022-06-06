# Backend
1. cd into `backend/`
2. Install dependencies
    ```
    pip3 install -r requirements.txt
    ```
1. Install `nltk`'s dependencies
    ```
    python3 punkt_installer.py
    ```
1. Download the following pickle files to `data/pickle`:
    - `all_data.pkl`

1. Run the flask development server
    ```
    export FLASK_APP=api && flask run
    ```

# Frontend
1. cd into `frontend/`
1. Install `nvm` by following the steps [here](https://github.com/nvm-sh/nvm#installing-and-updating).
1. Install `node` by running:
    ```
    nvm install node
    ```
1. Run `npm install`
1. Run `npm start` to fire up the React development server

    (For more commands related to React, consult [this](../frontend/README.md) README.)
