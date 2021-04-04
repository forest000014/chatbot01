import React, { Component, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJbh2JEwFvPkcZQtjvFBnSC01tGVK3Mxc",
  authDomain: "cookingbot-4c2b0.firebaseapp.com",
  projectId: "cookingbot-4c2b0",
  storageBucket: "cookingbot-4c2b0.appspot.com",
  messagingSenderId: "242270873021",
  appId: "1:242270873021:web:ce635f56d1728122d99ed4",
  measurementId: "G-WT0S94K2KY"
};
var fbApp = firebase.initializeApp(firebaseConfig);
var db = fbApp.firestore();

console.log('firebase app initialized');
console.log(fbApp);

// db.collection('users').doc('alovelace').set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

// [component]
class ChatbotApp extends Component {
  constructor() {
    super();
    this.state = {
      chatlogs: [],
      cnt: 0
    };

    const observer = db.collection('chats')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('added: ', change.doc.data());
          this.setState({chatlogs: this.state.chatlogs.concat({isAI: change.doc.data().from === 'cookingBot',
          text: change.doc.data().message }), cnt: this.state.cnt + 1});
        }
      })
    })
  }

  // 전송 버튼을 눌렀을 때 실행될 메서드. inputBox -> <div send_message> -> onClick -> onInsert
  onInsert(text) {
    db.collection('chats').add({
      from: 'me',
      message: text,
      order: this.state.cnt
    });
    console.log(this.state.chatlogs); //
  }
  
  onInsert = this.onInsert.bind(this);
  /*
  async componentDidMount() {
    let chats = await getChats();
    let chatlogs = [];
    let size = 0;

    console.log('## componentDidMount() started.'); //

    chats.forEach((doc)=>{
      size++;
      console.log(doc.id, '=>', doc.data());
      chatlogs.push({isAI: doc.data().from === 'cookingBot',
        text: doc.data().message });
    });
    
    console.log('## chats size when mounted: ' + size); //
    this.setState({chatlogs: chatlogs, cnt: size + 1});
    console.log('## componentDidMount() finished.'); //
  }*/

  render() {
    //console.log('cookingBot v1.0 has started...');
    //console.log('왜 렌더링 할 때마다 ChatbotApp이 다시 실행되는가?')
    
    return (
      <div className="chat_window">
        <TopMenu />
        <ChatList chatlogs={this.state.chatlogs} />
        <InputBox onInsert={this.onInsert}/>
      </div>
    );
  }
}
/*
// [function]
async function observeChats() {

  // const snapshot = await db.collection('chats').orderBy('order').get();
  return snapshot;
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });
}
*/
// [component]
class TopMenu extends Component {
  render() {
    const botName = "cookingBot";
    let appVer = "1.0";
    return (
      <div className="top_menu">
        <div className="buttons">
          <div className="red_button"></div>
          <div className="yellow_button"></div>
          <div className="green_button"></div>
        </div>
        <div className="title">
          <div className="text">{botName} v{appVer}</div>
        </div>
      </div>
    );
  }
}

// [component]
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

// [component]
class ChatList extends Component {
  constructor(props){
    super(props);
    //this.state = {chatlogs: props.chatlogs};
    //console.log(this.props);
  }

  render() {
    const chatlogList = this.props.chatlogs.map(
      chat => (<ChatListItem isAI={chat.isAI} text={chat.text} />)
    );

    return (
      <ul className="messages">
        {chatlogList}
      </ul>
    );
  }
}

// [component]
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
