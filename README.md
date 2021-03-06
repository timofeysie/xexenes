# Xexenes

This is an Ionic React app to provide a configurable list of items from Wikipedia.

Ionic recently released their first official React based framework.  This project aims to explore it with the same functionality implemented in a string of [similar projects](https://github.com/timofeysie/loranthifolia) starting a year ago that compared and contrasted React, Angular, React Native, Ionic, Electron and other approaches to modern app development.

Ionic React has worked out somewhat.  There seem to be some problems with Ionic components (see below) at the moment, but overall, Ionic is still a great mobile based framework that also works for the web.

React hooks are great.  This app also uses some Redux hooks just as a learning process.  Redux may or may not be really needed for an app this size, but it's OK for learning purposes.


## Table of contents


* [Workflow](#workflow)
* [TODO](#TODO)
* [Testing useContext](#testing-useContext)
* [Routing to a details page](#routing-to-a-details-page)
* [Refactoring the home page](#refactoring-the-home-page)
* [Setting up a CI/CD pipeline using GitHub Actions](#setting-up-a-CI/CD-pipeline-using-GitHub-Actions)
* [Creating a new list](#creating-a-new-list)
* [Ionic component problems](#ionic-component-problems)
* [Implement categories from a static list](#implement-categories-from-a-static-list)
* [Implementing Redux](#implementing-Redux)
* [SPARQL](#SPARQL)
* [Adding Capacitor PWA support](#adding-Capacitor-PWA-support)
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
ionic build --prod
```

Deploy
```
firebase deploy
```

Hosted site:

https://quipu-a1093.firebaseapp.com



## TODO

It's hard to keep up to date on a long to do list.  After all, that's why there are so many apps that let you cross items off when done.

This todo list is mainly focused on refactoring the home page into separate discrete components and creating an MVP for this app.

* The item list cards need a remove icon
* (done) Item list cards click should lead to a details page
* Failed searches need an error message
* write tests for the Home page and the Categories component
* move the category component into the components directory
* The NewItem needs to be renamed NewList.
* Rename todo list
* Add list to the main page Categories.
* Perform a 'list of x' search on Wikidata and possibly Wikipedia. 
* Stop multiple items from being added to a list
* Name the list before adding it to the categories
* Change the order of the items
* Add login module and route guard
* Save categories and lists to the db


## Testing useContext

When deploying the changes to add a detail page which reads the store for which detail to display, the tests failed as the good CI caught this error:

```
  TypeError: Cannot read property 'categories' of undefined
    10 |     <form className="category-list">
    11 |       <IonList>
  > 12 |         {state.categories.map((category: any, index: any) => (
       |                ^
    13 |         <IonItem key={index}>
    14 |             <RouterLink to={'/details/'+category.name}>{category.content}</RouterLink>
    15 |             <IonBadge color="success" slot="end">
```

Since the state is ultimately changed in the root parent component and then passed to the provider which then passes it to all child components, do we need to render the Categories.tsx component to make the categories available in the test?

The decision to use context is to avoid 'prop drilling' (passing down through every component in the hierarchy), so we pass the “API object” via React Context with the useContext Hook.

*jest.mock and friends are extremely helpful for many test scenarios, but context is not one of them.*

So that is out of the question.  We are supposed to test code the way it is used, which means yes, we should render the Categories.tsx component to test the Details.tsx component.

But we are not testing the Details component.  The only test right now is for the App.tsx file.

It's embarrassing, yes, but this is all there is:
```TypeScript
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

Opened issue #23 for this.  OK, and there is another test, ItemList.test.tsx.  It's time to get this project in order and get some decent tests passing.

Getting back to the App.test.tsx, using the method outlined in [this article](https://www.polvara.me/posts/mocking-context-with-react-testing-library/), this error shows up:
```
  Invariant Violation: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
  1. You might have mismatching versions of React and the renderer (such as React DOM)
  2. You might be breaking the Rules of Hooks
  3. You might have more than one copy of React in the same app
  See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.
      6 |
      7 | function renderCategories(cats: any) {
   >  8 |   const { state } = useContext(Store);
```

Since that is in a function, it's not breaking the rules of hooks.  I might be 1. or 3.
Going to that link, we see an reason for 1:
*You might be using a version of react-dom (< 16.8.0)*
Nope: "react-dom": "^16.9.0",

Number two seems unlikely as it's in a function and called at the top level.  It's also not in a class components, not called in an event handler and not called inside a function passed to useMemo, useReducer, or useEffect.  These are the rules of hooks it mentions.

It mentions a linter for these rules: *You can use the eslint-plugin-react-hooks plugin to catch some of these mistakes.*

That sounds good and is worth looking into, but would be a red herring right now.

So looking at point 3.  The link says:
```
Duplicate React
In order for Hooks to work, the react import from your application code needs to resolve to the same module as the react import from inside the react-dom package.

If these react imports resolve to two different exports objects, you will see this warning. This may happen if you accidentally end up with two copies of the react package.
```

You can run this check in the project folder to find out.
```
> npm ls react
tea@0.0.1 C:\Users\timof\repos\timofeysie\xexenes
`-- react@16.9.0
```

No duplicates there.  So what gives?

There might be other ways to have a duplicate.  For example, we have two different render sections on the page after trying out the recommended approach from the article first linked above.

import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
...
  const { state } = useContext(Store);
  return render(
    ...
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

However, doing the same using ReactDOM for the createElement() function doesn't help:
```
  const div = document.createElement('div');
  ReactDOM.render(
```

This is the app we are talking about.  I think normally you do a lot of unit testing on the app.  I might also point out that the app is running fine.  This is one of the things that brings me down about unit testing.  I like it, but not when the app runs fine, but the tests don't, and you have to spend ours fixing tests that are just supposed to be confirming app behavior, not taking on a life of their own and sucking development time.  Rant over, it's time to suck some more time with a google search.

In [a Spectrum chat](https://spectrum.chat/testing-library/general/how-i-mock-usecontext~c9402322-862e-46b4-aa8b-1aece66953cf), someone says *I would advise not to (mock the context). It's much easier to render it in your test*:
```
render(<Context.Provider value={'a value that makes sense'}><Search /></Context.Provider>)
```

*In this way your component is interactive with a real context*

The next question is, what is Context, which is answered luckily with some code:
https://github.com/iamgbayer/contributed/blob/master/src/state/context.tsx#L11

That looks like a good approach, but I have a feeling that I shouldn't be writing this kind of test for the App.tsx file.  My gut feeling is that if it('renders without crashing'), then it's job is done.  We don't want to be doing e2e testing there, and unit tests should be done on a lower component level.  How to solve this error might require a StackOverflow question to see what the community thinks about the above.

Looking at what others have tested in the App.tsx file, I found [this What's App clone](https://www.tortilla.academy/Urigo/WhatsApp-Clone-Tutorial/master/0.1.0/diff/0.2.0) that uses Apollo.
```TypeScript
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ReactDOM from 'react-dom';
import App from './App';
import { mockApolloClient } from './test-helpers';
import * as subscriptions from './graphql/subscriptions';
it('renders without crashing', () => {
  const client = mockApolloClient([
    {
      request: { query: subscriptions.messageAdded },
      result: { data: {} }
    }
  ]);
  const div = document.createElement('div');
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
```

Notice that contrary to the advice we read before, a mock is used.
However, it does not mention useContext there at all.  It is used in a different part of the app like this:
```TypeScript
const pagination = useContext(PaginationContext);
```


Here is a more interesting example:
```TypeScript
import React from 'react'
import { render } from '@testing-library/react'
import App from './App'
import { User } from './context'
import { userMock, userMockConnected } from '../__mocks__/user-mock'

describe('App', () => {
    it('renders without crashing', () => {
        const { container } = render(
            <User.Provider value={userMockConnected}>
                <App />
            </User.Provider>
        )
        expect(container.firstChild).toBeInTheDocument()
    })

    it('renders loading state', () => {
        const { container } = render(
            <User.Provider value={{ ...userMock, isLoading: true }}>
                <App />
            </User.Provider>
        )
        expect(container.querySelector('.spinner')).toBeInTheDocument()
    })
})
```
Not sure about [the source of this](https://git.berlin/oceanprotocol/commons/src/commit/a7d6af60065f26236d1f11d599de2cdb22286a23/client/src/App.test.tsx).  I thought maybe the userMockConnected file might help a bit:
```TypeScript
const userMockConnected = {
    isLogged: true,
    isLoading: false,
    isBurner: false,
    isWeb3Capable: true,
    account: '0xxxxxx',
    web3: {},
    ...oceanMock,
    balance: { eth: 0, ocn: 0 },
    network: '',
    requestFromFaucet: jest.fn(),
    loginMetamask: jest.fn(),
    loginBurnerWallet: jest.fn(),
    message: ''
}
```

Not really specific to the situation faced here, but it shows that, maybe a mock is what is needed.  Just a mock that provides a categories object might do the trick?

And looking at the error again:
```
Cannot read property 'categories' of undefined
    > 12 |         {state.categories.map((category: any, index: any) => (
```

State is the thing that is undefined.  How do people mock state in the App.test.tsx file?

Not sure why I have a problem wanting to get into Enzyme.  I guess it's dated now and that everyone is jumping on the react-testing-library, and that going back to Enzyme would be a step backwards.  Anyhow, here is an example of how this is done in with the Enzyme testing framework.
```
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() })

// incorrect function assignment in the onClick method
// will still pass the tests.

test('the increment method increments count', () => {
  const wrapper = mount(<Counter />)

  expect(wrapper.instance().state.count).toBe(0)

  // wrapper.find('button.counter-button').simulate('click')
  // wrapper.setState({count: 1})
  wrapper.instance().increment()
  expect(wrapper.instance().state.count).toBe(1)
})
```

Looking at [another example](https://stackoverflow.com/questions/57894300/how-to-access-a-specific-reducer-in-react-testing-library), it uses the same method as is used in the ItemList.test.tsx.

```
function renderWithRedux(
  { store = createStore(useState) } = {}
) {
  return {
    ...render(<ItemList store={store}></ItemList>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}
```

Why is the test commented out?  Isn't that a custom hook?  No, there is a [React Redux page talking about it on the official Testing Library docs site](https://testing-library.com/docs/example-react-redux).

But the ``` store={store}``` part causes this error:
```
Type '{ children: any; store: Store<[unknown, Dispatch<unknown>], Action<any>>; }' is not assignable to type 'IntrinsicAttributes & { children?: ReactNode; }'.
  Property 'store' does not exist on type 'IntrinsicAttributes & { children?: ReactNode; }'.ts(2322)
```

That means there are missing required properties.  React.Component definition is:
```TypeScript
interface Component<P = {}, S = {}>
```

P defines components properties and S the state. You must pass to the component all required properties defined in P.

It's a [TypeScript thing](https://charles-bryant.gitbook.io/hello-react-and-typescript/).

Would like to ignore this for the time being so that the recent changes could be deployed with the wonderful pipeline, but this is not working to skip the error:
```
{/* @ts-ignore */}
```

I'm used to skipping linting errors to get past a blocker, but never a TypeScript error.  Usually, a TS error would impact the runtime, but in this case, that's not the case.

The TS GitHub says *#21602 was not merged. You can't ignore only certain errors.*

So it's back to fixing this error.  The new Details component should have some tests also.

Regarding the issue of testing Redux hooks like *useContext*, this is actually not the issue.

As the logic goes, *By testing the user interaction rather than implementation you reduce the need for mocking, make refactoring easier, and often get a lot of extra test coverage "for free"..*

*Hooks are an implementation detail. Testing them directly, especially with this much mocking, will highly couple your tests to your implementation.*

So there should be a vanilla way to fix this test that doesn't involve Redux?  A lot of answers on StackOverflow show mocking react-redux.  The official Redux testing section says Redux is easy to test as they are pure functions.

Would that be something like this?
```TypeScript
jest.mock('react-redux', () => ({
  useDispatch: () => {},
  useSelector: () => ({
    your: 'state',
  }),
}));
```

If that was in the categories page test, I could understand it more, but this is the App.test.tsx file.

Hang on, maybe there is a problem with the app right now.  Since working only on the home page refactor and linking to the details page, the new item page has not been used.  Trying it now shows this error:
```
×
TypeError: Cannot read property 'map' of undefined
ItemList
C:/Users/timof/repos/timofeysie/xexenes/src/pages/components/items/ItemList.tsx:15
> 15 |     <ul className="todo_list">
     | ^  16 |       {state.todos.map((item: any, index: number) => (
```

I guess the item list page didn't get the memo about todos being renamed categories.  This will fix that:
```TypeScript
{state.categories.map((item: any, index: number) => (
```

Before anyone gets excited however, fixing that doesn't change the App.test.tsx:
```
TypeError: Cannot read property 'categories' of undefined
```

Given that the app works (now confirmed), and we don't want to be testing other pages in the App.test.tsx file, leaving this for now by deleting that test.  What is needed is a test for the newly created features during this refactor.  That means the details page.

But, actually, there is an issue now.  Getting rid of todos and using categories has it's own problems.

Categories is the object model for a SPAQL call, while the new items page has a list of search terms that return Wikipedia API summary results.  So there is a disconnect between the two models.  What we need is a combined model that accepts both.

Currently, there are two empty rows on the list of new items at the start.  These would be the two default categories.  The first idea in combining the two data models was to have a view that conditionally shows either of the properties that has data.

That would mean adding the summary data to the categories model.  This is what it uses right now:
```
<h5>{pageSummary["description"]}</h5>
<span>{pageSummary["extract"]}</span>
```

However, if we do this, then there will still be two default items in the list that don't have summaries.  They will need to be fetched.

One solution to this is just don't have default categories.  The user should be creating these anyhow.

But if that's the case, then we need to hurry up and store the list in Firebase otherwise the user's going to get pretty angry having to recreate the list every time the app is run.

It's hard to think about writing tests in this situation.  It's not just a refactor of code, it's brainstorming regarding how the app should work.  More sketches on napkins are needed.  Sorry if someone read this expecting a solution for how to test an app that uses Redux Hooks and is failing in the App.test.tsx file.



## Routing to a details page

We want to put pages in their own directory to contain all the related files like a feature directory structure.  I assume the CLI scaffold command would be something like this:
```
ionic generate component details/details
```

It shows this output:
```
[ERROR] Cannot perform generate for React projects.

        Since you're using the React project type, this command won't work. The Ionic CLI doesn't know how to generate
        framework components for React projects.
```

Hahaha.  OK.  Well, it was worth a try.

Creating a page by hand, it is in the Categories.tsx that the user selects and item to display the details for.  However, this is the current TS error from this line:
```
setCategories(newCategories[i]);
```

Causes this:
```
const newCategories: {
    content: string;
    name: string;
    label: string;
    language: string;
    wd: string;
    wdt: string;
    isCompleted: boolean;
}[]
Argument of type '{ content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }' is not assignable to parameter of type 'SetStateAction<{ content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }[]>'.
  Type '{ content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }' is not assignable to type '(prevState: { content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }[]) => { content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }[]'.
    Type '{ content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }' provides no match for the signature '(prevState: { content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }[]): { content: string; name: string; label: string; language: string; wd: string; wdt: string; isCompleted: boolean; }[]'.ts(2345)
Peek Problem
No quick fixes available
```

It's not very helpful unless you can remove all the specific properties there and see the error like this:
```
Argument of type '{ ... }[]>'.
Type '{ ... }' is not assignable to type '(prevState: { ... }[]) => { ... }[]'.
Type '{ ... }' provides no match for the signature '(prevState: { ... }[]): { ... }[]'.
ts(2345)
```

If that's what we wanted to do, I think we need to use the spread operator to serve as the previous state.  As it is, the summary info is fetched via either the name, label, or content property of a category.

What we need is just to route to the details page and let that page use this object to do it's stull.

Assuming you can just do something like this is a mistake:
```TypeScript
props.history.push('/details');
```

```
Categories.tsx:36 Uncaught TypeError: Cannot read property 'push' of undefined
```

Using routerLink="/details" will work to go to the new page, once the route is defined in the App.tsx router outlet.  But, since there is no parent child between pages, we can't use props to pass down the selected category.  

This method doesn't work:
```TypeScript
        <IonItem key={index} routerLink="/details"
            render={props => (<Details {...props} category={category}/>)}>
```

It gives us another sprawling TypeScript editor error:
```
Type '{ children: Element[]; key: number; routerLink: string; render: (props: any) => Element; }' is not assignable to type 'IntrinsicAttributes & Pick<IonItem, "button" | "color" | "disabled" | "lines" | "mode" | "href" | "download" | "rel" | "target" | "type" | "detail" | "detailIcon"> & { ...; } & Pick<...> & IonicReactProps & RefAttributes<...>'.
  Property 'render' does not exist on type 'IntrinsicAttributes & Pick<IonItem, "button" | "color" | "disabled" | "lines" | "mode" | "href" | "download" | "rel" | "target" | "type" | "detail" | "detailIcon"> & { ...; } & Pick<...> & IonicReactProps & RefAttributes<...>'.ts(2322)
```

Sorry, what?
```
Type '{ ...  (props: any) => Element; }' is not assignable to type 'IntrinsicAttributes & Pick<IonItem, "button" ... "detailIcon"> & { ...; } & Pick<...> & IonicReactProps & RefAttributes<...>'.
Property 'render' does not exist on type 'IntrinsicAttributes & Pick<IonItem, "button" | "color" ... "detailIcon"> & { ...; } & Pick<...> & IonicReactProps & RefAttributes<...>'.ts(2322)
```

Still doesn't help understand what's the issue there.

Also, we want to be able to share routes with params.  This means passing the category id in the route, and extracting the category object again from the state.  It might be easier to do this as a React website might, which is to use props and hierarchy.  But we are using Ionic for it's powerful mobile first approach, which means the page transitions that a mobile user expects from a native app are provided out of the box by Ionic when using the router.

Back to the link.

I don't have too much experience with the React router.  Since routerLink worked with a basic link, we should be able to pass the category like this:
```
<IonItem key={index} routerLink="/details/{category.name}">
```

But the variable is not interpolated.  Turns out we need to use template literals like this:
```
`/details/${category.name}`
```

But that doesn't work either.  Looking around, there are examples that show using a Link tag like this:
```
<Link to={`/details/${category.name}`}>{category.content}</Link>
```

But TypeScript doesn't like that:
```
JSX element type 'Link' does not have any construct or call signatures.ts(2604)
```

Given that Ionic provides a wrapper around the react-router, this may not be the way to go.  Google knows nothing about this error specific to link.

The specific example from the Ionic docs shows the same error:
```
<Link to="/dashboard/users/1">User 1</Link>
```

And there is no example of interpolation there.  Time for work now.  Will finish this part up later.

This works to change the url, but the page doesn't change.
```
import { Link as RouterLink } from 'react-router-dom';
...
<RouterLink to={category.name}>{category.content}</RouterLink>
```

This works to change the route, but the variable doesn't get interpolated.  Can't we have both?  What's going on here?

It seems like the docs didn't help to much to show what seems like a pretty basic case.  Maybe there are a few ways to do the same thing.  Anyhow, after a bit of trial and error, we get something that works that seems obvious now:
```
<RouterLink to={'/details/'+category.name}>{category.content}</RouterLink>
```

Now, on the item details page, we can use that name value to get a Wikipedia summary to display, and also, get the appropriate category and make a SPARQL call to Wikidata with the details from the category object.  Right now, the summary is in the Details page, but after we get that working, we want to move that into it's own component, and also make a component for the Wikidata info.

We could use Redux to share the state between the two pages, or we could roll our own hook.

To create a solution which shares state between components, we could create a custom Hook. *The idea is to create an array of listeners and only one state object. Every time that one component changes the state, all subscribed components get their setState() functions fired and get updated.* [source](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8).

We already have a store, with a category type based on a todo example from last year.  It might be a good idea to dust that off and put it to use here.  

We only have two actions for now:
```
PUT_DATA
OPEN_CATEGORY
```

The open category was called done todo before.  We don't really need a done, but we do need a count of how many times the category has been viewed.  So maybe a increment category action would be better.  But we are getting further away from just getting the selected category object in the details page, so one thing at a time.

We already have the app wrapped in the <StoreProvider> tag.

That is the first step from [the official docs](https://react-redux.js.org/api/hooks).  This will have to be another issue for another time.  At least with have a details page now with routing and the category in the URI.

It might be good to peruse the [original article on using Redux hooks](https://medium.com/@akshayjpatil11/implementing-redux-architecture-using-react-hooks-39b47762a2fb) that shows how to setup react-redux.

[Create an item detail page #19](https://github.com/timofeysie/xexenes/issues/19) is now halfway there.

Related to #10 Refactor the home page.

To get the category selected, other than the route param, it might be a good idea to also set the selected object in the store also, so that the details page doesn't have to loop over all the categories to get the one selected.  Just seems like a prudent thing to do.  

It will duplicate the object, which is kind of an anti-pattern, ie: storing something that you can re-generate.  Not sure what is the best practice here.  We will start with a forEach solution and replace that when the best solution emerges.

p.s. [found this discussion](https://spectrum.chat/testing-library/help/testing-redux-components-with-typescript~e578f24c-9782-41b1-818d-a5deabb03ef2) which had a great TypeScript version of the classic renderWithRedux function.




## Refactoring the home page

The initial Ionic demo had this slick to do checklist.  We don't need it anymore.  The home page needs to show a list of lists.  The create new fab button leads to the search/add to list page.  This page needs to let the user create a list from various methods and then name and add that list to the home page.

The home page list is called categories.  We will need to do some renaming of the current setup to get away from the stock todo samples used to get started a few months ago when this project source was created.

The todos are help in the store.todos.  We will skip a separate input for now to add a name to the category list.  Just take what is in the search input field and assume the user knows what they are doing by saving the list named whatever is in the field.  Probably we will make another input somewhere on that page, but this seems kind of wrong, so I'm hoping a better idea will come along.

So, how to pass the name in the input back along to the Categories list when the home page is navigated to?

I guess we could keep the categories in the store also.  But, actually, do we need Redux?  Many are questioning it now with the enlightened state of hooks in React.  On the other hand, there are a lot of Redux apps out there and jobs that assume a thorough understanding of it.  Since I code as a contractor, this matters.  Having hands on experience with Redux is still an issue.  And don't forget the awesome dev tools and state time travelling.  That has to be worth something.

So it's with this background that we need to think about a solution here.

What is the simplest solution given what we have?

The categories has JSON that is geared towards a SPARQL call to get a list of something from Wikidata.  It was never finished, but basically, that functionality needs to be in a separate component.  We want Wikidata and Wikimedia content in the new item page.

And the category component doesn't even seem to be appearing on the home page.

The work for this refactor is now broken up into three separate issues.

Item list cards click should lead to a details page

* Create an item detail page #19
* Create a page summary component #20
* Fetch a list of wikidata items for the selected category #4

THe directory structure, for better or worse, will look like this:
```
.
├── Pages
|   ├── components
|   |   ├── items
|   |   ├── summary
|   |   └── wikidata
|   ├── categories
|   ├── Details
|   ├── Home
|   ├── NewItem
```

I can see a problem already in that items contains an ItemList component.  Unless a sub category is needed there, it should be renamed item-list.  It is used on the categories and new item page

The pages seem like they should be in their own directories, and should be unit tested.  Like any good feature module, they will contain x.tsx, x.css, x.test.tsx, x.util.js type files.


## Setup a CI/CD pipeline using GitHub Actions

As with the [dynamic forms project](https://github.com/timofeysie/dynamic-forms/issues/9), having a pipeline that runs off pull requests is a great addition to a projects workflow.

We can use the same .yml file here with little else needed to set this up.

That project is not deployed on firebase, so we need to go further here and complete the CD portion of the pipeline and deploy the master branch on a successful build.

Before this, the ```npm run build``` doesn't create a build.  Here is the output:
```
> react-scripts build
/Users/tim/repos/xexenes/node_modules/@hapi/joi/lib/types/object/index.js:255
                        !pattern.schema._validate(key, state, { ...options, abortEarly:true }).errors) {
                                                                ^^^
SyntaxError: Unexpected token ...
    at Object.exports.runInThisContext (vm.js:76:16)
...
npm ERR! tea@0.0.1 build: `react-scripts build`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the tea@0.0.1 build script 'react-scripts build'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
```

So two things, by default, a new terminal on my old mac doesn't use the latest Node version.  I have to remember to run ```nvm use 12``` when starting a new terminal.

Second, use the Ionic CLI build process, since I keep forgetting, for better or for worse, this is an Ionic project.
```
ionic build --prod
```

This however also fails:
```
Cannot find module: 'firebase/app'. Make sure this package is installed.
You can install this package by running: npm install firebase/app.
[ERROR] An error occurred while running subprocess react-scripts.
        react-scripts build exited with exit code 1.
        Re-running this command with the --verbose flag may provide more information.
```

Not sure why it suggests ```npm install firebase/app```
```
Cannot find module: 'firebase/app'.
```

There is not much on Google/GitHub/StackOverflow on this.  There are more Angular answers as Ionic has been until recently Angular only.  It might be a TypeScript mismatch, but I am once again reconsidering using Ionic at all for this project.

Starting a new React project with Ionic 5 and running ionic build --prod completes without error, so this may be an option.  The other option is just a vanilla create-react-app version.

It could be an Ionic/React/Typescript/Firebase disconnect that

Using Node v12.9.1.
The latest Stable release: 13.8.0 / February 6, 2020; 10 days ago

Also get the latest Ionic CLI:
```
npm uninstall -g ionic
npm install -g @ionic/cli
```


The [docs](https://ionicframework.com/docs/react/pwa) say:
***ionic build --prod and the www directory will be ready to deploy as a PWA.***

So it's not the public directory.  That means we need to change the firebase.json file to this:
```
"hosting": {
  "public": "www",
```

May as well get the latest Firebase tools also:
```
npm install -g firebase-tools
```

But wait, one of the firebase init questions is:
*"What do you want to use as your public directory?" Enter "build".*

The docs show this firebase.json:
```
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

Aside from the deployment file, with the above updates, the build still fails:
```
$ ionic build --prod
> react-scripts build
Creating an optimized production build...
Failed to compile.
./src/index.tsx
Cannot find module: 'firebase/app'. Make sure this package is installed.
You can install this package by running: npm install firebase/app.
[ERROR] An error occurred while running subprocess react-scripts.
        react-scripts build exited with exit code 1.      
        Re-running this command with the --verbose flag may provide more information.
```

The suggestion:
```
npm install firebase/app
npm ERR! Error while executing:
npm ERR! /usr/local/bin/git ls-remote -h -t ssh://git@github.com/firebase/app.git
npm ERR! Warning: Permanently added the RSA host key for IP address '13.237.44.5' to the list of known hosts.
npm ERR! git@github.com: Permission denied (publickey).
npm ERR! fatal: Could not read from remote repository.
npm ERR! Please make sure you have the correct access rights
npm ERR! and the repository exists.
npm ERR! exited with error code: 128
```

Strange that permissions are need to install a package.  Push to a repo, yes.  I can push to the GitHub repo fine.  I'm pretty sure that command should be:
```
npm install @firebase/app
```

Then the error changes:
```
$ ionic build --prod
> react-scripts build
Creating an optimized production build...
Failed to compile.
/Users/tim/repos/xexenes/src/index.tsx
TypeScript error in /Users/tim/repos/xexenes/src/index.tsx(23,1):
Cannot find name 'serviceWorker'. Did you mean 'ServiceWorker'?  TS2552
    21 | ReactDOM.render(<StoreProvider><App /></StoreProvider>, document.getElementById('root'));
    22 |
  > 23 | serviceWorker.register();
       | ^
[ERROR] An error occurred while running subprocess react-scripts.      
        react-scripts build exited with exit code 1.
```

That's a different issue, with the service worker PWA code from the docs linked to above.

Going without that to see how the build goes now.

The build works:
```
The project was built assuming it is hosted at the server root.
You can control this with the homepage field in your package.json.
For example, add this to build it for GitHub Pages:

  "homepage" : "http://myname.github.io/myapp",

The build folder is ready to be deployed.
You may serve it with a static server:
  npm install -g serve
  serve -s build
Find out more about deployment here:
  https://bit.ly/CRA-deploy
```

Firebase deploy works now, and we have our hosting.  Next, create the CI/CD pipeline to put it to good use.

At first, replacing npm with Ionic causes this error on GitHub:
```
ionic: command not found
```

I suppose npm build will do.  Next, the CD part of the pipeline.

*FIREBASE_TOKEN - Required if GCP_SA_KEY is not set. The token to use for authentication. This token can be acquired through the firebase login:ci command.*

This will return a token upon successful login.  Now, regarding that ```secrets.FIREBASE_TOKEN```...  It needs to be added to the repos [secrets](https://github.com/timofeysie/xexenes/settings/secrets/new).

```
Run npm run build-prod
npm ERR! missing script: build-prod
npm ERR! Did you mean this?
npm ERR!     build
```

Whoops!  And another whoops:
```
@github-actions
github-actions
/ Build
.github
Path does not exist /home/runner/work/xexenes/xexenes/dist
```

Change that to build and getting this check failure:
```
.github/workflows/continuous-deployment.yml
Invalid Workflow File
DETAILS
every step must define a uses or run key
```

Errors that are on line one but not on line one are annoying.  I guess this is a yaml thing.


## Creating a new list

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

This is what works to add the whole response object:
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

But for us, in this case, it as a new Redux Hook, not our own defined constant.  The same solution doesn't work:
```
setTodo(e.target.value as HTMLElement)
```

The error over 'e' would then change to:
```
Argument of type 'HTMLElement' is not assignable to parameter of type 'SetStateAction<string>'.
  Type 'HTMLElement' is not assignable to type 'string'.ts(2345)
```

Tried this shenanigan:
```
setTodo(e.target.value !== null ? e.target.value : ''
```

Using a regular input works fine.  But then, the add todo action has the impressive ability to refresh the app.  This is getting interesting!

Using IonInput causes an "Object is possibly 'null'" error on the event arg.

Using an IonButton causes a page refresh.  Are these bugs in the Ionic React implementation?  Quick, take me to their GitHub!



## Implement categories from a static list

This is part of issue #3.

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

Not sure why you can't just write on one line:
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

That's TypeScript.  We have also been getting issues like this:
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


### Build the components, *the Billion Dollar Mistake* and page refreshing buttons

Adding the put and done functions to the new item component was pretty easy.  But in the template we run into this error:
```html
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
```JavaScript
onClick={(e) => doneTodo(e.target as HTMLElement)}
```

StackOverflow says: *HTMLElement is the parent of all HTML elements, but isn't guaranteed to have the property value. TypeScript detects this and throws the error. Cast event.target to the appropriate HTML element to ensure it is HTMLInputElement which does have a value property ([source](https://stackoverflow.com/questions/44321326/property-value-does-not-exist-on-type-eventtarget-in-typescript/44321394))*

But unfortunately, none of those fixes worked.  This does, but then the vague type 'any' is pushed into the function:
```TypeScript
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

But for us, in this case, it as a new Redux Hook, not our own defined constant.  The same solution doesn't work:
```
setTodo(e.target.value as HTMLElement)
```

The error over 'e' would then change to:
```
Argument of type 'HTMLElement' is not assignable to parameter of type 'SetStateAction<string>'.
  Type 'HTMLElement' is not assignable to type 'string'.ts(2345)
```

Tried this shenanigan:
```
setTodo(e.target.value !== null ? e.target.value : ''
```

Using a regular input works fine.  But then, the add todo action has the impressive ability to refresh the app.  This is getting interesting!

Using IonInput causes an "Object is possibly 'null'" error on the event arg.

Using an IonButton causes a page refresh.  Are these bugs in the Ionic React implementation?  Quick, take me to their GitHub!

They have [about 800 issues](https://github.com/ionic-team/ionic/issues) on the Ionic project.  Is it worth the effort?

Maybe we should try the latest release.

Remember, this project is currently working with ^4.9.0-rc.2.  The latest is 4.11.8.
```
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


## SPARQL

This is the language used to get data from the WikiData project.

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

Simplicity is difficult.  It could be that classes encourage inheritance, which, with the drive to reduce repetition in code leads to complex code bases where the depth of a class hierarchy makes code hard to reason about.

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
