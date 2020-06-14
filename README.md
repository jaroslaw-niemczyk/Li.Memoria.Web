##Li.Memoria.Web project bundle
The bundle contains: 
- jQuery
- Bootstrap 
- React
- Li.Memoria repeat component

## How to dev
To expose components outside webpack bundle and still use a [Create React App ](https://create-react-app.dev/) without ejecting them, 
wrap each component you want to render into a separate function and assign as a window object method.
```
window.renderRepeatComponent = (): void => {
  const repeat = document.getElementById('repeat');
  if (repeat) {
    ReactDOM.render(
      <React.StrictMode>
        <Repeat
          question={repeat.dataset.question || ''}
          answer={repeat.dataset.answer || ''}
          editUrl={repeat.dataset.editUrl || '#'}
        />
      </React.StrictMode>,
      document.getElementById('repeat'),
    );
  }
};
```

## How to use:
Main layout: (symfony - twig):
```
<script src="{{ asset('build/runtime-main.XXX.js'"></script>
<script src="{{ asset('build/2.9cd3251d.chunk.js') }}"></script>
<script src="{{ asset('build/main.1dd31c59.chunk.js') }}"></script>
```

Repeat page:
```
<script type="text/javascript">
window.renderRepeatComponent();
</script>
```

##Todo 
 - setup jest/enzyme 
 - write unit tests
