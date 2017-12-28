import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/app';

function doRender() {
  ReactDOM.render(
    <Root />,
    document.getElementById('main'),
  );
}

// The <Root> component.  We'll run this as a self-contained function since
// we're using a bunch of temporary vars that we can safely discard.
//
// If we have hot reloading enabled (i.e. if we're in development), then
// we'll wrap the whole thing in <AppContainer> so that our views can respond
// to code changes as needed
const Root = (() => {
  // Wrap the component hierarchy in <BrowserRouter>, so that our children
  // can respond to route changes
  const Chain = () => (<App />);
  return Chain;
})();

doRender();
