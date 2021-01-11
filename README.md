# Empires and Allies map editor
A simple and inefficient p5.js map editor to get a JSON map file.

## Simple and Incomplete How to Use guide

#### Warning
- The code is not optimized.
- Game save files are not fully compatible, except for `initial-island.json` and `Steele-island.json`.
- Object properties are ignored on loading a JSON map.

### How to use it
- To use it: Download the github files, then open the `empire_editor.html` on a browser. I've used it with Chrome, but any browser running JS should work.
- The ***top menu*** has (from left to right):
     - **MAIN section:**
        - *Object Selector*: The object you want to place. Not all of them in there...
        - *Custom Object code-name*: if you set that to something, this will override the current *Object Selector*.
        - *Automatic ID*: This is the object ID that will be used for the next object. It auto-increments. 
        - *Search for Objects*: If you don't know the code-name of an object, you can maybe find it here. (It's not complete at all)
    - **COOKIE section:**
        - *Save*: it saves the project on Browser cookies. 
        - *Load*: it loads the project form the Browser cookies.
    - **MAP JSON section:**
        - *Download*: It will download a file with the map in a compatible format for the Empires and Allies save files like `initial-island.json` or `Steele-island.json`. (You can also find it at the very end of the page being dinamically generated). You can paste it in the map save.
        - *Experimental Load*: It will load a JSON file with the map in a compatible format for the Empires and Allies save files like `initial-island.json` or `Steele-island.json`.
