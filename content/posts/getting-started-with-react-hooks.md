---
title: Getting Started with React Hooks
date: '2024-07-28'
author: Alex Doe
excerpt: A comprehensive beginner-friendly guide to understanding and effectively using React Hooks such as useState, useEffect, and more for state management and side effects in functional components.
tags: React, JavaScript, Frontend, Hooks, State Management
imageUrl: https://picsum.photos/seed/react-hooks-post/800/450 
---

# Getting Started with React Hooks

React Hooks, introduced in React 16.8, allow you to use state and other React features without writing a class. They provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle.

## Why Hooks?

Hooks solve a wide variety of seemingly unconnected problems in React that we’ve encountered over five years of writing and maintaining tens of thousands of components. 
- **Reusing stateful logic:** Hooks allow you to extract stateful logic from a component so it can be tested independently and reused.
- **Complex components become hard to understand:** Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data), rather than forcing a split based on lifecycle methods.
- **Classes confuse both people and machines:** Hooks let you use more of React’s features without classes.

## Basic Hooks

### `useState`

Allows you to add React state to function components.

```javascript
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### `useEffect`

Lets you perform side effects in function components. It's a close replacement for `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into one API.

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    // ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      // ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, []); // If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array ([]) as a second argument.

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
(Note: The `ChatAPI` calls in the example above are illustrative and would need a mock or actual implementation to run.)

## Rules of Hooks

- Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions.

Happy Hooking!