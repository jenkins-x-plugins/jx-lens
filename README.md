# Lens Extension for working with Jenkins X

This extension improves the UX around working with pipelines and preview environments.

## Install
1. Go to the **File** (or Lens on macOS) > **Extensions** in the application menu
2. Enter the following URL into the **Install Extension** input field and **Click on Install Button**
   ```
   @jenkins-x-plugins/jx-lens
   ```
3. make sure the extension is Enabled



## Setting up locally for development

### Download source code & Setup extension
```sh
mkdir -p ~/.k8slens/extensions
git clone https://github.com/jenkins-x-plugins/jx-lens.git
ln -s $(pwd)/jx-lens ~/.k8slens/extensions/jx-lens
```

### Build

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
 
#### Incremental building

If you want to watch for any source code changes and automatically rebuild the extension you can use:

```sh
npm start
```
       
Once the extension has been rebuilt inside `Lens` you can click on the `View -> Reload` menu item (or `R' keypress) to reload to see the new changes.

### Test

Open Lens application and navigate to a cluster. You should see "Certificates" in a menu.

## Uninstall

```sh
rm ~/.k8slens/extensions/jx-lens
```

Restart Lens application.
