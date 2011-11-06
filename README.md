This is a fork of @fofr's script

# Testing Matching media queries with transitions.

## Drawbacks
- needs a new element for testing a new query. That can easily get out of hand, and I don't like ruining the DOM with wasteful elements.
- each new element needs to have a listener for `transitionEnd`.
- traversing two media query boundaries will trigger two callbacks not one (e.g. going from > 1200px to < 700px in `index.html`).

## Advantages
- `transitionEnd`, no need to loop or keep listening to events!
- uses built-in CSS media queries.

## Thoughts to ponder

- Using a single element would not work because you can't detect multiple mqs on them at once (unless you transition a different property for each mq but you could run out of properties!)

- Could you use a single element but keep creating/destroying elements later?