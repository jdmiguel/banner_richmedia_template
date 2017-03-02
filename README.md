## RICHMEDIA PLUGIN JAVASCRIPT

### DESCRIPTION

This repository provides a javascript plugin (no JQUERY) for developing richmedia banners. When you try this, you will check how your **production performance** has been improved.

### REQUERIMENTS

Before starting, you need to save images to the banner size (as .png or .jpg) because in the template, the images are positioned absolutely, in left 0 and top 0...
Furthermore, you need to know the [GSAP] (https://greensock.com/gsap) libraries because this template use those for animating.

### LAYOUT

You shouldn´t be worry with the banner layout. The only thing you have to do is *customizing the data attributes of the div that contains the banner*.

### CUSTOMIZING IMG AND VIDEO PATH

The only thing you have to do is introducing the correct path in the vars (imgPath and videoPath).

### CUSTOMIZING THE FRAME OBJECT

This object creates the layout inside the wrap container.

Firstly, You should decide the frames number of your banner (it depends on the animation). Once you have decide it, you must choose the frame order into frame object for positioning the div have been created (with an id equal to name of the frame that you have choosen) inside the banner container div. Finally, you have to push into the frame array the image src for each image you going to use and you have to put in the correct order for positioning into each frame.

### CUSTOMIZING THE CLICKTAG

A function called *clicktagFunction* where you can put the clicktag code.

### CUSTOMIZING THE VIDEO OBJECT

This object creates the div that contains the differents video assets such as the img poster, the video tag and the source tag. You have to customize the next properties:

* PLAYERWIDTH: **The player width**
* PLAYERHEIGHT: **The player height**
* PLAYERPOSITIONS: **The player positions** in x and y
* CONTAINERID: **The id of the video container**
* CONTAINERAUTOALPHA: If this value is zero, **the video container sets its opacity** to zero **and its visibility** to hidden.
* CLICKTAGFUNCTION: **The clicktag function**.
* ARRAYEXTENSIONS: **The differents files of video** that going to be used.
* ARRAYIDVIDEOS: **The id of every video**.
* ARRAYBTNSRC: **The file name of every video button**.
* ARRAYBTNPOSX: **The x position of every video button**.
* ARRAYBTNPOSY: **The y position of every video button**.

### CUSTOMIZING THE TIMELINE OBJECT

This object creates a specific timeline based in the [GSAP TIMELINEMAX] (https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/).

At the beginning, there are some properties such as the initial label which the timeline starts or the loops number of the banner...
After, there is the tweens array. It´s really the hard job... For each element of this array you have the next properties:

* TYPE: This is the *main [TWEENMAX] (https://greensock.com/docs/#/HTML5/GSAP/TweenMax/) method*. You can choose between **set, to, from or fromTo**.
* ID: **The object id**. It´s been composed with *the hash symbol plus the name of the correspondent image src*, without the extension (.png or .jpg). For instance: *'#txt1'*
* TIME: It´s **the animation duration**. It only works with the to, from and fromTo types.
* PROP: **The properties have been changed across the tweens**. In the case of the fromTo type, you must customize both initial and ending properties.
* DELAY: **The delay time of the tween**.
