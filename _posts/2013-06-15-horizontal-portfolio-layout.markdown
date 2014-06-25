---
layout: post
title:  "Horizontal Portfolio Layout with CSS3 Animations &amp; jQuery"
image: "horizontal-portfolio-layout-header.png"
demo: "horizontal-portfolio-layout"
repo: "horizontal-portfolio-layout"
---

<p class="size-2x">In this tutorial today we're going to create a horizontal portfolio layout with cool hover effects inspired by those on <a href="http://www.guitouxx.com/#/en/home">Guillaume Tomasi's personal website</a>. The website is made in Flash, so I thought it would be nice to recreate the flash hover effect of the portfolio items using CSS3 animations and transitions, and some jQuery to replicate the image pan effect on hover.</p>

<p>I've also added a simple falling down effect on scroll, where the portfolio items fall down as soon as they enter the visible area of the viewport.</p>

<p>The artwork used in this demo is used with the permission of their owner <a href="https://twitter.com/vladstudio">Vlad Gerasimov</a>. You can find the original images/wallpapers and more on his website <a href="http://www.vladstudio.com/home/">VladStudio.com</a>.</p>

<p class="note">Please note that this demo will work only in <a href="http://caniuse.com/#feat=transforms3d">browsers that support</a> the CSS3 properties used.</p>

<p class="note">For the sake of brevity in the example code, I am using the un-prefixed CSS properties, but you will find the prefixes in the downloadeable source code on Github.<br/> 

<p>So, let's get started!</p>

### The Markup

<p>Our list of items is literally a list of items each one with a class <code>item</code>. Each item contains a <code>figure</code> which in turn contains a <code>.view</code> container which wraps an image inside it, and a footer with two paragraph tags that contain the meta information for each image, and a small date tag with its own animation.</p>

<pre class="brush:html;">
              &lt;ul class="portfolio-items"&gt;
                &lt;li class="item"&gt;
                  &lt;figure&gt;
                    &lt;div class="view"&gt;
                     &lt;img src="images/1.jpg" /&gt;
                    &lt;/div&gt;
                    &lt;figcaption&gt;
                      &lt;p&gt;&lt;span&gt;&lt;a href="http://www.vladstudio.com/wallpaper/?thetwoandthebubbles"&gt;The Two and The Bubbles&lt;/a&gt;&lt;/span&gt;&lt;/p&gt;
                      &lt;p&gt;&lt;span&gt;By Vlad Gerasimov&lt;/span&gt;&lt;/p&gt;
                    &lt;/figcaption&gt;
                  &lt;/figure&gt;
                  &lt;div class="date"&gt;2005&lt;/div&gt;
                &lt;/li&gt;
                &lt;li&gt;
                  &lt;!-- second item --&gt;
                &lt;/li&gt;
                &lt;li&gt;
                  &lt;!-- third item --&gt;
                &lt;/li&gt;
                &lt;!-- and so forth --&gt;
              &lt;/ul&gt;
            </pre>

### The CSS

<p>Let's start with basic styles for the items before we get into the animations and hover effects.</p>

<pre class="brush:css;">
              .portfolio-items {
                height: 400px;
                overflow-x: scroll;
                overflow-y: hidden;
                white-space: nowrap;
                margin-bottom: 30px;
                position: relative;
              }
              .portfolio-items > li {
                display: inline-block;
                /*aligning items by top baseline makes sure the baseline doesn't change once the hover
                effect is fired and therefore the other items stay put*/
                vertical-align: top;
              }
              .item {
                width: 300px;
                height: 202px;
                margin: 150px 20px 0;
                padding: 5px;
                border-radius:2px;
                box-shadow: 0px 10px 10px -5px rgba(0,0,0,0.5);
                background-color: white;
                font-size: 14px;
                /*initially all items are moved 300px up and faded out and rotated, they will fade 
                into view and back to position later via javascript*/
                opacity: 0;
                position: relative;
                top: -300px;
                transform: rotate(-135deg);
                transition: all .3s ease, opacity 2s ease,  top 1s ease;
              }
              /*even items will be 100px lower than their siblings*/
              .item:nth-child(even) {
                margin-top: 100px;
              }
             
            </pre>

<p>Now that all items have been styled and placed, we'll define the styles for the inner components of each item.</p>

<p>The figure will take up the full width of the parent. The image will get both a height and a width, and we'll apply a transition to the items so that they change smoothly on hover.</p>

<p>The figcaption with the metadata will be positioned absolutely, and will be invisible at first so it gets a 0 opacity value.</p>

<pre class="brush:css;">
              figure{
                width:100%;
                height:100%;
              }
              .view {
                overflow: hidden;
                width: 100%;
                height: 190px;
                position: relative;
              }
              .view img {
                width: 300px;
                height: 190px;
                transition: width .3s ease;
                position: absolute;
              }

              figcaption {
                height: 60px;
                width: 100%;
                padding: 0;
                position: absolute;
                bottom: 0;
                overflow: hidden;
                opacity: 0;
              }
              figcaption p {
                font: bold 12px/18px "Arial", sans-serif;
                text-transform: uppercase;
                padding: 0 10px;
                margin:  5px 0;
                width:100%;
                background-color: #f0f0f0;
                color:#333;
              }
              /*the text of the paragraph tags in the footer(figcaption) is initially hidden to the left*/
              figcaption span {
                left: -100%;
                opacity: 0;
              }
              figcaption a{
                 color: #CC320F; 
              }

              .date {
                z-index: 1;
                width: 50px;
                height: 30px;
                line-height: 30px;
                color: #fff;
                font-weight: bold;
                text-align: center;
                border-radius: 1px;
                background-color: #CC320F;
                position: absolute;
                bottom: 30px;
                left: 15px;
                transition: transform 0.5s cubic-bezier(0.12, 1.6, 0.91, 0.92);
              }

            </pre>

<p>Now that we have all the items styled, we'll define what happens when each item is hovered.</p>

<pre class="brush:css;">
              .item:hover {
                height: 270px;
                padding: 15px;
                transform: translateY(-68px);
              }
              .item:hover .date {
                transform: translate3d(0, 61px, 0);
              }
              .item:hover figcaption {
                animation: show .25s ease-in .120s forwards;
              }
              .item:hover p:nth-of-type(1) span{
                animation: slideOut .25s ease-out .15s forwards;
              }
              .item:hover p:nth-of-type(2) span{
                animation: slideOut .2s  ease-out .3s forwards;
              }
              .item:hover .view {
                height: 170px;
              }
              .item:hover .view img {
                top: -20px;
                left: -20px;
              }
            </pre>

<p>When the item is hovered, it increases in height, its padding is increased, thus decreasing the view or "viewport" for each image, while the image keeps its original size. We'll later add a panning effect to the image which makes it possible to view the whole image despite the fact that its viewport got smaller, by changing its position as the mouse moves over it; this is why the image is  moved 20px to the left and upwards when its field of view decreases. We'll manipulate these positions with Javascript later.</p>

<p>Also on hover, the date tag slides down, the footer is shown and the metadata slides in.</p>

<p>Here are the keyframes defined for the above animations:</p>

<pre class="brush:css;">
              /*animation to show the metadata*/
              @keyframes slideOut {
                0% {
                  left: -100%;
                  opacity: 0;
                }
                95% {
                  left: 0;
                  opacity: 0.2;
                }
                100% {
                  opacity: 1;
                  left: 0;
                }
              }
              /*animation to show the footer, which will simply up its opacity to 1*/
              @keyframes show {
                to {
                  opacity: 1;
                }
              }
            </pre>

<p>When we defined the initial styles for the items, we defined their position and opacity so that they are <i>not</i> visible at first, but once they are within the viewport's visible area, they get a class (via Javascript) which makes them "fall down" into position. Here is the class added to the items on scroll:</p>

<pre class="brush:css;">
              .falldown {
                top: 0;
                opacity: 1;
                /*they are also initially rotated, and are rotated back to their normal position*/
                transform: rotate(0);
              }
            </pre>

<p>For extra styling purposes, we're gonna style the scrollbar of the items' list. But bear in mind that these styles are supported only in Webkit browsers. You can, of course, use <a href="http://jscrollpane.kelvinluck.com/">one of</a> <a href="http://designhuntr.com/custom-jquery-scrollers/">several</a> javascript <a href="http://slodive.com/web-development/jquery-scroll/">plugins</a> available to provide cross-browser scrollbar styles if it's necessary to your overall design.</p>

<pre class="brush:css;">
              ::-webkit-scrollbar {
                width: 7px;
                height: 7px;
                cursor: pointer;
              }
              ::-webkit-scrollbar-track {
                background-color: #ddd;
                border-radius: 10px;
              }
              ::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background-color: #C4290D;
              }
            </pre>

<p>That's all the styling we need and all animations needed for the hover effect. Now we'll start defining the panning effect with Javascript and handling the list scroll function.</p>

### The Javascript

<p>We'll start by defining the scrolling function which will first check for the position of an item on the screen, and return true if the item is in the visible area of the viewport, but it only checks horizontally.</p>

<pre class="brush: js;">
              //checks if element it is called on is visible (only checks horizontally)
              (function($) {
                var $window = $(window);
                
                $.fn.isVisible = function(){
                  var $this = $(this),
                    Left = $this.offset().left,
                    visibleWidth = $window .width();

                  return Left < visibleWidth;  
                }
              })(jQuery);
            </pre>

<p>Now we're going to define the function what will call this function on the portfolio items to check for their visibility.</p>

<pre class="brush: js;">
              (function($){
                var list = $('.portfolio-items'),
                    showVisibleItems = function(){
                    list.children('.item:not(.falldown)').each(function(el, i){
                        var $this = $(this);
                        if($this.isVisible()){
                          $this.addClass('falldown');
                        }
                      });
                    };
                    //....
            </pre>

<p>We'll want to call this function as soon as the page has loaded to check for visible items and add the <code>.falldown</code> class to all items that should be visible in the beginning. Then, we'll want to call this function whenever the list is scrolled as well.</p>

<pre class="brush:js;">
                  //....
                  //initially show all visible items before any scroll starts
                  showVisibleItems();
                  
                  //then on scroll check for visible items and show them
                  list.scroll(function(){
                    showVisibleItems();
                  });
            </pre>

<p>The last thing we're going to do is add the panning effect for the images on hover. What this function does is that it checks the position of the mouse cursor when it moves over each image, and moves the image along with the movement of the cursor. It measures the distance between the cursor and the image's <code>view</code> boundaries, and then divides that by the part of the image that's hidden beyond the borders of the <code>view</code>, thus making sure the image does not move any extra than it should. The function calculations should make it clearer:</p>

<pre class="brush:js;">
              list.on('mousemove','img', function(ev){
                  var $this = $(this),
                      posX = ev.pageX, 
                      posY = ev.pageY,
                      data = $this.data('cache');
                //cache necessary variables
                    if(!data){
                      data = {};
                      data.marginTop = - parseInt($this.css('top')),
                      data.marginLeft = - parseInt($this.css('left')),
                      data.parent = $this.parent('.view'),
                      $this.data('cache', data); 
                    }

                var originX = data.parent.offset().left,
                    originY =  data.parent.offset().top;
                
                   //move image
                   $this.css({
                      'left': -( posX - originX ) / data.marginLeft,
                      'top' : -( posY - originY ) / data.marginTop
                   }); 
              });
            </pre>

<p>One thing remaining is making sure the image returns to its initial position when the mouse leaves the item so that everything goes back to its initial state:</p>

<pre class="brush:js;">
              list.on('mouseleave','.item', function(e){
                $(this).find('img').css({
                  'left': '0', 
                  'top' : '0'
                });
              });
            </pre>

<p>To finish up, we're going to add mouse wheel support using <a href="https://github.com/brandonaaron/jquery-mousewheel"> jQuery Mouse Wheel plugin by Brandon Aaron</a>:</p>

<pre class="brush:js;">
              //add mouse wheel support with the jquery.mousewheel plugin
              list.mousewheel(function(event, delta) {

                  this.scrollLeft -= (delta * 60);
                
                  event.preventDefault();

               });
            </pre>

<p>Aaand we're done! :) I hope you liked this simple hover effect and found it useful.</p>

<p><em>Thanks a lot <a href="http://twitter.com/FWeinb">Fabrice </a> <a href="http://blog.weinberg.me/">Weinberg</a> for helping me optimize and organize my Javascript code. :)</em></p>


