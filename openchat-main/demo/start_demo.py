import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from openchat import OpenChat
from web_demo_env import WebDemoEnv


# CPU Running
print('cpu')
OpenChat(model="blenderbot", size="large", env=WebDemoEnv())
# GPU Running
#print('gpu')
#OpenChat(model="blenderbot", size="large", env=WebDemoEnv(), device="cuda")
