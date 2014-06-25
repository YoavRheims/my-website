---
layout: post
title:  "Creative Add/Remove Effects for List Items with CSS3 Animations"
image: "creative-list-effects-header.png"
demo: "creative-list-effects"
repo: "creative-list-effects"
---

<p class="size-2x">
	It's not enough to bring animations and visual transitions to an interface, they should serve a purpose and goal, and this goal should be improving the user's experience.
</p>

> Transitions [...] provide the grease that smoothes out what happens in the interface.<b> Without transitional effects the user can be left to wonder what just occurred</b>.

In today's tutorial, we'll be creating some creative animations and transitions for adding and removing items from a list, inspired by the concept from <a href="https://medium.com/design-ux/926eb80d64e3">Pasquale D'Silva's article on Medium</a>. <a href="https://twitter.com/chriscoyier">Chris Coyier</a> <a href="http://css-tricks.com/transitional-interfaces-coded/">coded the transitions</a> from Pasquale's article.

In this tutorial I'm extending Pasquale's example, adding more animations and transitional effects, and I'll also be using a small snippet from Chris's article to add an extra step in each animation, which "makes room" for the added items before they are actually added.

<p class="note">
	For the sake of brevity in the example code, I am using the un-prefixed CSS properties, but you'll find them in the project's source code on Github. These code snippets are intended to work only in <a href="http://caniuse.com/#feat=transforms2d"> browsers that support</a> the properties used.<br/> 
</p>

So, let's dig in!

### The Markup

For demonstration purposes, I've built a simple reminders app. The app uses HTML5's localStorage API to save the items to your browser's local storage. So, you can actually use it to take in-browser notes if you want, it's actually why I built it in the first place for my own notes. I'm not going to get into details of how to build this app because it's not the purpose of this tutotial. 

The markup for the app is just a simple form with a text field and submit button, and an empty unordered list. The items will be added to the list dynamically. There's also a couple of divs for the notifications which appear after saving or removing an item, and a counter and a button to delete all items at once. So here's all the markup needed:

<pre class="brush:html;">
&lt;div class="notification undo-button">Item Deleted. Undo?&lt;/div&gt;
&lt;div class="notification save-notification"&gt;Item Saved&lt;/div&gt;
&lt;div class="reminder-container"&gt;
    &lt;header&gt;
      &lt;h1&gt;mini reminders list&lt;/h1&gt;
    &lt;/header&gt;
	&lt;form id="input-form"&gt;
        &lt;input type="text" id="text" placeholder="Remind me to.."/&gt;
        &lt;input type="submit" value="Add" /&gt;
    &lt;/form&gt;
    &lt;ul class="reminders"&gt;

    &lt;/ul&gt;
    &lt;footer&gt;
        &lt;span class="count"&gt;&lt;/span&gt;
        &lt;button class="clear-all"&gt;Delete All&lt;/button&gt;
    &lt;/footer&gt;
&lt;/div&gt;
</pre>

You can add, edit, remove items, and restore them, and it's actually the removing and restoring where the animations come in place the most. Adding the items is pretty simple, and not much of an animation happens there, except a fading in and falling down animation which we'll get into as we start with the CSS, so let's do that.

### The CSS

New items added via javascript get a class of <code>.new-item</code>. Items removed get a <code>.removed-item</code> class, and restored items get a <code>.restored-item</code> class. Each of these classes fires its own animation. The class names are going to be the same for all demos, and it's the animation <code>@keyframes</code> that will be different for each one.

Let's start with the first demo.

#### Demo #1

<figure>
    <img src="{{ site.url }}/images/demo-1.png" />
    <figcaption>Demo 1: Removed items "fall down". Restored items come back in a reverse animation.</figcaption>
</figure>

Newly added items are going to "fall down" from above. This is a very simple but nice effect. Each item starts at a position -400px above their final position, and fall down from that position. Don't forget that the <code>animation-fill-mode</code> should have a value of <code>forwards</code> to make sure the items stays in their final position inside the list, otherwise it'll just disappear up again as soon as the animation is finished.

<pre class="brush:css;">
/*newly added items start faded out and translated 400px upwards on the y-axis*/
li.new-item {
    opacity: 0;
    animation: new-item-animation .3s linear forwards;
}

@keyframes new-item-animation {
    from {
        opacity: 0;
        transform: translateY(-400px);
}

    to {
        opacity: 1;
        transform : translateY(0);
    }
}
</pre>

Removed items will "fall down" and fade out as they do. The falling down animation is also quite simple: the item is translated downwards along the y-axis, and is rotated as it is falling and faded out until it finally disappears (the Javascript makes sure the item is completely removed from the DOM at the end of this animation).


<pre class="brush:css;">
li.removed-item {
    animation: removed-item-animation 1s cubic-bezier(0.55, -0.04, 0.91, 0.94) forwards;
    /*transform origin is moved to the bottom left corner*/
    transform-origin: 0% 100%;
}

@keyframes removed-item-animation {
    0% {
        opacity: 1;
        transform: rotateZ(0);
}

    100% {
        opacity: 0;
        transform: translateY(600px) rotateZ(90deg);
    }
}
</pre>
            
            
Restoring the item fires an animation which visually reverses the above animation, so the keyframes defined are the exact opposite of the above ones:

<pre class="brush:css;">
/*the initial state in this animation is same as the final state of the above one*/
li.restored-item {
    animation: 
        openspace 0.3s ease forwards, 
        restored-item-animation 0.3s 0.3s cubic-bezier(0, 0.8, 0.32, 1.07) forwards;
}
/*
    Snippet @keyframe openspace source: http://css-tricks.com/transitional-interfaces-coded/
*/
@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    0% {
        opacity: 0;
        transform: translateY(600px) rotateZ(90deg);
    }

    10% {
        opacity: 1;
        transform: translateY(600px) rotateZ(90deg);
    }

    100% {
        opacity: 1;
        transform: rotateZ(0);
    }
}
</pre>

You can see that I used a keyframe called <code>openspace</code> which I borrowed from Chris Coyier's article. This makes sure that the items blow the restored item will slide down and make room for the restored item to come back into place. Now, when the items "slide down" to open space for the restored item, they should actually transition down in a smooth manner, but because the items in my app don't have a fixed height, the keyframes are animating the height to a value of <code>auto</code>, which unfortunately the browser doesn't really "transition" to, so the items don't actually "slide" down, they kinda jump down.

There's a way to make items change positions smoothly, it's a technique by Steve Sanderson which he <a href="http://blog.stevensanderson.com/2013/03/15/animating-lists-with-css-3-transitions/"> wrote about</a>, but it uses absolute positioning, and a not-so-little amount of javascript. You can check his article out if you're interested in knowing more about his technique, and the end result is pretty impressive!

#### Demo #2

<figure>
    <img src="{{ site.url }}/images/demo-2.png" alt="">
    <figcaption>Demo 2: Items scale and fade out into the user's face, and are restored in a reverse manner.</figcaption>
</figure>

<p class="note">Credit for this idea goes to <a href="https://twitter.com/TimPietrusky">Tim Pietrusky</a> who came up with this idea when I told him I was almost out of ideas after making the other 5 demos. :)</p>

Newly added items (i.e items that have not been removed and then restored) are faded in into position.

<pre class="brush:css;">
    li.new-item {
        opacity: 0;
        animation: fadeIn .3s linear forwards;
    }

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</pre>

When items are removed, they scale up and fade out into the user's face, and are restored in the opposite way, the animation for restoring items is the exact same as the removing animation but only reversed.

<pre class="brush:css;">
    li.removed-item {
        animation: removed-item-animation .6s ease-out forwards;
        transform-origin: 50% 50%;
    }

@keyframes removed-item-animation {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(4);
    }
}

li.restored-item {
    animation: 
        openspace .3s ease forwards, 
        restored-item-animation .3s .3s ease-out forwards;
}

@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    0% {
        opacity: 0;
        transform: scale(4);
	}

	100% {
    	opacity: 1;
    	transform: scale(1);
	}
}
</pre>

And that's it for demo 2, now let's move on to demo 3.

#### Demo #3

<figure>
    <img src="{{ site.url }}/images/demo-3.png" alt="">
    <figcaption>Demo 3: Restored items slide in the from the right, and removed ones slide out to the left.</figcaption>
</figure>
The third demo is visually simpler than the previous demos. Newly added items will have the same fading in effect as in the previous demo, so we'll be skipping the animation for these items.

Items deleted will slide out to the left, with a nice touch at the beginning of the sliding achieved by using a cubic bezier timing function. You should check the live demo to see how the animation works.

<pre class="brush:css;">
li.removed-item {
    animation: removed-item-animation .8s cubic-bezier(.65,-0.02,.72,.29);
}

@keyframes removed-item-animation {
   0% {
        opacity: 1;
        transform: translateX(0);
    }

    30% {
        opacity: 1;
        transform: translateX(50px);
    }

    80% {
        opacity: 1;
        transform: translateX(-800px);
    }

    100% {
        opacity: 0;
        transform: translateX(-800px);
    }
}
</pre>

Restored items will slide in from the right, with a timing function similar to the above one, but it's not really the reverse version of it (also check out the demo to see the final result).

<pre class="brush:css;">
li.restored-item {
    animation: 
        openspace .3s ease forwards, 
        restored-item-animation .5s .3s cubic-bezier(.14,.25,.52,1.56) forwards;
}

@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    0% {
        opacity: 0;
        transform: translateX(300px);
    }

    70% {
        opacity: 1;
        transform: translateX(-50px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</pre>

And that's it for the third demo, now moving on to the fourth one.

#### Demo #4

<figure>
    <img src="{{ site.url }}/images/demo-4.png" alt="">
    <figcaption>Demo 4: Restored items scale and fade in to position, and removed ones scale and fade out of view.</figcaption>
</figure>

This demo is also a simple one. Both new and restored items will be scaling in and fade in into their position, and the removed items will fade and scale out of view. Here are the two keyframes for these animations:

<pre class="brush:css;">
li.removed-item {
    animation: removed-item-animation .6s cubic-bezier(.55,-0.04,.91,.94) forwards;
}

@keyframes removed-item-animation {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0);
    }
}

li.restored-item {
    animation: 
        /*make sure to open space up before bringing the item into position*/
        openspace .3s ease forwards, 
        restored-item-animation .3s .3s cubic-bezier(0,.8,.32,1.07) forwards;
}

@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    from {
        opacity: 0;
        transform: scale(0);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</pre>

#### Demo #5

<figure>
    <img src="{{ site.url }}/images/demo-5.png" alt="">
    <figcaption>
                Demo 5: New items "fall down". Removed items "hang" and "fall down". Restored items slide in from right.
    </figcaption>
</figure>

In this demo, when an item is deleted, it "hangs" down before it actually "falls down" and fades out. This is kind of the best part of this demo, because the newly added items fall down as in demo 1, and restored items slide in from the right as in demo 3, but with a slightly different timing function, so the animation for removing an item is the only new effect in this one.
            
<pre class="brush:css;">
li.restored-item {
    /*we'll initially translate the item to the right*/
    transform: translateX(300px);
    animation: 
        openspace .3s ease forwards, 
        restored-item-animation .3s .3s cubic-bezier(0,.8,.32,1.07) forwards;
}

@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

li.removed-item {
    animation: removed-item-animation 2s cubic-bezier(.55,-0.04,.91,.94) forwards;
    transform-origin: 0% 100%;
}
</pre>

changing rotation angle for the item at different frames gives the effect of the item "swinging" when it's hanging, and then falls down.

<pre class="brush:css;">
@keyframes removed-item-animation {
    0% {
        opacity: 1;
        transform: rotateZ(0);
    }

    20% {
        opacity: 1;
        transform: rotateZ(140deg);
    }

     40% {
     	opacity: 1;
        transform: rotateZ(60deg);
    }

    60% {
        opacity: 1;
        transform: rotateZ(110deg);
    }

    70% {
        opacity: 1;
        transform: rotateZ(90deg) translateX(0);
    }

    90% {
        opacity: 1;
        transform: rotateZ(90deg) translateX(600px);
    }

    100% {
        opacity: 0;
        transform: rotateZ(90deg) translateX(600px);
    }
}
</pre>

That's all for demo 5, now to the last demo.

#### Demo #6

<figure>
    <img src="{{ site.url }}/images/demo-6.png" alt="">
    <figcaption>Demo 6: Removed items slide out and fall down to the left. Restored and new items slide in from right.</figcaption>
</figure>

In this demo both newly added items and restored ones will get the same animation, where the items slide in from the right, "almost fall out" from the left, and get back into position.

<pre class="brush:css;">
li.restored-item {
    transform: translateX(300px);
    animation: 
        openspace .3s ease forwards, 
        restored-item-animation .5s .3s cubic-bezier(.14,.25,.52,1.56) forwards;
}

@keyframes openspace {
    to {
        height: auto;
    }
}

@keyframes restored-item-animation {
    0% {
        opacity: 0;
         transform: translateX(300px);
    }

    70% {
        opacity: 1;
        transform: translateX(-50px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</pre>

Items removed will slide slowly to the left, and then fall down to the left and fade out.

Now, an important thing to do here is set an appropriate transform origin position, so that the falling down effect looks more realistic. I set the transform origin to the last point of contact between the item and the row is belongs to, right before it starts rotating and falling down, that way it looks that the item fell down due to its own "weight".

<pre class="brush:css;">
li.removed-item {
    animation: removed-item-animation 1s linear;
    transform-origin: 390px 100%;
}

@keyframes removed-item-animation {
    0% {
        opacity: 1;
        transform: translateX(0) rotateZ(0);
    }

    50% {
        opacity: 1;
        transform: translateX(-400px) rotateZ(0);
    }

    75% {
        opacity: 1;
        transform: translateX(-420px) rotateZ(-30deg);
    }

    100% {
        opacity: 0;
        transform: translateX(-800px) rotateZ(-60deg)  translateY(400px);
    }
}
</pre>

### Final Words

The possibilities are almost endless, there are lots of other more creative ways for adding/removing items into lists, I'm sure you can also think of your own effects, and I hope you find this tutorial inspiring!

I didn't get into the Javascript part because that's not the focus of this tutorial.

I should also note that there's kind of a bug in Firefox which causes the page to "flash" or repaint whenever an item is focused on or out (i.e when you click the edit/save button). I don't know if there's a way around this, please let me know if you know what causes this flashing and if there's a way to prevent it. For now, I can say that the <b>demos are best experienced in Webkit browsers</b>.
            
Thank you for reading, I hope you enjoyed this tutorial, and if you did make sure you subscribe to the RSS feed to stay updated!

            
            