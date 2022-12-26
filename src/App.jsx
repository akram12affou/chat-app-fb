import { async } from '@firebase/util'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateCurrentUser } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import './App.css'
import { db, auth } from './firebase'
function App() {
  const [user , setUser] = useState('')
  useEffect(() => {
 onAuthStateChanged(auth , CurrentUser => {  
   setUser(CurrentUser)
 })
  },[])

const messageRef = collection(db , 'messages')
const q = query(messageRef,orderBy('createdAt'));
const [messages , setMessages] = useState([])
const getmessages = async () => {
  const data = await getDocs(q)
  setMessages(data.docs.map((data) => (
    {...data.data() , id : data.id}
  )))
}
useEffect(() => {
 getmessages();
} , [])
 const [messagetext , setMessagetext] = useState('')
 const [password , setPassword] = useState('')
 const [email , setEmail] = useState('')
 const [loginstate , setLoginState] = useState('')
 const resiter = async() => {
     if(loginstate=='login'){
      try{
        await signInWithEmailAndPassword(auth,email,password)
        setEmail('')
        setPassword('')
      }catch(err){
          console.log(err.message)
      }
     }else if (loginstate=='signIn'){
      try{
        await createUserWithEmailAndPassword(auth,email,password);
        setEmail('')
        setPassword('')
      }catch(err){
          console.log(err.message)
      }
     }
 }
 const send = async () => {
 
  await addDoc(messageRef, {
    messagetext,
    userEmail  : user?.email,
    createdAt : new Date().getTime()
  })
  
  getmessages()
  setMessagetext('')
 }
 const logOut = async () => {
  await signOut(auth)
 }
 const deletemessage =async(id ) => {
  console.log(id)
  await deleteDoc(doc(db,'messages',id))
  getmessages()
 }
  return (
    <div className="App">
{!user && <>     {loginstate =='' &&  <>
     <button onClick={() => setLoginState('login')}>login</button>
     <button onClick={() => setLoginState('signIn')}>sign In</button>
     <br />
     </>}
     {loginstate !== '' && (
      <>
      <h1>{loginstate}</h1>
     <input type="text" value={email} onChange={e => setEmail(e.target.value)}placeholder='email...'/>
     <input type="text"  value={password} onChange={e => setPassword(e.target.value)} placeholder='password...'/>
     <button onClick={resiter}>Ok</button>
     <button onClick={() =>  setLoginState('')}>return</button>
     </>)} </>}
   {user && <button onClick={logOut}>Log Out</button>}
    <hr />
    User   : <>{user?.email}</> 
     <h1>Chat</h1> 
      {
        messages?.map((e) => {
          return(
            <div key={e.id} className={e.userEmail == user?.email ? 'you' : 'notyou'}>
            <span>{e.messagetext}</span>{" - "}
            <code>{e.userEmail == user?.email ? 'you': <>{e.userEmail}</>}</code>
            {' '} 
            {e.userEmail == user?.email  && <button onClick={() => deletemessage(e.id)}>🗿</button>}
            
            <br />
            </div>
            
          )
        })
      }
      <textarea type="text" value={messagetext} onChange={(e) => setMessagetext(e.target.value)} placeholder='message...'/>
      <button onClick={send} disabled={!user}>send</button>
    </div>
  )
}

export default App
