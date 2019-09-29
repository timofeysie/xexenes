# Xexenes

This is an Ionic React app to consume a WikiData list API.

Ionic recently released their first official React based framework.  So this project is to explore it with the same functionality implemented in a string of projects starting a year ago that compared and contrasted React, Angular, React Native, Ionic, Electron and other approaches.

## The Rules of Hooks

These are major rules we must always follow.

1. Never call Hooks from inside a loop, condition or nested function
2. Hooks should sit at the top-level of your component
3. Only call Hooks from React functional components
4. Never call a Hook from a regular function
5. Hooks can call other Hooks

Why hooks?  To win the fight against evil classes that tend to pollute our codebase.  Wait, what???
The stated dream of hooks is *to create and share small, re-usable and maintainable pieces of logic in our applications without nesting some more into the components tree. No mixins, no higher-order components, no render props craziness.*

A developer at my previous role told me "classes are gross!".  Since we used Angular there, and he was a React developer, it was confusing.  He was actually part of the backend serverless API making team.  I asked him a question about some RxJs observable issue I was having and he said he couldn't help.  Like most developers, they only know one world, and don't flit between worlds in a time wasting frivolous manner like I do.  So I justified that and thought that certainly he didn't mean *Angular classes*, as the whole Angular framework is based on classes.

So then why are React developers so down on classes, and what is wrong with React classes?  React still needs classes from some things, such as lifecycle hooks, like componentDidCatch and getSnapshotBeforeUpdate.  But even in the future these are said to become part of the Hooks API really soon.

If there is a non-existing battle between Hooks and classes, what does a developer do?

Simplicity is difficult.  It could be that classes encourage inheritance, which, with the drive to reduce repetition in code leads to complex code bases where the depth of a class heirachy makes code hard to reason about.

From the [React webpage](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks):
*To reduce the boilerplate, we recommend using react-testing-library which is designed to encourage writing tests that use your components as the end users do.*

That's all well and good.  For me, it comes down to available jobs in Sydney.  70% React vs. about 30% Angular.  So to be considered for a larger selection of jobs, React is essential.  If those jobs include hooks, then I need hooks.  The problem is, probably existing code base jobs outweigh greenfield jobs, so a knowledge of Redux is also needed.

Having debates like this are fine, but it's taking me away from writing code.

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
