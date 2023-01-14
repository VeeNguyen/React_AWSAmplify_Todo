import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

// test 
import { Authenticator } from '@aws-amplify/ui-react';
// end test

Auth.configure(awsconfig);
API.configure(awsconfig);


// updateTodo CRUD function
// for info on the params of these function
// check out mutations.js or the docs on dymanoDB on AWS
function updateTodo(todo, newDescription) {
  todo['description'] = newDescription;
  API.graphql(graphqlOperation(mutations.updateTodo, { input: todo }));
}

// deleteTodo CRUD function
function deleteTodo(todo) {
  API.graphql(graphqlOperation(mutations.deleteTodo, { input: { 'id': todo['id'] } }));
}


function App() {

  // filter graphql calls
  const userTodos = API.graphql(graphqlOperation(queries.listTodos, { filter: { 'name': { 'eq': "test" } } }));
  console.log("USERTODo: ", userTodos);

  // store the return from API call
  // listTodo from queries.js
  // list all todos
  const allTodos = API.graphql(graphqlOperation(queries.listTodos));
  console.log("ALL TODOS: ", allTodos);

  // return one query from one id
  // getTodo from queries.js
  // list 1 todo
  const oneTodo = API.graphql(graphqlOperation(queries.getTodo, { id: "4ba2866d-e497-42eb-96f0-565dc9f93388" })).then(function (todo) {
    // this is the todo that is just fetched
      console.log("FETCHED TODo: ", todo);
      // updateTodo(todo['data']['getTodo'], "this is a new description");
    deleteTodo(todo['data']['getTodo']);
  });
  // console.log("ONE TODo: ", oneTodo)


  // get current user from cache
  // use user's name as the name of todo
  Auth.currentAuthenticatedUser({
    bypassCache: false
  }).then(function (user) {
    console.log("USER: ", + JSON.stringify(user));

    // CRUD operations from mutations.js
    // const todo = { name: user['username'], description: "created new todo" };
    // const newTodo = API.graphql(graphqlOperation(mutations.createTodo, { input: todo }));
    // console.log("NEW TODO", newTodo);
  }).catch(err => console.log("ERR", err));



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
         <Authenticator>
          {({ signOut, user }) => (
            <div className='App'>
              <p>
                Hey, {user.username} !
              </p>
              <button onClick={signOut}>Sign Out</button>
            </div>
          )}
    </Authenticator>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}


// test
// function App() {
//   return (
//     <Authenticator>
//       {({ signOut, user }) => (
//         <div className='App'>
//           <p>
//             Hey {user.username }
//           </p>
//           <button onClick={ signOut}>Sign out</button>
//         </div>
//       ) }
//     </Authenticator>
//   )
// }
// end test


export default withAuthenticator(App);
// export default App;