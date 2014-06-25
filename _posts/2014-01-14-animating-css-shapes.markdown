---
layout: post
title:  "Animating CSS Shapes with CSS Animations &amp; Transitions"
image: "animating-css-shapes-header.png"
---

     
<p class="size-2x">
  Today we're going to be talking about animating CSS shapes with CSS animations. 
  We'll be creating very basic "shape-shifting" layouts of sort. 
  There are also many considerations to take when animating CSS shapes, so we'll go over all points 
  in this article.
</p>
<p>
  This is the third article in a series of articles I'm writing about CSS shapes, 
  so in this article I'm assuming you have a basic understanding of how CSS shapes are created. 
  You may want to check the first article: 
              <a href="http://sarasoueidan.com/blog/css-shapes/">Creating Non-Rectangular Layouts with 
                CSS Shapes</a>, which covers all the basics to get you started creating 
                CSS shapes in no time. The second article was about 
                <a href="http://sarasoueidan.com/blog/css-regions-with-shapes-for-readability/">combining CSS
                 shapes with CSS regions to create more readable layouts</a>, tackling one face of the accessibility 
                 of non-rectangular shaped layouts.
            </p>
<div class="note warning">
Notes: 
<ul>
<li>Most of this article's demos use the `shape-inside` property, which has been temporarily <a href="https://bugs.webkit.org/show_bug.cgi?id=130698">removed from Webkit</a> and <a href="https://codereview.chromium.org/209443007/">Blink</a>.</li>

<li>The principles of animating shapes is applicable to both CSS Shapes *and* CSS Clipping masks. All the
demos in this article use clipping masks to visualize CSS Shapes. Hence, the shapes are animated as clipping paths as well. So, you will be able to see the shapes animate in webkit-based browsers at this time, but the content inside the shapes won't be affected by the shapes because of the current state of support for CSS Shapes.</li>
              
<li>For a detailed supprt table for CSS Clipping masks and Masking, see the <a href="http://caniuse.com/css-masks">CanIUse.com Support table</a>.</li>

</div>
       
### Animatable CSS Shapes

There are two ways we can create a shape with CSS shapes: using an image URI which the browser uses to extract the shape from, and using one of the available CSS shapes functions, such as `polygon()` and `circle()`, among others.
            

**Shapes defined using an image are not animatable**. So, if you define a shape using an image, specify a transition, and then define another shape using another image when the element is hovered, for example, the shape applied to the shape will change but it will not animate or transition into the new shape; it will just "jump" from one shape into another in an abrupt manner.

**The only way a shape can be animated is when it is defined using a <u>shape function</u>.** Even so, there is one condition: **the number of points defining the final shape 
must be the same as the number of points defining the initial shape**. When you think about it, makes perfect sense: you have a set of points that make up a shape, and then you move those points around and have them form another shape.

So the **transitions on CSS shapes are really transitions on the individual points making up a shape**. More specifically, **transitions on the coordinates of each point**, where the coordinates are interpolated as real numbers to allow animations and transitions, just like any other animatable CSS values.

When I first learned about this condition, I thought it would not be possible to change a simple shape into a more complex one that has more points defining it, but that's actually not true, it is very doable: start by definining the points needed for the more complex shape, and then rearrange 
those points to form the simple shape.

For example, even if you have 20 points making up the final shape, and you want to start with a simple rectangle defined by 4 points, you can still place those 16 extra points on the rectangular shape by simply placing them on one of the rectangle's sides, without them affecting the shape of the rectangle. We'll get into the examples shortly.

Now, thinking about the complex shape first does not at all mean that the initial shape must be more complex than the final shape, it just means that you will think ahead and prepare all the requirements before you start coding. You can easily animate a simple shape into a more complex one if you have all the necessary points defined.


### Things To Consider Before Animating Your Shaped Layouts
            
#### Content Fitting Inside Different Shapes

One thing to consider when animating CSS shapes in general is the fact that the content that fits into one shape may not perfectly fit into another. You may start out with a simple shape, and when you animate that shape into a new one, the content inside that shape may overflow the new shape, or may be too little for the new shape. So you may need to resize the element as you change its shape as well, so, again, the design process has to be thought through in detail. This also means that it wouldn't be very simple to depend on animated CSS shapes for dynamic content, unless you create the shapes dynamically with Javascript. But that's a topic for another blog post ;)

#### Animated Text Becomes Temporarily Unreadable

Animating text composition in general, whether by animating Shapes or even a simple animation of width, will make the text temporarily unreadable. *(Thanks <a href="https://twitter.com/alanstearns">Alan</a> for bringing that to my attention)*

While it might be an interesting graphical effect for smooth layout changes, the process of text changing its layout blocks the ability of the reader to read your content, and it is only after the animation is over that they will again be able to read the text. That is, of course, assuming that the Shapes are readable to begin with, as we noted before.
            
#### Accessibility in General

Be careful what shapes you choose, and consider how they affect the readability of your content. And think twice before integrating CSS animations with CSS Shapes.

Also, shapes that are fine on big screens may not be fine on small screens. Personally, I would
stick with rectangular layouts on small screens, and progress to more complex (but still readable)
shaped layouts on big screens. But then again, this depends on the shapes you choose, and some
simple shapes are actually OK on small screens as well.

The aim of this article is to discuss and **experiment** with the different ways and options we have to animate CSS Shapes. **Shapes animations should only be used in real projects when there is a practical use-case for these animations** (and of course when there is more acceptable browser support ^^). I'm sure someone will think of a nice use-case. So, for now, let's dig into the actual animation process and have some CSS Shapes fun!

### 1. Initial and Final Shapes Have Same Number Of Points

We'll start off with very simple examples and then progess to more complex ones. The examples in this section won't deal with the number of points defining a shape. We'll leave that for the second section.

The best way to visualize a shape animation it to use the shape properties in conjunction with the `clip-path` property, which will clip any excess parts of the element that are outside the defined shape. I've talked about using CSS clip paths with CSS Shapes in detail in my <a href="http://sarasoueidan.com/blog/css-shapes/"> first article</a>, so check that out if you still don't know how they can relate.
            
#### Rearranging Points To Create A New Shape

So for our first example, we're going to do just that. And for the sake of simplicity and demonstration purposes, we're not going to be doing anything fancy. We'll create a simple shape and animate it on hover using a simple CSS transition. The initial and final shapes will have the same number of points so we won't have to worry about that for now. All we have to do, is move the points around (rearrange them) and see how the shape transitions smoothly.

We'll start with a simple inverted trapezoid shape, and when you hover over the element, its shape will animate but the final shape will also be a trapezoid. The only thing we're going here is move the points defining the shape around by changing their coordinate values.

We'll be using the `clip-path` property to make the shape and the animation clearer and more obvious.

<pre class="brush:css">
.element {   
  shape-inside: polygon(0 0,  500px 0, 350px 300px, 150px 300px);
  shape-padding: 20px;
  transition: all 2s ease; 
  -webkit-clip-path: polygon(0 0,  500px 0, 350px 300px, 150px 300px);
} 
.element:hover {
  shape-inside: polygon(150px 0, 350px 0, 500px 300px, 0px 300px);
  -webkit-clip-path: polygon(150px 0, 350px 0, 500px 300px, 0px 300px);  
} 
</pre>

The shape-* properties are supported unprefixed in Canary, but the `clip-path` property still needs its prefix to work.

<p data-height="500" data-theme-id="3617" data-slug-hash="6aa071b2202052b5fed38b1312f3878d" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/SaraSoueidan/pen/6aa071b2202052b5fed38b1312f3878d'>animating a css shape</a> by Sara Soueidan (<a href='http://codepen.io/SaraSoueidan'>@SaraSoueidan</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

And it's as simple as that! Just change the coordinates of the points defining the shape define a transition on the element, and you've got yourself a smooth animating shape. 

You will be able to see how the text inside the shape is animated into the new shape as well. And you can also see that, during the animation process, that text is very unreadable.

Now, if you change the shape on hover to another shape by using another shape function for example, or changing the number of points defining the shape, the shape *does* change, but it will not transition or animate; it will jump from the initial shape to the final one abruptly. For example, the following code:

<pre class="brush:css">
.demo:hover {
  /* blink needs old syntax at this time */
  shape-inside: circle(50%, 50%, 50%);
  -webkit-clip-path: circle(50%, 50%, 50%);
  /* new syntax for webkit */
  shape-inside: circle(50% at 50% 50%);
  -webkit-clip-path: circle(50% at 50% 50%);
} 
</pre>

I've added this snippet to the above demo. Click the "Edit on Codepen" link on the demo, and uncomment the snippet in the `.element:hover` rule to see how it affects the animation.

#### Resizing Shapes With No Specific Number Of Points

In our second example, we're going to animate a circular shape by increasing its diameter. The number of points on a circle is undefined, and the only thing defining the circle in the `circle()` function is its center and radius.

We're going to have the circle increase in size when we hover over it. This sounds a lot like resizing an element in CSS using CSS transforms and the `scale()` function, but it's not really the same. When you scale an element using CSS transforms, the entire element including its content will increase in size, and by increasing its size you're not creating any extra room inside it for more content. But when you resize an element's defined Shape, you *are* making more room or taking away from it. So, you could, for example, increase the size of the element's shape and then dynamically add some content to it and have that content fit inside it, but that's not possible when you're scaling the element up with CSS transforms.

In this example we'll first define a circular shape on our element using the `circle()` shape function, and then animate the circle's size when the element is hovered. You will be able to see how that will affect the room inside the element.

First, we're going to define the shape on the element and fire an animation on hover. We'll define a circle of radius `210px` whose center is positioned at the center of the element.

<pre class="brush:css">
.element {   
  /* ... */
  shape-padding: 15px;
  /* blink */
   shape-inside: circle(250px, 250px, 210px);
  -webkit-clip-path: circle(250px, 250px, 210px);
  /* webkit */
  shape-inside: circle(210px at 250px 250px);
  -webkit-clip-path: circle(210px at 250px 250px);
} 
.element:hover{ 
   -webkit-animation: scale 3s ease infinite;
} 
</pre>

Then we're going to define the animation keyframes that will control the scaling of the shape. The final effect will be similar to a beating effect: the radius of the circle is going to increase and then decrease back to its initial size at the end of the animation. And we have set the animation to repeat infinitely as long as you're hovering over the element.

<pre class="brush:css">
@keyframes scale {
  0% {
    shape-inside: circle(250px, 250px, 210px);
    -webkit-clip-path: circle(250px, 250px, 210px);

    shape-inside: circle(250px, 250px, 210px);
    -webkit-clip-path: circle(210px at 250px 250px);
  }
  50% {
    shape-inside: circle(250px, 250px, 250px);
    -webkit-clip-path: circle(250px, 250px, 250px);

    shape-inside: circle(250px, 250px, 250px);
    -webkit-clip-path: circle(250px at 250px 250px);
  }
  0% {
    shape-inside: circle(250px, 250px, 210px);
    -webkit-clip-path: circle(250px, 250px, 210px); 

    shape-inside: circle(250px, 250px, 210px);
    -webkit-clip-path: circle(210px at 250px 250px);
  }
}
</pre>

And here is the resulting effect:

<p data-height="600" data-theme-id="3617" data-slug-hash="acb88a202823fd107d1327f4b1a9c3c2" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/SaraSoueidan/pen/acb88a202823fd107d1327f4b1a9c3c2'>animating a css shape</a> by Sara Soueidan (<a href='http://codepen.io/SaraSoueidan'>@SaraSoueidan</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

You can see that the room for content inside the circle increases, and more text can fit inside the shape when it grows. So, you could, for example, use a growing CSS Shape to show more content information when an element is hovered.


### 2. Initial and Final Shape Have Different Number Of Points

In this section we're to animate from one shape to another, where the initial and final shapes are *visually* defined by a different number of points. We're going to use the `polygon()` function to define our shapes.

As I mentioned at the beginning of this article, only shapes with the same number of points can be animated into one another. So, in order to animate from a shape to another, we have to make sure that the number of points in the definition of these shapes is the same, even if they don't visually appear to have the same number.

#### Animating A Complex Shape Into a Simple Shape

We're going to start with a very simple demo, where we animate a star shape into a simple rectangle shape. (Not that the star shape is really complex, but it is more complex than the final shape it will be animating into.)

<figure>
  <img src="{{ site.url }}/images/star-to-rect.jpg" alt="The two shapes">
    <figcaption>
      The two shapes we'll be animating. Blue discs show the number of points needed to define the shape.
    </figcaption>
</figure>

The star is defined by 10 points (shown in blue), and the rectangle only needs 4 points to define it. It is true that the rectangle only **needs** four points to define it, but it can also be defined by as many points as we want it to.

The `polygon()` function we're going to use to define these two shapes **needs to take in the same number of points for the two shapes** in order for the animation to be possible. This means that we need to use 10 points to draw the rectangle just like we will use 10 points to draw the star, and there is no problem with this. Why? Because we can simply place the extra points in a way that does not affect the resulting shape we want.

So, the rectangle will be defined by 10 points, which we can place as shown in the image below:
           
<figure>
  <img src="{{ site.url }}/images/rect-points.jpg" alt="points placed on the rectangle">
    <figcaption>
      The rectangle can be defined by as many points as the star. This is needed to make the animation work.
    </figcaption>
</figure>

Of course, we could have placed the extra 6 points anywhere on the rectangle's edges, but that would change the animating effect. We'll get to this in a minute.

Now that we have the same number of points in both shapes, we can easily transition from one shape to another.

We'll first position the points so that they make up a star. The `polygon()` function for the star shape looks like following; of course, we're also going to clip the element to the shape using the `clip-path` property as we did before.

<pre class="brush:css">
.element {
  /* ... */
  shape-inside: polygon(250px 0, 350px 170px, 500px 180px, 380px 320px, 450px 500px, 250px 420px, 50px 500px, 120px 320px, 0px 180px, 150px 170px );
  shape-padding: 10px;
  transition: all 3s ease; 
  -webkit-clip-path: polygon(250px 0, 350px 170px, 500px 180px, 380px 320px, 450px 500px, 250px 420px, 50px 500px, 120px 320px, 0px 180px, 150px 170px );  
}
</pre>

And when the element is hovered, the points will be rearranged to form a rectangle defined as follows:

<pre class="brush:css">
.element:hover {
shape-inside: polygon(250px 0, 500px 0, 500px 180px, 500px 320px, 500px 500px, 250px 500px, 0 500px, 0 320px, 0 180px, 0 0);
  -webkit-clip-path: polygon(250px 0, 500px 0, 500px 180px, 500px 320px, 500px 500px, 250px 500px, 0 500px, 0 320px, 0 180px, 0 0);  
}
</pre>

You can see the points being rearranged to form a rectangle in this live demo:

<p data-height="700" data-theme-id="3617" data-slug-hash="17dd591f451f4757366faf3c9246504b" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/SaraSoueidan/pen/17dd591f451f4757366faf3c9246504b'>animating a css shape</a> by Sara Soueidan (<a href='http://codepen.io/SaraSoueidan'>@SaraSoueidan</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>
            
Rearranging the points has a very big effect on the transition. The order of points in the initial shape is preserved when they are rearranged to form the second one, and you need to keep that in mind, otherwise you may end up with a not-so-beautiful transition/animation effect.

The following is an example of what could happen if you randomly rearrange the points. You can see where each point will be placed, and you can tell that that is not the best way to do it.

<p data-height="700" data-theme-id="3617" data-slug-hash="b49058b2d80de2c2463a42daf4d1c9aa" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/SaraSoueidan/pen/b49058b2d80de2c2463a42daf4d1c9aa'>animating a css shape</a> by Sara Soueidan (<a href='http://codepen.io/SaraSoueidan'>@SaraSoueidan</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

So be careful and always make sure you rearrange the points the best possible way that ensures a nice transitioning effect.

#### Animating A Simple Shape Into a Complex Shape

Our last example is the most complex one, but you'll find that it's not really complex at all.

We'll be applying the same concept we applied in the previous example, but instead of starting out with a higher number of points we're going to start with a simple rectangular shape and have it animate into an irregular shape.

We'll have a look at what the final shape looks like, how many points it needs to define it, and then well define the initial rectangle shape using the same number of points. The points will be placed on the edges of the rectangle, and we'll make sure we place them in a suitable way so that they animate to the final shape the way we'd expect them to.

We want to start with a simple two-column layout. Each column is a separate rectangular element. And then when we hover over the columns' container, a shape, a tree in our example, will show in the middle between the two columns, and the two columns will animate their shapes so that they kind of wrap the tree in the middle. This example is inspired by <a href="http://codepen.io/adobe/pen/Cnvuf">this pen</a> by the Adobe Web Platform Team.

So this is how the shapes in our our final demo will look like:

<figure>
  <img src="{{ site.url }}/images/demo-shapes.png" alt="The shapes of the columns in the final demo">
		<figcaption>
      The image shows the shapes that the two text columns will animate to when their container is hovered. The shape on the left shows the points needed to define it. The shape on the right will have a similar point structure.
    </figcaption>
</figure>

I drew this in image Photoshop, even the example tree is actually a shape defined in Photoshop. Again, we're not going to be doing anything fancy in this article, we'll leave that to another one!

The shapes in the image are *similar* to the shapes in the final demo. Of course, there are no coordinates in the image above to the shapes will probably differ a bit when we plot their points on the elements' coordinate systems. So, let's get to it! 

We'll start by creating two columns of text inside a container. We'll use the tree shape as a background to the entire container. At first, the background will be invisible, and then when the container is hovered, the background image will scale up, making it appear as if the tree is scaling up in the middle between the two columns. And as the tree appears, the two columns will animate into their respective shapes shown in the above image.

In order to know how many points are exactly needed, so that we can define them on the rectangle, I'm going to start by defining the **final** shape of the columns, and then move backwards and use the same number of points to define the rectangle.

The right column's final shape can be defined by the following shape function:

<pre class="brush:css">
shape-inside: polygon(0 0, 300px 0, 300px 550px, 30px 550px, 30px 450px, 80px 400px, 100px 400px, 120px 400px, 160px 350px, 120px 250px, 100px 200px,  100px 170px, 100px 160px, 60px 130px, 60px 110px, 0 60px);  
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 550px, 30px 550px, 30px 450px, 80px 400px, 100px 400px, 120px 400px, 160px 350px, 120px 250px, 100px 200px,  100px 170px, 100px 160px, 60px 130px, 60px 110px, 0 60px); 
</pre>

From the above shape, we can now define the initial rectangular shape, by using the same number of points but placing them on the rectangle's edges. Because our shape changes only on the left side, we can place all the animating points on the left edge of the recangle, and then have them move horizontally into their places on hover. This means that it's enough to use the same `polygon()` function as above, but move those points on the left of the shape to the left edge of the rectangle, by giving them all zero abscissa.

<pre class="brush:css">
shape-inside: polygon(0 0, 300px 0, 300px 550px, 0 550px, 0 450px, 0 400px, 0 400px, 0 400px, 0 350px, 0 250px, 0 200px, 0 170px, 0 160px, 0 130px, 0 110px, 0 60px);  
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 550px, 0 550px, 0 450px, 0 400px, 0 400px, 0 400px, 0 350px, 0 250px, 0 200px, 0 170px, 0 160px, 0 130px, 0 110px, 0 60px);              
</pre>

So the final code to animate the shape of the right column when its container is hovered looks like the following:

<pre class="brush:css">
.column-right {
  float: right;
  shape-inside: polygon(0 0, 300px 0, 300px 550px, 0 550px, 0 450px, 0 400px, 0 400px, 0 400px, 0 350px, 0 250px, 0 200px, 0 170px, 0 160px, 0 130px, 0 110px, 0 60px);  
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 550px, 0 550px, 0 450px, 0 400px, 0 400px, 0 400px, 0 350px, 0 250px, 0 200px, 0 170px, 0 160px, 0 130px, 0 110px, 0 60px);
}
.container:hover .column-right {
  shape-inside: polygon(0 0, 300px 0, 300px 550px, 30px 550px, 30px 450px, 80px 400px, 100px 400px, 120px 400px, 160px 350px, 120px 250px, 100px 200px,  100px 170px, 100px 160px, 60px 130px, 60px 110px, 0 60px);  
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 550px, 30px 550px, 30px 450px, 80px 400px, 100px 400px, 120px 400px, 160px 350px, 120px 250px, 100px 200px,  100px 170px, 100px 160px, 60px 130px, 60px 110px, 0 60px); 
}
</pre>

Similarly, we can get the shape functions for the left column. First define the final (more complex) shape, to get the necssary number of points. Then rearragne those points into a rectangle.

<pre class="brush:css">
.column-left {
  shape-inside: polygon(0 0, 300px 0, 300px 60px, 300px 80px, 300px 100px, 300px 150px, 300px 180px, 300px 275px, 300px 375px, 300px 420px, 300px 410px, 300px 440px, 300px 450px, 300px 550px, 0 550px );
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 60px, 300px 80px, 300px 100px, 300px 150px, 300px 180px, 300px 275px, 300px 375px, 300px 420px, 300px 410px, 300px 440px, 300px 450px, 300px 550px, 0 550px );
}
.container:hover .column-left {
  shape-inside: polygon(0 0, 300px 0, 300px 60px, 280px 80px, 240px 100px, 230px 150px, 200px 180px, 160px 275px, 130px 375px, 160px 420px, 240px 410px, 270px 440px, 290px 450px, 290px 550px, 0 550px );
  -webkit-clip-path: polygon(0 0, 300px 0, 300px 60px, 280px 80px, 240px 100px, 230px 150px, 200px 180px, 160px 275px, 130px 375px, 160px 420px, 240px 410px, 270px 440px, 290px 450px, 290px 550px, 0 550px );
}
</pre>

And of course in order to get a smooth shape transition, we need to define a transition on the two columns, and a transition on the container with the same speed and timing function, so that the background and column shapes can animate simultaneously. 

<pre class="brush:css">
.container {
  width: 700px;
  height: 600px;
  margin: 30px auto;
  padding: 25px;
  background: #eee url(http://sarasoueidan.com/blog/animating-css-shapes/images/tree.png) 50% 50% no-repeat;
  background-size: 0;
  transition: all 1s linear;
}
/* scale the background up on hover */
.container:hover {
  background-size: 50% auto;
}

.column {
  /* height and width must be explicitly set otherwise Shapes won't work */
  width: 300px;
  height: 550px;
  text-align: justify;
  background-color: #000;
  color: #ddd;
  /* define same transition duration and timing function as the container's */
  transition: all 1s linear; 
  shape-padding: 10px;
}
</pre>

And this is the final working demo:

<p data-height="750" data-theme-id="3617" data-slug-hash="94e3c9210c418770206487ef8700a1c2" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/SaraSoueidan/pen/94e3c9210c418770206487ef8700a1c2'>94e3c9210c418770206487ef8700a1c2</a> by Sara Soueidan (<a href='http://codepen.io/SaraSoueidan'>@SaraSoueidan</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

It is worth noting here that if the two columns were completely filled with text before they are animated, that text will overflow the shape that it will animate to. This is one of those cases where you would want to take into account the text and shapes before you decide to animate your element's shape.

### Final Words

In this article we went over the basics of animating CSS shapes. All of the shapes we animated here were static, i.e defined in the CSS and animated there. But sometimes, in order to achieve more compelling visual effects, you may want to dynamically create shapes while some element moves on the page. That kind of shape animations can be achieved by creating and animating CSS shapes using Javascript, and is, for now, outside the scope of this article.

The examples and demos I showed in this article are all for demonstration purposes only, and may not make for a practical use-case for animated CSS shapes. But combined with CSS clipping paths, some creative shape-shifting layouts can be created that don't compromise readability of the content.

I hope this article, along with the previous two, helped you get up and running with CSS shapes. Of course, at this time, support for CSS Shapes is still limited, but I highly encourage you to start experimenting with them now, as you could help find and fix bugs, and of course when the time comes and Shapes are widely supported, you'll be Shapes masters by then. :) 

I hope you found this article useful. Thank you very much for reading!

