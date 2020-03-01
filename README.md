# Xexenes

This is an Ionic React app to consume a WikiData list API.

Ionic recently released their first official React based framework.  So this project is to explore it with the same functionality implemented in a string of projects starting a year ago that compared and contrasted React, Angular, React Native, Ionic, Electron and other approaches.

## Table of contents


* [Workflow](#workflow)
* [Upgrade](#upgrade)
* [The Rules of Hooks](#the-Rules-of-Hooks)
* [Hooks Concepts](#hooks-Concepts)
* [Getting started](#getting-started)



## Workflow

The standard Ionic workflow.

```
ionic serve
```

The app will then open in the default browser at this location:
```
http://localhost:8100/home
```

Build
```
npm run build
```

Deploy
```
firebase deploy
```

Hosted site:

https://quipu-a1093.firebaseapp.com



## Creating a new list

This is a work in progress right now on the NewItem component.

The NewItem needs to be renamed NewList.
The two components for the search and list need to be refactored out into two child components, such as Search and List.
Then, when the user is happy with the list, they need to be able to add it to the main page Categories.

There needs to be components directory and sub-folders to contain the .tsx/.css/.test files for each component.

```
NewList
SearchItem
ItemList
```

The SearchItem is also going to perform a 'list of x' search on Wikidata and possibly Wikipedia.  The first result ```wikipedia.org/api/rest_v1/page/summary/``` result has the following properties:
```
type: "standard"
title: "x"
displaytitle: "x"
namespace: {id: 0, text: ""}
wikibase_item: "Q564"
titles: {canonical: "x", normalized: "x", display: "x"}
pageid: 5098574
thumbnail: {,…}
originalimage: {source: "https://upload.wikimedia.org/wikipedia/commons/0/0f/x.jpg",…}
lang: "en"
dir: "ltr"
revision: "942402397"
tid: "a8d1c7b0-5b16-11ea-baf8-294c9920f812"
timestamp: "2020-02-24T13:14:10Z"
description: "..."
description_source: "local"
content_urls: {desktop: {page: "https://en.wikipedia.org/wiki/x",
                mobile: {page: …}
api_urls: {
  summary: "https://en.wikipedia.org/api/rest_v1/page/summary/x"
  metadata: "https://en.wikipedia.org/api/rest_v1/page/metadata/x"
  references: "https://en.wikipedia.org/api/rest_v1/page/references/x"
  media: "https://en.wikipedia.org/api/rest_v1/page/media/x"
  edit_html: "https://en.wikipedia.org/api/rest_v1/page/html/x"
  talk_page_html: "https://en.wikipedia.org/api/rest_v1/page/html/Talk:x"
}
extract: description
extract_html: description with markup
```

Other things to fix:
* stop multiple items from being added to a list
* name the list before adding it to the categories
* remove items from the list
* change the order of the items


### Element implicitly has an 'any' type because index expression is not of type

Since we want to add the whole response to the list, which includes a title and description in the 'extract' portion, the way the response was handled had to change.

Trying to put the search results object into the page summary was failing with this error:
```
"Element implicitly has an 'any' type because index expression is not of type "number".
```

This is what was being used to put just a part of the response into the page, but caused that error when the whole response was used:
```
  const [pageSummary, setPageSummary] = useState({});
```

This is what works to add the whole reponse object:
```
  type D = { [i: string] : any };
  const [pageSummary, setPageSummary] = useState<D>({});
```

The idea came from [this SO question](https://stackoverflow.com/questions/59271232/using-usestate-with-react-and-initialise-it-with-blank-object-in-typescript) thanks to the comment by Dupocas on Dec 10 '19 at 16:14.



### Setting up Firebase

Going the quick and cheap route with Firebase to setup authentication and hosting and get on with storing the lists somewhere.

The initial deployment failed with this error:
```
Failed to load resource: the server responded with a status of 400 ()
/%PUBLIC_URL%/assets/icon/favicon.png:1 Failed to load resource: the server 
```

The network tab shows:
```
Request URL: https://quipu-a1093.firebaseapp.com/%PUBLIC_URL%/assets/icon/favicon.png
```

Where does the PUBLIC_URL get set?  There are three options for configuring Firebase.  In the docs it says:

*Firebase SDK snippet*

* Automatic
* CDN
* Config

*Copy and paste these scripts into the bottom of your <body> tag, but before you use any Firebase services:*

Im assuming, with React and wanting to support local development, the last option is for us.

Using the *[module bundler approach](https://firebase.google.com/docs/web/setup?authuser=0#add-sdks-initialize)* is for npm installation.



## Ionic component problems

While working on issue #3, *Implement categories from a static*, some interesting errors came up with the IonInput and IonButton components.

In the NewItem.tsx file render function, using this markup:
```html
<IonInput placeholder="Enter Input" 
    id="todo_input" 
    type="text"       
    onChange={(e)=> setTodo(e.target.value)}></IonInput>
```

Hovering over the e or target objects the VSCode editor shows this TypeScript error:
```
(parameter) e: Event
Object is possibly 'null'.ts(2531)
```


When hovering over the .value part is shows:
```
Property 'value' does not exist on type 'EventTarget'.
```

That last one we have seen before and solved like this:
```
(e.target as HTMLElement)
```

Using HTMLElement doesn't work, and will still give this error on the .value section:
```
Property 'value' does not exist on type 'HTMLElement'.
```

The solution, as was used before is to find the correct HTML element, which in this case is the *HTMLInputElement* type:
```
onChange={(e)=> setTodo((e.target as HTMLInputElement).value)}
```


Then problem with the IonButton was different.  Strangely it causes a page refresh.  Here is the markup:
```html
<IonButton 
    id="submit_button" 
    type="submit" 
    onClick={(e) => putData(e)}>Add</IonButton>
```

That calls this action:
```javascript
const putData = (e: any) => {
    e.preventDefault()
    return dispatch({
      type: 'PUT_DATA',
      payload: todo
    })
}
```

Using a regular button calls the same action, but works as expected, so it's probably not the onclick function.  Have to Google this one.

In the end, I couldn't use the Ionic input, and the whole issue made me question using Ionic with React at this point.  But Ionic 5 is out now, and it's worth upgrading this project to that and try again before giving up.

### Previous notes
when trying to use some more Ionic elements like IonInput, this comes up in previously working code, now with a similar error:
```
Object is possibly 'null'.  TS2531
    48 |             <IonInput placeholder="Enter Input" 
    49 |                 id="todo_input" type="text"       
  > 50 |                 onChange={(e)=> setTodo(e.target.value)}></IonInput><br/>
       |                                         ^
```

In VSCode, if you hover over the value portion of the argument to setTodo, you see this TypeScript error:
```
Property 'value' does not exist on type 'EventTarget'.ts(2339)
```

However, if you hover over the 'e' part, you get the same as the compile error in the browser:
```
Object is possibly 'null'.  TS2531
```

This is a [classic StackOverflow answer](): *This feature is called "strict null checks", to turn it off ensure that the --strictNullChecks compiler flag is not set.  However, the existence of null has been described as The Billion Dollar Mistake, so it is exciting to see languages such as TypeScript introducing a fix.*

But for us, in this case, it as a new Redux Hook, not our own defined constant.  So thie same solution doesn't work:
```
setTodo(e.target.value as HTMLElement)
```

The error over 'e' would then change to:
```
Argument of type 'HTMLElement' is not assignable to parameter of type 'SetStateAction<string>'.
  Type 'HTMLElement' is not assignable to type 'string'.ts(2345)
```

Tried this schenanigan:
```
setTodo(e.target.value !== null ? e.target.value : ''
```

Using a regular input works fine.  But then, the add todo action has the impressive ability to refresh the app.  This is getting interesting!

Using IonInput causes an "Object is possibly 'null'" error on the event arg.

Using an IonButton causes a page refresh.  Are these bugs in the Ionic React implementation?  Quick, take me to their GitHub!



## Implement categories from a static list #3


Using Redux hooks for this one.  The goal is to create a categories component to view the list.
```
{ name: 'fallacies', label: 'Fallacies', language: 'en', wd: 'Q186150', wdt: 'P31' },
{ name: 'cognitive_bias', label: 'Cognitive Bias', language: 'en', wd: 'Q1127759', wdt: 'P31' }
```

Redux hooks are officially about two months old now.  I've read about how redux-hooks work now to allow state in function (classes are out now, sorry Angular).  Here is a good example to follow that just shows your basic (but pretty) [to-do list in redux-hooks](https://upmostly.com/tutorials/build-a-todo-app-in-react-using-hooks).

Coming from an Angular background, little things like this can be tricky:
```
import { Categories } from './Categories';
```

Causes this error:
```
Attempted import error: 'Categories' is not exported from './Categories'.
```

That might work in Angular, but in React it should be:
```
import Categories from './Categories';
```

I always forget the exact meaning of with or without curly brackets.  It because in Angular you usually write this at the start of the file:
```
export class Categories extends whatever
```

But in React these days you write this at the *end* of the file:
```
export default Categories
```

Not sure why you can't just wirte on one line:
```
export default function Categories() {
```  

But mine is not to question (too much) but to learn the React way.

Running the build again and this error shows up:
```
[ERROR] Invalid project type: react (project config: ./ionic.config.json).        
        Project type must be one of: angular, ionic-angular, ionic1, custom
```

[This issue](https://stackoverflow.com/questions/59050160/building-ionic-react-for-android-invalid-project-type-react) has been open for a month with not even a comment on the Stack.

There is a [GitHub issue](https://github.com/ionic-team/ionic-cli/issues/2531) that was closed without resolution on the Ionic site.

There is another Ionic framework [GitHub issue](https://github.com/ionic-team/ionic-cli/issues/2329) that has some action on it.  It seems the ionic.config.json file might be the problem.s
```
{
  "name": "tea",
  "integrations": {},
  "type": "react"
}
```

I think my version of node was the problem.  I switched to use 12 via nvm:
```
Now using node v12.9.1 (npm v6.10.2)
```

And things ran ok.  But who chose the name 'tea' for the project?  I thought it was Xexenes?

While implementing the code to add a category, we are getting this error:
```
Property 'focus' does not exist on type 'Element'. 
```

That's coming from this code:
```
setTimeout(() => {
    document.forms[0].elements[i + 1].focus();
}, 0);
```

The explanation for this is worth noting: *Updating the state inside of a React component does not happen instantaneously. It can sometimes take time, especially if what we’re updating contains a lot of data.  Therefore, we add a timeout delay to the focus to wait for the state to finish updating before focusing on the newly rendered input. [more details](https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks)*

Anyhow, the error.  StackOverflow: *Use the type HTMLElement instead of Element.*

StackOverflow, what would we do without you?  This works in the timeout instead:
```
let element = document.forms[0].elements[i + 1] as HTMLElement;
element.focus();
```

That's TyhpeScript.  We have also been getting issues like this:
```
Parameter 'index' implicitly has an 'any' type.  TS7006
```

Add a type annotation to the variable in question and the error goes away.  It's pretty standard stuff now.
```
index: number
```

We are still getting this non-breaking warning:
```
Warning: Each child in a list should have a unique "key" prop.
Check the render method of `Categories`. See https://fb.me/react-warning-keys for more information.
    in div (at Categories.tsx:50)
```

That's in out map function:
```
{todos.map((todo, i) => (
    <div className="todo">
```

It looks like the i value provides the unique key.  Those values do not repeat.  I thought this might be a TypeScript thing also, but StackOverflow has a more likely cause:
*You should not be using index of the map for you Key, its an antipattern, it may lead to unpredictable results.  [Please check this](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).  You should be using proper unique-id for your Key, like a DB id or some unique-id.  This Key is used internally to identify the DOM elements to render and not to render again.*

There it is: *don't use index of the map for Keys*.  Leave that for now.  Can we suppress that warning?  It's a big fat red stacktrace which is a bad look.  After the next change, it's gone.  Hmmm...

Next we have to convert the sample code to be more like the categories we want, as well as use the Ionic checkbox instead of the (albeit nice) custom version from the article.

This is where things need to be thought out a bit more.  For us, categories are not check boxes.  While they may have things in common with a to do list, they are not easily completed.  It will depend on completing all the items in the list for the category which could take some time.  It's also turning out to be a difficult thing to add a new category.  I have not been able to do it by hand, so this app now is going to be the place where we figure out how to let the user type in the type of list they are looking for, and the app will go and figure out how to get that list.

We know how to get a list of fallacies or cognitive biases, but how do we get an arbitrary "list of x"?  So the FAB button to add a new category with a link to a new page make more sense than the efficient in-line editing that the sample hooks demo provided.

There is also the prospect of implementing the full-blown Redux pattern we will need for this app, but that will also require more planning.


## Implementing Redux


Another [Todo example with a Redux boilerpate](https://github.com/akshayjp123/todo-with-react-hooks) that has the [following GitHub companion](https://medium.com/@akshayjpatil11/implementing-redux-architecture-using-react-hooks-39b47762a2fb).

Steps to setup:
1. Create a store with initialState, case 'PUT_DATA', case 'DONE_TODO' and a StoreProvider.
2. Build the components.

Starting off with the store file.  This article doesn't use TypeScript, so this is the first issue in the store.ts:
```
export const Store = React.createContext();
```

Causes this error:
```
Expected 1-2 arguments, but got 0.ts(2554)
index.d.ts(336, 9): An argument for 'defaultValue' was not provided.
```

Raising up the initial state above the creation line fixes the issue:
```
const initialState = {
    todos: []
}
export const Store = React.createContext(initialState);
```

It's kind of like an instant linter, and well worth it.

The next issue is
```
reducer(state: any, action: any) {
```

Do we have types for those?  Using 'any' too much can reduce our linting prowess.

The props also have the same problem:
```
export function StoreProvider(props: any) {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const value = {state, dispatch}
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}
```

But more pressing, is the last line there, which causes this error:
```
Cannot find namespace 'Store'.ts(2503)
```

It's missing the types?  The most obvious solution is to install Redux which we haven't done yet.
```
npm install redux --save
npm install @types/redux
npm install tslint
```

That didn't help.  I renamed the file from .ts to .tsx and the errors went away.  All except one:
```
(JSX attribute) React.ProviderProps<{ todos: never[]; }>.value: {
    todos: never[];
}
Property 'todos' is missing in type '{ state: any; dispatch: React.Dispatch<any>; }' but required in type '{ todos: never[]; }'.ts(2741)
store.tsx(4, 5): 'todos' is declared here.
index.d.ts(289, 9): The expected type comes from property 'value' which is declared here on type 'IntrinsicAttributes & ProviderProps<{ todos: never[]; }>'
```

Not sure about that one.  Can't but a type on todos in the initial state:
```
'any' only refers to a type, but is being used as a value here.ts(2693)
```

### An element access expression should take an argument

The last if the errors on the first store file was causing this compile error:
```
>ionic serve
> react-scripts.cmd start
[react-scripts] Starting the development server...
[react-scripts] Browserslist: caniuse-lite is outdated. Please run next command `npm update`
[react-scripts] Failed to compile.
[react-scripts] ./src/store/store.tsx
[react-scripts]   Line 4:  Parsing error: An element access expression should take an argument
```

The problem is the type of the initial state, not 'value' in the markup on the last line which has a red squiggly line under it.
```
const initialState = {
    todos: []
}
...
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}
```

The solution is not to type the todos, but the initial state itself like this:
```
const initialState: any = {
```

But We need to get rid of the any types an make some interfaces for our project.  [The official Redux docs](https://redux.js.org/recipes/usage-with-typescript/)] have example on how to add Redux types when using TypeScript:
```
// src/store/chat/types.ts
export interface Message {
  user: string
  message: string
  timestamp: number
}
export interface ChatState {
  messages: Message[]
}
```

Then we can use that instead of any in the initial state:
```
export function chatReducer(
  state = initialState,
  action: ChatActionTypes
): ChatState {
  switch (action.type) {
```

Had to restart VSCode after this to get some strange editor errors to disappear, and then all runs fine.  On with the show.


### Build the components, *the Billion Dollar Mistake* and page refresing buttons

Adding the put and done functions to the new item component was pretty easy.  But in the template we run into this error:
```
<li className="todo_item" 
    value={index} 
    key={index}
    onClick={(e) => doneTodo(e.target.value)}>
```

The last line there has a red squiggly:
```
Property 'value' does not exist on type 'EventTarget'.ts(2339)
```

I changed the event to look like this:
```
onClick={(e) => doneTodo(e.target as HTMLElement)}
```

StackOverflow says: *HTMLElement is the parent of all HTML elements, but isn't guaranteed to have the property value. TypeScript detects this and throws the error. Cast event.target to the appropriate HTML element to ensure it is HTMLInputElement which does have a value property ([source](https://stackoverflow.com/questions/44321326/property-value-does-not-exist-on-type-eventtarget-in-typescript/44321394))*

But unfortunately, none of those fixes worked.  This does, but then the vague type 'any' is pushed into the function:
```
const doneTodo = (index: any) => {
    console.log('index', index);
    return dispatch({
        type: 'DONE_TODO',
        payload: index.value
    })
}
```

What is the type of the list element ```<li>```?

But the errors are gone and that is good enough for now.  But when trying to use some more Ionic elements like IonInput, this comes up in previously working code, now with a similar error:
```
Object is possibly 'null'.  TS2531
    48 |             <IonInput placeholder="Enter Input" 
    49 |                 id="todo_input" type="text"       
  > 50 |                 onChange={(e)=> setTodo(e.target.value)}></IonInput><br/>
       |                                         ^
```

In VSCode, if you hover over the value portion of the argument to setTodo, you see this TypeScript error:
```
Property 'value' does not exist on type 'EventTarget'.ts(2339)
```

However, if you hover over the 'e' part, you get the same as the compile error in the browser:
```
Object is possibly 'null'.  TS2531
```

This is a [classic StackOverflow answer](): *This feature is called "strict null checks", to turn it off ensure that the --strictNullChecks compiler flag is not set.  However, the existence of null has been described as The Billion Dollar Mistake, so it is exciting to see languages such as TypeScript introducing a fix.*

But for us, in this case, it as a new Redux Hook, not our own defined constant.  So thie same solution doesn't work:
```
setTodo(e.target.value as HTMLElement)
```

The error over 'e' would then change to:
```
Argument of type 'HTMLElement' is not assignable to parameter of type 'SetStateAction<string>'.
  Type 'HTMLElement' is not assignable to type 'string'.ts(2345)
```

Tried this schenanigan:
```
setTodo(e.target.value !== null ? e.target.value : ''
```

Using a regular input works fine.  But then, the add todo action has the impressive ability to refresh the app.  This is getting interesting!

Using IonInput causes an "Object is possibly 'null'" error on the event arg.

Using an IonButton causes a page refresh.  Are these bugs in the Ionic React implementation?  Quick, take me to their GitHub!

They have [about 800 issues](https://github.com/ionic-team/ionic/issues) on the Ionic project.  Is it worth the effort?

Maybe we should try the latest release.

Remember, this project is currently working with ^4.9.0-rc.2.  The latest is 4.11.8.
...
"react": "^16.9.0",
```

After changing that, running npm i, and starting the ionic serve again, this shows up:
```
/Users/tim/repos/xexenes/src/App.tsx
TypeScript error in /Users/tim/repos/xexenes/src/App.tsx(28,4):
Property 'translate' is missing in type '{ children: Element; }' but required in type 'Pick<HTMLAttributes<HTMLIonAppElement>, "title" | "hidden" | "dir" | "slot" | "color" | "children" | "accessKey" | "draggable" | "lang" | "translate" | "className" | "id" | "prefix" | ... 239 more ... | "onTransitionEndCapture">'.  TS2741

    26 | 
    27 | const App: React.FC = () => (
  > 28 |   <IonApp>
       |    ^
    29 |     <IonReactRouter>
```


## SPAQL

[SPARQL](https://en.wikipedia.org/wiki/SPARQL) (pronounced "sparkle", a recursive acronym for SPARQL Protocol and RDF Query Language) is an RDF query language—that is, a semantic query language for databases—able to retrieve and manipulate data stored in Resource Description Framework (RDF) format.


## Adding Capacitor PWA support

[Here are the intro docs](https://capacitor.ionicframework.com/docs/getting-started/).


## Upgrade


The first commit for this project was from Sep 23 2019.  The current versions in the package.json file are:
```
"@ionic/react": "^4.9.0-rc.2",
"react": "^16.9.0",
```

The latest release is 4.11.7.

It contains Bug Fixes like *react: fire lifecycle events on initial render, fixes #20071 (9ea75eb)*.  Might be OK.  [Doesn't seem to work in Edge](https://github.com/timofeysie/xexenes/issues/2), but I wont tell if you don't.  Probably worth updating since this project was starting at a time when the Ionic React was just released.

When I cloned this project on a new laptop, got this message:
```
> npm i -D -E react-scripts
npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
```



## The Rules of Hooks

These are major rules we must always follow.

1. Never call Hooks from inside a loop, condition or nested function
2. Hooks should sit at the top-level of your component
3. Only call Hooks from React functional components
4. Never call a Hook from a regular function
5. Hooks can call other Hooks

Why hooks?  *To win the fight against evil classes that tend to pollute our codebase.*  Wait, what???

The stated dream of hooks is *to create and share small, re-usable and maintainable pieces of logic in our applications without nesting some more into the components tree. No mixins, no higher-order components, no render props craziness.*

A developer at my previous role told me "classes are gross!".  Since we used Angular there, and he was a React developer, it was confusing.  He was actually part of the backend serverless API making team.  I asked him a question about some RxJs observable issue I was having and he said he couldn't help.  Like most developers, they only know one world, and don't flit between worlds in a time wasting frivolous manner like I do.  So I justified that and thought that certainly he didn't mean *Angular classes*, as the whole Angular framework is based on classes.

So then why are React developers so down on classes, and what is wrong with React classes?  React still needs classes from some things, such as lifecycle hooks, like componentDidCatch and getSnapshotBeforeUpdate.  But even in the future these are said to become part of the Hooks API really soon.

If there is a non-existing battle between Hooks and classes, what does a developer do?

Simplicity is difficult.  It could be that classes encourage inheritance, which, with the drive to reduce repetition in code leads to complex code bases where the depth of a class heirachy makes code hard to reason about.

From the [React webpage](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks):
*To reduce the boilerplate, we recommend using react-testing-library which is designed to encourage writing tests that use your components as the end users do.*

That's all well and good.  For me, it comes down to available jobs in Sydney.  70% React vs. about 30% Angular.  So to be considered for a larger selection of jobs, React is essential.  If those jobs include hooks, then I need hooks.  The problem is, probably existing code base jobs outweigh greenfield jobs, so a knowledge of Redux is also needed.

Having debates like this are fine, but it's taking me away from writing code.

An update on this.  After talking to a few recruiters, and landing two more senior Angular roles, I'm not sure how urgent becoming a senior React developer is.  What I said above about inheritance and classes however is still very relevant after working on a project which was class/inheritance heavy which made understanding the code more difficult.  There still seem to be way more React roles, but apparently they are for smaller companies, while the larger companies still use Angular.  It still has a huge community as seen [on the framework watch](https://frontendwatch.com/).

The jobs ratio continues to be of a concern for Angular developers:
```
Angular: 74 jobs
React: 221 jobs
```


## Hooks Concepts

*When updating state, we sometimes have side effects that need to happen along with each change. In our example of the counter, we may need to update the database, make a change to local storage or simply update the document title. In the React JS docs, the latter example is used to make things as simple as possible. So let's do just that and update our examples to have a side effect that uses the new Hook useEffect.*
[Source](https://www.telerik.com/kendo-react-ui/react-hooks-guide/)

UI -> Action -> (Effect -> Sate Result Action ->) Reducer -> Store -> UI updated

Effects
usually getting or sending data to an API.
a new “state-result” action gets fired by the effect.

In Redux:
```
Export class UserEffects {
    @Effect() getUser$ = this._actions$pipe(ofType<GetUser>(EUserActions.GetUser), map(action => action.payload), withLatestFrom(this._store.pipe(select(selectedUserList))), switchMap(([id, users]) => {
        Const selectedUser = users.filer(user => user.id === +id)[0];
        Return of(new GetUserSuccess(selectedUser));
    })
);
```

Using hooks:
```
export default function Greeting() {
  const [firstName, setFirstName] = useState(() =>
    window.localStorage.getItem('hooksFirstName') || ''
  );
  const [lastName, setLastName] = useState(() =>
    window.localStorage.getItem('hooksLastName') || ''
  );
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  useEffect(() => {
    window.localStorage.setItem('hooksFirstName', firstName), [firstName];
    window.localStorage.setItem('hooksLastName', lastName), [lastName];
  });
  return (
    <div>
      <input value={firstName} onChange={handleFirstNameChange} /><br />
      <input value={lastName} onChange={handleLastNameChange} />
      <p>
        Hello, <span>{firstName} {lastName}</span>
      </p>
    </div>
  );
}
```



## Getting started

This project is based on the new [Ionic React](https://ionicframework.com/docs/react/your-first-app#a-look-at-a-react-component) hybrid app implementation.

Some notes on this approach.

```
const Home: React.FC = () => { }
```

That's FC for "FunctionalComponent" folks.
Could also be React.FunctionComponent in place of React.SFC / React.StatelessComponent.

This is actually a React and TypeScript thing.
To type the functional components with the React.FC generic type.
It adds automatically children for you, makes the signature easier to read (IMHO) and checks the return type.
The Home page does this:
```
const Home: React.FC<RouteComponentProps> = (props) => { }
```

And in the template (or JSX rather):
```
...
<IonFabButton onClick={() => props.history.push('/new')}>
<IonIcon icon={add} />
</IonFabButton>
```

to use the Ionic Lifecycle methods in a class-based component, you must wrap your component with the withIonLifeCycle higher order component (HOC) like so:
```
export default withIonLifeCycle(HomePage);
```
