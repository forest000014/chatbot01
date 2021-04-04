from queue import Queue, Empty
from threading import Thread
import os
import sys
import time
import base64
import traceback

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from openchat.envs import BaseEnv
from openchat.models import BaseModel


class WebDemoEnv(BaseEnv):

    def __init__(self):
        super().__init__()
        self.BATCH_SIZE = 1
        self.CHECK_INTERVAL = 0.1
        self.app = Flask(__name__)
        self.requests_queue = Queue()
        CORS(self.app)

    def run(self, model: BaseModel):

        ##
        # Request handler.
        # GPU app can process only one request in one time.
        def handle_requests_by_batch():
            while True:
                request_batch = []

                while not (len(request_batch) >= self.BATCH_SIZE):
                    try:
                        request_batch.append(self.requests_queue.get(timeout=self.CHECK_INTERVAL))
                    except Empty:
                        continue

                    for requests in request_batch:
                        try:
                            requests["output"] = message_generate(requests['input'][0], requests['input'][1])
                        except Exception as e:
                            traceback.print_exc()
                            requests["output"] = e

        handler = Thread(target=handle_requests_by_batch).start()

        def message_generate(user_id, text):
            try:
                result = model.predict(user_id=user_id,
                                       text=text,
                                       top_k=50)
            except RuntimeError as r:
                print(r)
                exit(-1)
                sys.exit(-1)
            except Exception as e:
                print(e)
                traceback.print_exc()
                result = 'error :('

            return result

        ##
        # Sever health checking page.
        @self.app.route('/healthz', methods=["GET"])
        def health_check():
            return "Health", 200

        @self.app.route("/")
        def index():
            return render_template("index.html", title=model.name)

        @self.app.route('/send/<user_id>', methods=['POST'])
        def send(user_id):

            if self.requests_queue.qsize() > self.BATCH_SIZE:
                return jsonify({'message': 'Too Many Requests'}), 429

            try:
                text: str

                text = request.form['text']
                text = text.replace('<', '')
                text = text.replace('>', '')

            except Exception as e:
                return jsonify({'message': e}), 500

            try:
                if text in self.keywords:
                    # Format of self.keywords dictionary
                    # self.keywords['/exit'] = (exit_function, 'good bye.')

                    _out = self.keywords[text][1]
                    # text to print when keyword triggered

                    self.keywords[text][0](user_id, text)
                    # function to operate when keyword triggered

                else:
                    args = []

                    args.append(user_id)
                    args.append(text)

                    # input a request on queue
                    req = {'input': args}
                    self.requests_queue.put(req)

                    # wait
                    while 'output' not in req:
                        time.sleep(self.CHECK_INTERVAL)

                    _out = req['output']

                return {"output": _out}

            except Exception as e:
                traceback.print_exc()
                return jsonify({'message': e}), 500

        from waitress import serve
        serve(self.app, port=80, host='0.0.0.0')
