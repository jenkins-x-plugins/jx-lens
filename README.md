# Lens Extension for working with Jenkins X

This extension improves the UX around working with pipelines and preview environments.

## Install

```sh
mkdir -p ~/.k8slens/extensions
git clone https://github.com/jenkins-x-plugins/jx-lens.git
ln -s $(pwd)/jx-lens ~/.k8slens/extensions/jx-lens
```

## Build

To build the extension you can use `make` or run the `npm` commands manually:

```sh
cd jx-lens
make build
```

OR

```sh
cd jx-lens
npm install
npm run build
```
 
### Incremental building

If you want to watch for any source code changes and automatically rebuild the extension you can use:

```sh
npm start
```
       
Once the extension has been rebuilt inside `Lens` you can click on the `View -> Reload` menu item (or `R' keypress) to reload to see the new changes.

## Testing

To run the lint and unit tests, type:

```bash
npm test
```

### Linting

> The formatting [rules](https://github.com/lensapp/lens/blob/master/.eslintrc.js) are inherited from [lensapps](https://github.com/lensapp) to match the _Lens Extension_ ecosystem. At this time, only the `include-header` rules have been disabled.

To run only linting, type:

```bash
npm run lint
```

OR

To auto-fix lint issues, type:

```bash
npm run lint:fix
```

Open Lens application and navigate to a cluster. You should see "Certificates" in a menu.

## Uninstall

```sh
rm ~/.k8slens/extensions/jx-lens
```

Restart Lens application.
