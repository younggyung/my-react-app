
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

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id ,setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  console.log(nextId);

  const [topics, setTopics] = useState( [
    {id:1, title:"html",body:'html is ...'},
    {id:2, title:"css",body:'css is ...'},
    {id:3, title:"js",body:'js is ...'}
  ]);
  let content = null;
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
  }

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
      <a href="/" onClick={(event)=>{
        event.preventDefault();
        setMode('CREATE');
      }
      }>create</a>
    </div>
  );
}

export default App;
