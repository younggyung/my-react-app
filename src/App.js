
import './App.css';
import {useState} from 'react';


function Header(props){
  return <header>
  <h1><a href='/' onClick={(event)=>{
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
}
function Nav(props){
  const lis = [];
    for(let i = 0; i<props._topics.length;i++){
    let t = props._topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a></li>);
  };
  return <nav>
  <ol>
    {lis}
  </ol>
</nav>
}
function Article(props){
  return <article>
  <h2>{props.title}</h2>
    {props.body}
</article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title,body);
    }}>
    <p><input type="text" name="title" placeholder='title'/></p>
    <p><textarea name="body" placeholder="body"/></p>
    <p><input type='submit' value="create"/></p>
    </form>
    </article>
}

function Update(props){
  const[title,setTitle] = useState(props.title);
  const[body, setBody] = useState(props.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title,body);
    }}>
    <p><input type="text" name="title" placeholder='title' value={title} onChange={event=>{
      setTitle(event.target.value);
      
    }}/></p>
    <p><textarea name="body"  placeholder='body' value={body} onChange={event=>{
      setBody(event.target.value);
    }}/></p>
    <p><input type='submit' value="update"/></p>
    </form>
  </article>
} 

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id ,setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState( [ 
    {id:1, title:"html",body:'html is ...'},
    {id:2, title:"css",body:'css is ...'},
    {id:3, title:"js",body:'js is ...'} 
  ]);
  let content = null;
  let contextControl = null;
  if(mode ==='WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode === 'READ'){ 
    let title,body = null;
    for(let i = 0 ; i<topics.length;i++){
      if(topics[i].id ===id){
        title = topics[i].title;
        body = topics[i].body
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update/' + id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
    } }>Update</a></li>
    <li><input type='button'value='delete' onClick={event=>{
      //삭제로직
      const newTopics = [...topics];
      newTopics.splice(newTopics.findIndex((o)=>o.id===id),1);
      let confirm = window.confirm("진짜삭제?")
      if(confirm == true){
      setTopics(newTopics);
      setMode('WELCOME');}

      /*다른방법 :: 
      const newTopic = []
      for(let i ; i<topics.length;i++){
        if(topics[i].id !==id){
          newTopics.push(topics[i];
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
      */


    }}/></li>
    </>

  }else if(mode ==='CREATE'){
    content = <Create onCreate={(title,body)=>{
        const newTopic = {id:nextId,title:title,body:body};
        const newTopics = [...topics]; //useState로 다루는 데이터가 범객체라면, 복제본으로 다루어줘야한다. topics복제
        newTopics.push(newTopic); //복사본인 newTopics에 새로운 객체인 newTopic 추가
        setTopics(newTopics); //setTopics를 해주는데 newTopics를 인자로 준다. 배열에 대체할 배열을 주는것
        setMode('READ');
        setId(nextId);
        setNextId(nextId+1);
    }}></Create>
  }else if(mode === 'UPDATE'){
    //topic배열에서 꺼내주는 코드
    let title,body = null;
    for(let i = 0 ; i<topics.length;i++){
      if(topics[i].id ===id){
        title = topics[i].title;
        body = topics[i].body
      }
    }
      content = <Update title={title} body={body} onUpdate={(title,body)=>{
        const updateTopic = {id:id,title:title,body:body};
        const newTopics = [...topics];
      for(let i=0; i<topics.length;i++){
        if(newTopics[i].id === id){
          newTopics[i] = updateTopic;
          break;
        }
      }
        setTopics(newTopics);
        setMode('READ');
      }}></Update>}
  
  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode ('WELCOME');
      }}></Header>
      <Nav _topics={topics} onChangeMode={ _id=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
      <li><a href="/" onClick={(event)=>{
        event.preventDefault();
        setMode('CREATE');
      }
      }>create</a></li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
