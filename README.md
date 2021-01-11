# Empires and Allies map editor
A simple and inefficient p5.js map editor to get a JSON map file.

## Simple and Incomplete How to Use guide

#### Warning
- The code is not optimized.
- Project files are not compatible with the game save files.
- There is no simple way (yet) to convert a game save file to a project file, so you need to start the project from scratch.

### How to use it
- To use it: Download the github files, then open the `empire_editor.html` on a browser. I've used it with Chrome, but any browser running JS should work.
- The ***top menu*** has (from left to right):
     - **MAIN section:**
        - *Object Selector*: The object you want to place. Not all of them in there...
        - *Custom Object code-name*: if you set that to something, this will override the current *Object Selector*.
        - *Automatic ID*: This is the object ID that will be used for the next object. It auto-increments. 
        - *Search for Objects*: If you don't know the code-name of an object, you can maybe find it here. (It's not complete at all)
    - **PROJECT section:** (deprecated)
        - *Save*: it saves the project, both on Browser cookies and in a downloaded project file. 
        - *Load*: it loads the project form the Browser cookies.
        - *Load file*: it loads the project file selected.
    - **MAP JSON section:**
        - *Download*: It will download a file with the map in a compatible format for the Empires and Allies save files like `initial-island.json` or `Steele-island.json`. (You can also find it at the very end of the page being dinamically generated). You can paste it in the map save.
        - *Experimental Load*: It will load a JSON file with the map in a compatible format for the Empires and Allies save files like `initial-island.json` or `Steele-island.json`.
