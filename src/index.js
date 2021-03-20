import React, { Component, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

const ChatbotApp = () => {
  const [chatlogs, setChatlogs] = useState([
    {
      id: 0,
      isAI: false,
      text: 'dummy',
    },
    {
      id: 1,
      isAI: true,
      text: 'Hi. What can I do for you?',
    },
    {
      id: 2,
      isAI: false,
      text: 'I\'m hungry!',
    },
  ]);
  const nextId = useRef(3);

  console.log('cookingBot v1.0 has started...');
  console.log('렌더링 할 때마다 ChatbotApp이 다시 실행되는가?')

  const onInsert = useCallback(
    text => {
      const chatlog = {
        id: nextId.current,
        isAI: false,
        text,
      };
      setChatlogs(chatlogs.concat(chatlog));
      console.log(chatlogs); //
      nextId.current += 1;
    },
    [chatlogs],
  );

  return (
    <div className="chat_window">
      <TopMenu />
      <ChatList chatlogs={chatlogs} />
      <InputBox onInsert={onInsert}/>
    </div>
  );
}

class TopMenu extends Component {
  render() {
    return (
      <div className="top_menu">
        <div className="buttons">
          <div className="red_button"></div>
          <div className="yellow_button"></div>
          <div className="green_button"></div>
        </div>
        <div className="title">
          <div className="text">cookingBot v1.0</div>
        </div>
      </div>
    );
  }
}

const InputBox = ({ onInsert }) => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => {
    setValue(e.target.value);
    //console.log(e.target.value); //
    //console.log('## change ##'); //
  }, []);

  const onClick = useCallback(e => {
      if(value !== ''){
        onInsert(value);
        setValue('');
        e.preventDefault();
        console.log('## click ##'); //
      }
      else {
        console.log('## click (empty input) ##')
      }
    },
    [onInsert, value], // useCallback에서 2번째 인자인 배열은, 배열 안의 값이 변화할 때 함수를 다시 만드는 것 아닌가?
    // 근데 어떻게 변수(props, state)가 아닌 함수인 onInsert가 여기에 올 수 있지?
  );

  return (
    <div className="bottom_wrapper">
      <div className="message_input_wrapper">
        <input 
          className="message_input" 
          placeholder="궁금한 레시피를 입력하세요 ㅎㅁㅎ" 
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="send_message" onClick={onClick}>
        <div className="text">보내기</div>
      </div>
    </div>
  );
  //}
}

class ChatList extends Component {
  render() {
    const chatlogList = this.props.chatlogs.slice(1, this.props.chatlogs.length).map(
      chat => (<ChatListItem isAI={chat.isAI} text={chat.text} />)
    );

    return (
      <ul className="messages">
        {chatlogList}
      </ul>
    );
  }
}

class ChatListItem extends Component {
  render() {
    if (this.props.isAI) {
      return (
        <li className="message.left">
          <div className="avatar_left"></div>
          <div className="text_wrapper_left">
            <div className="text_left">{this.props.text}</div>
          </div>
        </li>
      );
    }
    else {
      return (
        <div>
          <li className="message.right">
          <div className="text_wrapper_right">
            <div className="text_right">{this.props.text}</div>
          </div>
          <div className="avatar_right"></div>
        </li>
        </div>
      );
    }
  }
}


ReactDOM.render(
  <React.StrictMode>
    <ChatbotApp />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
