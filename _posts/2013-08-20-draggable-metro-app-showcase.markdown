---
layout: post
demo: "draggable-metro-app-showcase"
repo: "draggable-metro-app-showcase"
title:  "Draggable Metro App Showcase"
image: "draggable-metro-app-showcase-header.png"
---

<p class="size-2x">Today I'd like to share with you an interactive and touch-optimized metro app showcase concept for showcasing a metro (probably a Windows Phone) app screenshot. The screenshot will be draggable and swipable, and you'll have a couple of extra options to view how the app would look like in a mobile phone frame.</p>

<p class="note warning">Please note that this demo works only in browsers that support the Javascript objects and APIs used. I provided a couple of polyfills but the demo will only work in browsers that these polyfills provide fallback for. See the <a href="#javascript">Javascript section</a> for details.</p>

<p>This demo is inspired by the big number of <a href="http://dribbble.com/search?page=2&q=windows+phone+app">dribbble shots</a> showcasing Windows phone app concepts, so I thought I'd recreate this showcasing concept and add some interactivity to it.</p>

<p>The <a href="http://dribbble.com/shots/1006346-Flat-Lumia-920-Mockup-Free-PSD">Flat Lumia Phone PSD Mockup</a> used in the demo is by Corey Ginnivan from Dribbble. I provided two colors in the demo resources, a red and a white frame.</p>

### The Markup

<p>We'll wrap our showcase in a <code>as-wrapper</code> wrapper, which will contain a container for the mobile frame + app screenshot, and a section for the app description which will appear at some point during the interaction (we'll get to that in a moment).</p>

<p>The mobile frame and the screenshot will be positioned absolutely. The frame needs to be positioned absolutely to overlap the screenshot, and the screenshot will be positioned this way too so that we can change its position via Javascript.</p>

<p>The phone frame we're using has 3 buttons in its lower section, <strong>what we're going to do is we're actually doing to add 3 buttons <em>on top</em> of these buttons with a transparent background, so that it seems like these built-in buttons are clickable</strong>. And then we're also going to add two <stront>navigation arrows to the right of the frame to scroll the screenshot left and right</strong>.</p>

<p><strong>The left-most arrow on the phone frame will scroll the app screen to the left to get it completely inside the boundaries of the phone frame. The windows button will scroll it back out to its initial position. The magnifier will launch the "focus" mode of the showcase, and the left and right navigation arrows will scroll the screenshot left and right respectively</strong>.</p>

<pre class="brush:html;">
&lt;div class="as-wrapper"&gt;
    &lt;div class="as-container"&gt;
        &lt;div class="as-frame preventSelect" id="as-frame"&gt;
            &lt;img src="images/lumia-red.png" alt="Omnia Phone Frame" /&gt;
        &lt;/div&gt;
        &lt;div class="as-instructions" id="as-instructions"&gt;
             &lt;p&gt;Drag or swipe app screenshot left and right with your mouse or finger.&lt;/p&gt;
            &lt;p&gt;Use buttons at the bottom of the frame to scroll screen and focus mobile frame.&lt;/p&gt;
            &lt;button&gt;Got it!&lt;/button&gt;
        &lt;/div&gt;
        &lt;div class="as-nav-buttons" id="as-nav-buttons"&gt;
            &lt;button class="as-button as-nav-button as-left-nav-button preventSelect" id="as-left-nav-button"&gt;&lt;img src="images/nav-arrow-left.png" alt="Left"&gt;&lt;/button&gt;
            &lt;button class="as-button as-nav-button as-right-nav-button preventSelect" id="as-right-nav-button"&gt;&lt;img src="images/nav-arrow-right.png" alt="Right"&gt;&lt;/button&gt;
        &lt;/div&gt;
        &lt;button class="as-button as-slide-button preventSelect" id="as-slide-button"&gt;&lt;/button&gt;
        &lt;button class="as-button as-reset-button preventSelect" id="as-reset-button"&gt;&lt;/button&gt;
        &lt;button class="as-button as-focus-button preventSelect" id="as-focus-button"&gt;&lt;/button&gt;

        &lt;div id="draggable" class="as-screen preventSelect"&gt;
            &lt;img src="images/app-screen.jpg"&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="as-app-description preventSelect" id="as-app-description"&gt;
        &lt;h2&gt;Your awesome app features and upsell&lt;/h2&gt;
                
        &lt;p&gt;Minima vero quibusdam error accusamus explicabo commodi deleniti ipsa debitis enim quae tempore molestias veritatis. Quo saepe voluptatibus officiis debitis necessitatibus magnam id possimus maxime atque amet. Officiis cupiditate deserunt!&lt;/p&gt;
        &lt;p&gt;Minima vero quibusdam error accusamus explicabo commodi deleniti ipsa debitis enim quae tempore molestias veritatis.&lt;/p&gt;
        &lt;p&gt;Minima vero quibusdam error accusamus explicabo commodi deleniti ipsa debitis enim quae tempore molestias veritatis.&lt;/p&gt;
        &lt;a href="#"&gt;
            &lt;img src="images/ws-button.png" alt="Download App from Windows Store" class="download-button" id="download-button"/&gt;
        &lt;/a&gt;
    &lt;/div&gt;
&lt;/div&gt;
</pre>

<p>You have probably noticed the class <code>preventSelect</code> that I adde to almost all elements, especially those inside the <code>as-container</code>. What this class does is that it prevents these elements (via CSS) from being selected, otherwise selected elements will get in the way of the drag action and things will get messy!</p>

### The CSS

<p>I'll go over the styles quickly. All styles are basic and easy to understand so I won't be getting into too much detail. The "heart" of this demo is the Javascript part, the CSS is simple and pretty straightforward. I added comments to the CSS code where necessary. We'll start with the general styles relevant to the demo.</p>

<pre class="brush:css;">
              /* lazy reset :) */
              *{
                /*box sizing should be border box on .as-frame and .as-screen otherwise js calculations will need to change to include padding*/
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                list-style: none;
              }
              body {
                background: #F0E9DD url("../images/02.jpg") repeat;
                color:#eee;
                font: 300 1.2em "Source Sans Pro", sans-serif;
                overflow-x: hidden;
              }
              /* cross-browser prevent user select: http://stackoverflow.com/a/4358620 */
              .preventSelect {
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }
              .as-wrapper{
                width:95%;
                margin:0 auto;
                min-height:550px;
                position:relative;
              }
              .as-container {
                position: relative;
                height: 550px;
                width: 1300px;
                overflow: hidden;
                margin:20px auto;
                transition: width .6s ease;
              }
              /*class will be added via Javascript to shrink the frame + screenshot container and center it*/
              .shrink{
                width:297px;
              }
            </pre>

<p>So far all styles are obvious and straight forward. The frame and screenshot container is given a height equal to the height of the phone frame (simply because we don't need it to be bigger than that), and now we'll move on to the frame and screenshot styles.</p>

<pre class="brush:css;">
              /*div containing the app screenshot*/
              .as-screen {
                height: 75.6%;
                width: 1190px;
                top: 8.5%;
                left:0;
                position: absolute;
                cursor: move;
                cursor:grab;
                cursor:-moz-grab;
                cursor:-webkit-grab;
                z-index: 1;
                overflow: hidden;
                transition: all .5s ease-out;
              }
               /*app screenshot*/
              .as-screen img{
                pointer-events:none;/*to prevent image being dragged and interfering with the screen drag*/
              }
              /*div containing the phone frame*/
              .as-frame {
                position: absolute;
                z-index: 1;
                left: 0;
                width: 300px;
                height:550px;
                z-index: 2;
                pointer-events:none;
              }
              /*the phone frame*/
              .as-frame img{
                width:100%;
                pointer-events:none;
              }
              .as-instructions{
                position: absolute;
                top:100px;
                left:50px;
                width:200px;
                padding:20px;
                color:white;
                background:rgba(0,0,0,0.75);
                z-index:20;
                pointer-events:none;
              }
              .as-instructions button{
                background: none; 
                border:none;
                background-color: #B33E41;
                color:white;
                padding:5px 10px;
                margin-top:15px;
              }
            </pre>

<p>Note that we need to set the pointer events on the frame to none to make sure it doesn't block the events on the screenshot.</p>

<p>Now we'll style and position the control and navigation buttons.</p>

<pre class="brush:css;">
              .as-slide-button, .as-reset-button, .as-focus-button{
                width:40px;
                height:40px;
                position:absolute;
                bottom:48px;  
                left:30px;
                background:none;
                border:none;
                cursor:pointer;
                z-index:20;
              }
              .as-reset-button{
                left:130px;
              }
              .as-focus-button{
                left:225px;
              }
              .as-nav-buttons{
                height:30px;
                position:absolute;
                bottom:30px;
                left:320px;
                z-index:20;
              }
              .as-nav-button{
                width:40px;
                height:40px;
                background:none;
                border:none;
                color:black;
                text-align:center;
                cursor:pointer;
              }
            </pre>

<p>Last thing we're going to style is the description section which will appear when the screenshot has been dragged fully into the inside of the phone frame.</p>

<pre class="brush:css;">
              /*initially the description will be hidden with opacity set to 0*/
              .as-app-description {
                opacity: 0;
                width:100%;
                position:absolute;
                right:0;
                top:0;
                bottom:0;
                margin: 5% 0;
                padding: 0 50px 0 450px;
                transition: opacity .3s ease-out;
              }
              .as-app-description h2{
                margin-bottom:1em;
              }
              /*this class will be added via Javascript to show the description*/
              .visible-description {
                opacity: 1;
              }
              .download-button {
                margin: 30px 0;
              }
            </pre>

<p>We'll make the demo as responsive as possible. I'm saying "as responsive as possible" because a draggable showcase like this will look best on big/desktop screens, because of the width of the screenshot, but we'll make it work for all screen sizes. :)</p>

<pre class="brush:css;">
              @media screen and (max-width: 64em){
                .as-app-description{
                  padding-left:380px;
                }
              }
              @media screen and (max-width: 50em){
                .as-wrapper{
                  padding:1%;
                }
                .as-app-description{
                  position:static;
                  margin-top:100px;
                  padding:0;
                  opacity:1;
                }
              }

              @media screen and (max-width: 30em){
                .as-container{
                  width:297px;
                  margin:30px auto;
                }
              }
            </pre>

<p>On small screens we'll let the screenshot remain inside the phone frame with overflow set to hidden on the container.</p>

<p>That's pretty much it for the styles. Now let's move on to the interactive part!</p>

<h3>The Javascript</h3>

<p>OK, first things first: polyfills and plugins. For starters, I won't be using any JS framework, we'll be going vanilla.</p>

<p>I'll be using the awesome Javascript <a href="http://html5doctor.com/the-classlist-api/">classList API</a>, which is <a href="http://caniuse.com/classlist">not fully supported in all browsers</a>, but it's awesome so I'll be using it anyway, and I'll add <a href="https://github.com/eligrey/classList.js">Eli Grey's classList polyfill</a> which works in IE8, and provides basic classList.add(), classList.remove(), and classList.toggle() support (which is more than enough for this demo) to at least as far back as Android 2.1.</p>

<p>For browsers that don't support <code>addEventListener</code>, I'll be using <a href="https://github.com/jonathantneal/EventListener/">Jonathan Neal's eventListener polyfill</a>.</p>

<p>Finally, I'll be using <a href="http://eightmedia.github.io/hammer.js/">Hammer.js</a> to add touch swipe support for the draggable screenshot.</p>

<p>We'll start by caching some variables and initializing others with some basic calculations which we'll need throughout the code.</p>

<pre class="brush:js;">
              (function(){
                  var el = document.getElementById('draggable'),
                    //get screen width and offset..
                      elWidth = parseInt(window.getComputedStyle(el,null)['width']),
                      elLeft = el.offsetLeft,
                    //..use those to calculate right offset
                      elRight = elLeft + elWidth,
                    //do the same for the phone frame
                      frame = document.getElementById('frame'),
                      frameLeft = frame.offsetLeft, 
                      frameWidth = parseInt(window.getComputedStyle(frame,null)['width']),
                      frameRight = frameLeft + frameWidth,
                    //cache app description and control and navigation buttons 
                      desc = document.getElementById('as-app-description'),
                      scrollInButton = document.getElementById('as-slide-button'),
                      resetButton = document.getElementById('as-reset-button'),
                      focusButton = document.getElementById('as-focus-button'),
                      leftNavButton = document.getElementById('as-left-nav-button'),
                      rightNavButton = document.getElementById('as-right-nav-button'),
                    //instruction that appears at beginning of demo
                      tip = document.getElementById('as-instructions'),
                    //cache container
                      container = el.parentNode;
            </pre>

<p>wow that's a lot! so what exactly are all those needed for?</p>

<p>First, I cached all DOM elements that we're going to listen for events on so we can attach event handlers to them next. Then, I determined the left and right offsets for each of the draggable screen and the mobile frame, because we'll be needing these for the scrolling and dragging functions. The right offset is calculated by adding the left offset to the width of the element.</p>

<p>Next, we'll attach event listeners to the control and navigation buttons, and we'll also add the swipe support with Hammer.js.</p>

<pre class="brush:js;">
              //call the scrollScreen function when the screen is swiped left or right
              var scrollLeftOnSwipe = Hammer(el).on("swipeleft", function(event) {
                  scrollScreen(220, 'left');
                  hideTip();
              });
              var scrollRightOnSwipe = Hammer(el).on("swiperight", function(event) {
                  scrollScreen(220, 'right');
                  hideTip();
              });

              scrollInButton.addEventListener('click', function(){
                  scrollScreen(elWidth, 'left');
              }, false);
              leftNavButton.addEventListener('click', function(){
                  scrollScreen(220, 'left');
              }, false);
              rightNavButton.addEventListener('click', function(){
                  scrollScreen(220, 'right');
              }, false);
              resetButton.addEventListener('click', resetScreen, false);
              focusButton.addEventListener('click', focusFrame, false);
            </pre>

<p>The <code>scrollScreen(val, dir)</code> function takes in two arguments: a <code>val</code> which is the amount (in px) by which we want to scroll the screen, and a <code>dir</code> which determines the direction in which we want to scroll it.</p>

<pre class="brush:js;">
              function scrollScreen(val, dir){
                hideTip();
                var left = el.offsetLeft;

                if(dir == 'left'){
                    var deltaRight = elRight - frameRight;
                    if(deltaRight >= val){
                        left -= val;
                    }
                    else{
                        left -= deltaRight + 5;
                    } 
                }
                else if(dir == 'right'){
                    var deltaLeft = frameLeft - left;
                    if(deltaLeft >= val){
                        left += val;
                    }
                    else{
                        left += deltaLeft;
                    }
                }

                if(left <= frameLeft && elRight >= frameRight - 5){
                    el.style.left = left + 'px';
                    elRight = left + elWidth;// in case elRight = frameRight the desc shows
                    showHideDesc();
                }    
            }

            function showHideDesc(){
                if( elRight <= frameRight + 30 && !focus){
                    desc.classList.add('visible-description');
                }
                else{
                    desc.classList.remove('visible-description');
                }
             }

             function hideTip(){
                tip.style.display= "none";
            }

             //when the reset button is clicked the screen is returned to its start position
             function resetScreen(e){
                el.style.left = 0;
                elLeft = 0;
                elRight = elWidth;
                showHideDesc();
            }
            </pre>

<p>The function calculates the difference between the screenshot offsets and that of the frame offsets, and scrolls the screen by the value passed to it as long as the difference is bigger than this value. If it's smaller, it scrolls it by the value of the difference. At the end of the function, another function <code>showHideDesc()</code> is called, which shows and hides the app description section based on the position of the screenshot with respect to the frame: if the screenshot's right offset = that of the frame's right offset, i.e the screenshot is fully inside the frame, then the description is shown, else, it's hidden.</p>

<p>When the left arrow button (the one on the phone frame) is clicked, the scroll function is called with a value equals to the width of the screenshot, which basically means: scroll the screen to the max until it's fully inside the frame.</p>

<p>The focus button (the magnifier) will cause a mode change for the demo. When it is clicked, the container containing the phone frame and the app screenshot will shrink (by adding the <code>.shrink</code> class to it) to fit the size of the frame, and it's overflow is hidden, and it's centered in the screen, this way the frame will contain the app screenshot and you can drag/swipe left and right to view the app inside of it. <em>(see image below)</em></p>

<figure>
    <img src="{{ site.url }}/images/new-focus-mode.png" />
    <figcaption>
        The app showcase in 'focus' mode.
    </figcaption>
</figure>

<pre class="brush:js;">
              var focus = false;

              function focusFrame(){
                  hideTip();
                  if(focus == false){
                      container.classList.add('shrink');
                      focus = true;
                      //show/hide description based on whether we're in the 'focus' state or not
                      desc.classList.remove('visible-description');
                  }
                  else{
                      focus = false;
                      container.classList.remove('shrink');
                      el.style.left = '0';
                      elRight = elWidth;//so that the description remains hidden
                  }
              }
            </pre>

<p>The last thing we're going to do is add the drag functionality to the app screen. We'll be attaching event handlers for <code>mousedown</code>, <code>mousemove</code>, and <code>mouseup</code> events, and their equivalent <code>touchstart</code>, <code>touchmove</code>, and <code>touchend</code> events to support touch devices.</p>

<p>What will happen is that every time the mouse is down (i.e the drag starts), the position of the mouse/finger is saved, and the current left offset of the screen is calculated, and a value <code>delta</code> is also calculated, which determines the difference between the mouse position on drag start and the left offset of the draggable element (app screen).</p>

<p>After that, as the mouse moves, its position is updated, and as its position changes so will the left offset of the draggable screen, as long as the boundaries of the screen don't exceed the boundaries of the frame from the left and right respectively: the right offset of the screen should not go below the right offset of the frame, and the left offset of the screen should not go above the left offset of the frame.</p>

<p>Now that we've cleared up the logic behind the dragging function, here's the code for that function.</p>

<pre class="brush:js;">
              //these values are reset on every mousedown event
              var mouseDownStartPosition, delta, mouseFrameDiff; 

              el.addEventListener("mousedown", startDrag, false);
              el.addEventListener("touchstart", startDrag, false);

              function startDrag( event ) {
                  hideTip();
                  //prevent contents of the screen from being selected in Opera and IE <= 10 by adding the unselectable attribute
                  el.setAttribute('unselectable', 'on');

                  elLeft = el.offsetLeft,
                  mouseDownStartPosition = event.pageX,
                  delta = mouseDownStartPosition - elLeft;
                  
                  document.addEventListener("mousemove", moveEl, true);
                  document.addEventListener("mouseup", quitDrag, false);
                  document.addEventListener("touchmove", moveEl, true);
                  document.addEventListener("touchend", quitDrag, false);
              }

              function moveEl(e){
                var moveX = e.pageX,
                    newPos = moveX - delta;
                    elLeft = newPos;
                    elRight = newPos + elWidth;
                    
                //-5 is a magic number because the phone frame has extra 5 px on the right side with a transparent bg
                //if you're using a different phone frame img u may not need this, but keeping it won't do any harm :)
                if(elRight >= frameRight - 5 && elLeft <= frameLeft){
                    el.style.left = newPos + 'px';
                    showHideDesc();
                }
             }

             function quitDrag(){
                 document.removeEventListener('mousemove', moveEl, true);
                 el.setAttribute('unselectable', 'off');
             }
            </pre>

<p>To make sure the screen doesn't keep moving when the dragging stops, we attached an event handler to the <code>mouseup</code> (and <code>touchend</code>) event, that will call a function which in turn will remove the corresponding event handlers from the <code>mousedown</code> and <code>mousemove</code> events.</p>

<p>And that's it, I hope you like this showcase and find it useful! :)</p>




