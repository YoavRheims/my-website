---
layout: post
title:  "Creating Non-Rectangular Layouts With CSS Shapes"
image: "css-shapes-header.png"
repo: "css-shapes-layouts"
---

<p class="size-2x">Today we can create all kinds of <a href="http://css-tricks.com/examples/ShapesOfCSS/">shapes with CSS</a> using CSS transforms, but all these shapes do not affect the flow of the content inside or around them. That is, if you create a triangle or a trapezoid with CSS, for example, the shape created does not define or affect the way the text inside it flows, or the way inline text around it does.</p>

<p>With the introduction of CSS Shapes into the web, wrapping content in custom non-rectangular shapes, and recreating print designs and layouts on the web becomes a piece of cake!</p>

<p>In this article we're going to go over the basics of declaring shapes, and creating some simple layouts using these new CSS technologies. When more CSS Shapes features are implemented, more complex and awesome layouts will be possible, but even with what we have at hand now, <a href="http://blogs.adobe.com/webplatform/2013/10/23/css-shapes-visual-storytelling/">some interesting and very creative layouts</a> can be created with a little extra experimentation.</p>

<p> <strong>The CSS technologies we’ll be covering in this article are on the cutting edge and won’t work in all browsers. If you want to see the working live demos you need to make sure you’re viewing them in a browser that supports these technologies. You <em>don't need</em> a supporting browser to understand the features and demos, though. I've included screenshots of the demos so you can see how the final result looks like</strong>.</p>

<div class="note warning">
Notes: 
    <ul>
        <li>
            Most of this article's demos use the
                  <code>shape-inside</code> property, which has been temporarily <a href="https://bugs.webkit.org/show_bug.cgi?id=130698">removed from Webkit</a>
                  and <a href="https://codereview.chromium.org/209443007/">Blink</a>. So, for the time being, this article will
                  only show screenshots of how the demos work when <code>shape-inside</code> is implemented again.
        </li>
    </ul>
</div>

<p>Please note that part of the information mentioned in this article may change when support for CSS shapes is broadened and when more features of the spec are implemented.</p>

### Declaring Shapes

<p>All HTML elements have a rectangular box model which governs the flow of content inside and around it. In order to give an element a custom non-rectangular shape, the <code>shape-inside</code> and <code>shape-outside</code> properties are used. At the time of writing of this article, the <code>shape-outside</code> property can be applied to floating elements only, and the <code>shape-inside</code> property isn't completely implemented, so you may still find bugs when u use it. The shape-* properties can also only be applied to block-level elements. Non-block-level elements should be forced to block if you want to use a shape property on them.</p>

<p>Shape-* properties take one of three values: auto, a basic shape, or an image URI. If the value is set to auto, the element’s float area uses the margin box as normal. (If you’re not familiar with the <a href="http://www.w3.org/TR/2007/WD-css3-box-20070809/">CSS box model</a>, make sure you read up on it because you should know how it works). </p>

<p>If the value is set to a shape function, then the shape is computed based on the values of one of ‘<code>inset</code>’, ‘<code>circle</code>’, ‘<code>ellipse</code>’ or ‘<code>polygon</code>’. You can learn more about each of these functions in <a href="http://blogs.adobe.com/webplatform/2014/02/11/new-css-shapes-syntax/">this article</a> by the Adobe Platform team.</p>

<p> And finally, if the value is set to an image URI, the browser will use the image to extract and compute the shape based on the image’s alpha channel. The shape is computed to be the path that encloses the area where the opacity of the specified image is greater than the <code>shape-image-threshold</code> value. If the <code>shape-image-threshold</code> is not specified, the initial value to be considered is 0.5. The image should be CORS-same-origin, otherwise, it won't work, and the default value <code>auto</code> will be the value of the computed shape.</p>

<p>Shapes defined using the <code>shape-outside</code> property define the <em>exclusion area</em> on an element, while those defined using the <code>shape-inside</code> property define the <em>float area</em> of an element. We'll learn what each of these means in the examples below.</p>

<p>The shapes defined by the shape-* properties can be modified by using the <code>shape-margin</code> and <code>shape-padding</code> properties. The margin and padding shape properties are self-explanatory.</p>

### Establishing a coordinate system on an element

<p>For the CSS shape declared to actually be applied on an element, we need to first start with establishing a coordinate system which we’ll be using to draw the shape.</p>

<p>A coordinate system is necessary because the shapes you declare will be defined by a set of points (and radii if you’re drawing circles or ellipses for example), and these points have x and y coordinates which will be placed on this coordinate system.</p>

<p>The shape-* properties use the content box of the element they’re applied to for their coordinate system, so in order to make them work, <strong>you need to specify a fixed width and height for the element</strong> which defines its bounding box, which in turn will be used to establish the coordinate system for the shapes you draw. <strong>If no explicit width and height are specified, the shape-* properties don’t work</strong>.</p>

<p>The origin of the coordinate system defined on the element's bounding box is positioned at the top left corner.</p>

<p>So, to declare a shape an element you have to start with:</p>

<ol>
    <li>Specifying the dimensions of the element getting the shape (remember: the element should be floated when using <code>shape-outside</code> on it).</li> 
    <li>Declaring the shape on that element using the shape-* properties.</li>
</ol>

### Applying a background to a custom shape

<blockquote class="quotes-left">
    <p>While the boundaries used for wrapping inline flow content outside a float can be defined using shapes, <strong>the actual box model does not change</strong>. If the element has specified margins, borders or padding they will be computed and rendered according to the <a href="http://www.w3.org/TR/css-shapes/#CSS3BOX">CSS3BOX</a> module. 
    <cite>&#8212;<a href="http://www.w3.org/TR/css-shapes/">W3C CSS Shapes Module Level 1</a></cite>
    </p>
</blockquote>

<p>In other words, the shape you define on an element using shape-* properties <em>only</em> affects the element’s float area, i.e. the flow of the content inside/outside this element, but all the element’s other properties won’t be affected.</p>

<p>For example, suppose you only want to draw a circular shape and have content float on its side like the shape in the image below, you’d first have to declare the circular shape on the element (again, remember to float the element and give it a height and width). Then, say you want to apply a background color to the circular shape to look like the one in the image..</p>

<figure>
    <img src="{{ site.url }}/images/shape-background.png" alt="Background applied to CSS shape" />
    <figcaption>Background applied to a custom declared shape</figcaption>
</figure>

<p>You’d be tempted to just add a background color to the containing element and then end up with the above result (that’s what I did the first time), but doing that won’t do the job. The reason for that is that all properties of the element, other than the flow of content outside it, won’t be affected by the shape you defined inside it, and they will be rendered normally according to the element’s box model (its rectangular shape), as we’ve seen in the spec. So if you apply a background color to it, you’ll end up with this.</p>

<figure>
    <img src="{{ site.url }}/images/box-model-background.png" alt="Background applied to rectangular box model" />
    <figcaption>Background applied to the element's rectangular box shape</figcaption>
</figure>

<p>So, <em>how can we apply the color to the shape only and not the whole element?</em> This is where the <code>clip-path</code> property from <a href="https://dvcs.w3.org/hg/FXTF/raw-file/default/masking/index.html">the CSS Masking specification</a> can help.</p>

<p>The <code>clip-path</code> property will be used to <em>clip</em> parts of the element that we don’t need and keep only the parts inside the shape we defined. That obviously means that we’re not actually applying the color <em>to</em> the shape, we’re just <em>trimming</em> the element and leaving only the shape intact. With this, you’ll end up with a floating circle wrapping text outside it.</p>

<p><em>How, exactly? what value does the clip-path property get to do this?</em></p>

<p>The user coordinate system for the shapes defined by the <code>clip-path</code> property is established using the bounding box of the element to which the clipping path is applied, so the coordinate system is the same one as that of the shape-* properties.</p>

<p>Because of this, we can use the same shape defined in the shape-* property for the clip path, which will cut out, or <em>clip</em>, everything inside the containing element that’s outside the boundaries of the shape, and we’ll end up with a custom shape with a background.</p>

<p>You can test this concept live in <a href="http://codepen.io/SaraSoueidan/pen/ad12e1280e4b1c481faa3b82bd9a3263">this pen</a>, just make sure you test it in a supporting browser.</p>

### Quick Reminder

<p>At the time of writing of this article, the <code>shape-outside</code> property only works on floats, and both <code>shape-outside</code> and <code>shape-inside</code> properties are applied only to block-level elements, or inline elements <strong>forced to block</strong>. A shape defined on a float will cause inline content to wrap around the defined shape instead of the float's bounding box. Future levels of CSS Shapes will allow use of shapes on elements other than floats, and when that happens we’ll be able to wrap content on both sides of a shape (as in the image below). So for now, we can only float an element and have content flow  on either side of it.</p>

<figure>
    <img src="http://dev.w3.org/csswg/css-shapes-2/images/shapes_CSS2.1_MBP.png" alt="Example rendering of circle shape and box model." />
    <figcaption>Flowing content on both sides of a CSS shape</figcaption>
</figure>

<p>You could also fake wrapping content on both sides using the <a href="http://betravis.github.io/shape-tools/exclusion-punch/">Exclusion Punch plugin</a> by <a href=" https://twitter.com/bear_travis">Bear Travis</a>.</p>

<p>Now let’s get our hands dirty drawing some shapes and creating some fun layouts!</p>

<p>Each of the following examples will introduce a new tip/idea/technique that are used to define and use CSS shapes and exclusions.</p>

<p><strong>You can view the live demo for each example by clicking on the demo's screenshot.</strong></p>

<h3>Example #1: Floating text around a custom shape with <code>shape-outside</code></h3>

<p>We’ll start with a simple example. In this example we’re going to define a custom shape and have content flow on its side. The end result will look like the image below:</p>

<a href="{{ site.url }}/demos/css-shapes-layouts/demo-1/index.html">
    <figure>
        <img src="{{ site.url }}/demos/css-shapes-layouts/demo-1/images/demo-screenshot.png" alt="Screenshot of Demo #1">
        <figcaption>Screenshot of Demo #1. Click on the screenshot to see the working demo.</figcaption>
    </figure>
</a>

<p>In the demo we have a container which contains two elements: a <code>.content</code> container with text on the left, and another element with a class<code>.shaped</code> floated to the right, which will get the custom shape and have the text flow on its left side.</p>

<p>The heading in the <code>.content</code> area is also getting a similar treatment to the one we're giving the floated div on the right, so I'll skip its explanation and only talk about what we're doing on the <code>.shaped</code> area on the right.</p>

<pre class="brush:html">
&lt;div class="container"&gt;
    &lt;div class="shaped"&gt;&lt;/div&gt;
    &lt;div class="content"&gt;
         &lt;h1&gt;&lt;span&gt;La&lt;/span&gt; Tour &lt;br/&gt;Eiffel&lt;/h1&gt;
         &lt;p&gt;Lorem Ipsum......&lt;/p&gt;
    &lt;/div&gt;
&lt;/div&gt;
</pre>          

<p>We will first start by giving the floated <code>div</code> on the right a specific height and width to establish a coordinate system. We’ll set its height to be the same as its container, which for this demo I’ve set to be the same height as the viewport, using CSS’s <code>vh</code> unit.</p>

<pre class="brush:css">
.container{
    overflow:hidden;
    height: 100vh;
    width: 100vw;
}
.shaped{
    float:left;
    height:100vh;
    width:40vw;
    float:right;
    background: black url(../images/eiffel.jpg) center top no-repeat;
    background-size:cover;
}
</pre>

<p>Now that the coordinate system is ready, we’re going to draw the shape, to define the float and exclusion areas of the element. There are two ways to go about declaring a shape for this demo:</p>

<h4>Using <code>polygon()</code></h4>

<p>For the first method, we’ll be using the polygon() function. This function takes in a set of points that form the polygon, each point defined by x and y coordinates. We're going to define a very simple polygonal shape, with 4 vertices, as shown in the image below (blue and orange discs):</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-1/images/demo-shape.png" alt="Vertices of the Polygon">
    <figcaption>Screenshot showing the vertices making up the polygonal shape</figcaption>
</figure>

<p>The coordinates of the points can have either specific values (px or em), or percentage values. In this example we're going to provide percentage values for the vertices visible in the above screenshot. Now all we have to do is just declare this shape on the floated element so that the text flows on its side.</p>

<pre class="brush:css">
.shaped{
    /*...*/
    shape-outside: polygon(0 0, 100% 0, 100% 100%, 30% 100%);
    shape-margin: 20px;
}
</pre>

<p>And that’s it! the text can now flow in the <em>float area</em> of the element, defined by the custom shape we declared on it.</p>

<p>You can also see that I've added a margin to the shape, to push the content away from the shape a little and create a gap.</p>

<p>But we have one more thing to add here. Like I mentioned in a previous section, the background of the floated element is applied to its original rectangular shape, not just to the shape we declared on it, because the background property is not affected by the shape declared on the element. So far, the demo looks like this:</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-1/images/demo-screenshot-incomplete.png" alt="Screenshot of background applied to rectangular shape of the element">
    <figcaption>Screenshot showing the background applied to the element covering its rectangular shape</figcaption>
</figure>

<p>So in order to clip out the excess areas that we don't need, we're going to use the <code>clip-path</code> property, and give it the same value/shape that we gave to the <code>shape-outside</code> property above. So we add this rule to the rule set:</p>

<pre class="brush:css">
.shaped{
    /*...*/
    clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 100%);
}
</pre>

<p>And we're done! Simple, right? </p>

<p>The page title on the left gets the same treatment as the <code>.floated</code> <code>div</code> on the right. The heading is floated inside its container <code>.content</code>, it is given a specific height and width to establish a coordinate system, and then a shape is declared on it using the <code>shape-outside</code> property just like we did on the <code>.floated</code> element.</p>

<h4>Using an image URI</h4>

<p>Another way we could define the shape on our element is by using an image with an alpha channel, that is, any image with transparent areas.</p>

<p>For our example here, instead of using the polygon() function to define the shape, we’ll give the <code>shape-outside</code> property an image URI, and the browser will extract the shape from the image, and use it.</p>

<p>The image that would define the exclusion area for this example is the one shown below. You can see that the image shows the same shape defined by the polygon() points in the previous method.</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-1/images/mask.png" alt="Image with Alpha Channel showing the polygonal shape">
    <figcaption>Image with Alpha Channel whose URI will be used to extract and compute the value of the shape</figcaption>
</figure>

<p>When you’re using an image with alpha channels to define a shape <strong>for the shape-outside property</strong>, the <em>transparent area</em> of the image will define the area where the inline text flows, this is the area called the <em>float area</em> of the element. The black portion defines the exclusion area of the element.</p>

<p>To use this image we write the following:</p>

<pre class="brush:css">
.shaped{
    /*...*/
    shape-outside: url(../images/mm.png);
    shape-image-threshold: 0.5;/* this property is used to set the threshold used for extracting a shape from an image. 0.0 = fully transparent and 1.0 = fully opaque */
}
</pre>

<p>Each of the two methods mentioned has its advantages. You might want to use an image URI for complex shapes that may be cumbersome to define the points for manually, in this case creating an alpha channel image in Photoshop would be much easier and faster than manually adding the points.</p>

<p>Another situation where you might want to use an image URI instead of a shape function is when you have multiple float or exclusion areas inside an element, in that case using this method is necessary because you can’t, for now, declare multiple shapes on an element, but if the image contains multiple areas, the browser will extract these areas from the image and use them. Pretty neat, right? :) we’ll see an example of this in the last demo.</p>

<h3>Exmaple #2: wrapping/flowing text inside a custom shape with <code>shape-inside</code></h3>

<p>For the second example we’ll create a simple demo where the end result will look like this:</p>

<a href="{{ site.url }}/demos/css-shapes-layouts/demo-2/index.html" class="image-link">
    <figure>
        <img src="{{ site.url }}/demos/css-shapes-layouts/demo-2/images/demo-screenshot.png" alt="Screenshot of demo #2">
        <figcaption>Screenshot of demo #2</figcaption>
    </figure>
</a>

<p>The goal of this example is to demonstrate the <code>shape-inside</code> property used to float text inside a non-rectangular shape. We have a container element with some placeholder text inside it, and we applied the photo as a background image to this container.</p>

<pre class="brush:html">
&lt;div class="container"&gt;            
    &lt;div class="content"&gt;
        &lt;p&gt;...&lt;/p&gt;
    &lt;/div&gt;
    &lt;h2&gt;Corn Bread&lt;/h2&gt;
&lt;/div&gt;
</pre>

<p>As you can see from the demo screenshot above, the text is wrapped inside a circular shape at the top. So, we know that we’re going to have to declare a circle on our container. Now, like in the previous example, there are two ways we can do that..</p>

<h4>Using <code>circle()</code></h4>

<p>Using the <code>circle()</code> function we're going to define a circle and position it on our element.</p>

<p>The image below shows the coordinate system established on the element, and the position of the circle inside the element. We’re making sure the circle is positioned on top of the pan image inside the photo we’re using as a background, so that it appears as if the text is contained inside that pan. On the image the position of the center of the circle with respect to the coordinate system established on the element is also visible.</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-2/images/demo-shape.png" alt="Coordinate system and shape defined on the container">
    <figcaption>Coordinate system and shape defined on the container</figcaption>
</figure>

<p>Because we want to wrap text <em>inside</em> a custom shape, and not flow it around it, we’re going to use the <code>shape-inside</code> property on the element containing this text. When you're applying the <code> shape-inside</code> property to an element, you have to remember that this element would have the text content inside it, unlike the previous example, where the content was outside the element we declared the shape on.</p>

<p> We’ll specify the coordinates of the center of the circle and we'll set the value of its radius, and apply those to the container:</p>

<pre class="brush:css">
.container{
    float:left;
    width:600px;
    height:900px;
    overflow:hidden;
    margin:0 50px;
    color:white;
    font-size:13px;
    padding:10px;
    background: url(../images/pan.jpg) top left no-repeat;
    background-size:100% 100%;
    /*declare shape using the shape function circle()*/
    shape-inside: circle(160px at 400px 60px);
}
</pre>

<p>Of course, unless you're attempting to create a perfect circular shape, you can also define the shape using <code>polygon()</code>.</p>

<h4>Using an image URI</h4>

<p>We can also use the URI of an image with an alpha channel to extract the shape of the circle from it. The image would look like the following: </p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-2/images/mask.png" alt="Image with Alpha Channel showing the circular shape
              ">
    <figcaption>Image with Alpha Channel defining the circular shape</figcaption>
</figure>

<p> It’s important to note here that when you’re using an image with an alpha channel to define a shape <strong>for the <code>shape-inside</code> property</strong>, the <em>black (or opaque) area</em> of the image will define the area where the text flows. In the previous example, the opaque area defined the <em>exclusion area</em> of the element we applied the shape to, i.e the area where <strong>no</strong> text flows.</p>

<p>So declare the shape using an image URI instead of the shape function <code>circle()</code>, you'll have to set the value of the <code>shape-inside</code> property to point to the URI of the image:</p>

<pre class="brush:css">
.container{
    /*...*/
     shape-inside: url(mask.png) top left;
}
</pre>

<h3>Example #3 : wrapping/flowing text inside a custom shape with <code>shape-inside</code></h3>

<p>In this example we're also going to declare a polygonal shape on a container and have its content flow inside this shape. The end result will look like the image below:</p>

<!-- <a href="{{ site.url }}/demos/css-shapes-layouts/demo-3/index.html" class="image-link"> -->
<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-3/images/demo-screenshot.png" alt="Screenshot of Demo #3">
    <figcaption>Screenshot of Demo #3</figcaption>
</figure>
<!-- </a> -->

<p>Here, too, we can use either a shape function or an image URI to declare the shape on the element.</p>

<p>The shape declared on this container is clearly a "random" polygonal shape, not a geometric shape that we could declare using a shape function like <code>circle()</code>, <code>ellipse()</code>, or <code>inset()</code>, so we're going to use the <code>polygon()</code> function to declare it.</p>

<p>The shape defined by a set of points is visible in the image below.</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-3/images/demo-shape.png" alt="The polygonal shape defined by a set of points">
    <figcaption>The polygonal shape defined by a set of points</figcaption>
</figure>

<p>Because there's a fairly large number of points making this shape up, it would be cumbersome to calculate the coordinates of these points, so it would be helpful if there was a <strong> visual</strong> tool available to help us <em>plot</em> these points on the image, right? Well, there is a tool created by Adobe's <a href=" https://twitter.com/bear_travis">Bear Travis</a>, which is actually a collection of tools that can help you when working with CSS shapes. Make sure you <a href="http://betravis.github.io/shape-tools"> check the Shape Tools out</a> because they are very valuable.</p>

<p>One of the Shape tools mentioned is called <a href="http://betravis.github.io/shape-tools/polygon-drawing/">Poly Draw</a>, and it allows you to manually "draw" a shape, a polygon in particular, and then it generates the coordinates of the shape for you to copy and paste into your CSS to declare the shape on your element.</p>

<p>I have used the Poly Draw tool to draw the above shape on the image. Now, the tool does not take an image and sets it as a background for the element you define the shape on, so I had to git clone the repo of the tool and fiddle with the tool’s code a bit in the dev tools, and I applied the image to it and plotted the points on it.</p>

<p><a href="https://twitter.com/razvancaliman">Razvan Caliman</a> suggested this idea when I asked him about the availability of a tool that allows us to define shapes on top of images right in the browser, just like the one he showed and used in <a href="https://www.youtube.com/watch?v=zsLwZhTSuQk&list=PL8rji95IPUUDu3puqqxWMKFXf-NQ4z7WE&index=11">his talk at this year's CSS Conf EU</a>. If you haven't watched his talk yet, make sure you do. The tool he used will some day, soon I hope, be open-sourced by Adobe, and then it'll be an indispensible tool when working with CSS shapes. But until then, you could do with the Poly Draw tool.</p>

<p>After drawing the shape with the Poly Draw tool, all you have to do is declare the resulting shape on your element and you're good to go.</p>

<pre class="brush:css">
.container{
    width:445px;
    height:670px;
    overflow:hidden;
    margin:30px auto;
    /*shape generated by the Poly Draw tool*/
    shape-outside: polygon(170.67px 291.00px,126.23px 347.56px,139.79px 417.11px,208.92px 466.22px,302.50px 482.97px,343.67px 474.47px,446.33px 452.00px,443.63px 246.82px,389.92px 245.63px,336.50px 235.26px,299.67px 196.53px,259.33px 209.53px,217.00px 254.76px);
}
</pre>

<p>We could also define the shape above using an image with an alpha channel. The image below shows what that image would look like. Again, the black areas define the float area when using <code>shape-inside</code>, and they're where the text is going to flow.</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-3/images/mask.png" alt="Image with alpha channel defining the shape for demo #2">
     <figcaption>Image with alpha channel defining the shape for demo #2</figcaption>
</figure>

<p>If you want to go with the image URI instead of the shape function, youd replace the above shape outside value with the following:</p>

<pre class="brush:css">
.container{
    /*...*/
    shape-inside: url(mask.png) top left;
}
</pre>

<h3>Example #4 : Multiple float areas with <code>shape-inside</code></h3>

<p>In this example we're going to create multiple float areas inside an element to wrap content inside. The result of this demo is shown in the following image:</p>
  
<!-- <a href="{{ site.url }}/demos/css-shapes-layouts/demo-4/index.html" class="image-link"> -->
<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-4/images/demo-screenshot.png" alt="Screenshot of Demo #3">
    <figcaption>Screenshot of Demo #3</figcaption>
</figure>
<!-- </a> -->

<p>We have a <code>div</code> with a background image, and we want the text inside this <code>div</code> to flow inside specific areas inside it, all of which have custom shapes.</p>

<pre class="brush:html">
&lt;div class="container"&gt;
    &lt;div class="content"&gt;
        &lt;h2&gt;Rosemary Sandwich&lt;/h2&gt;
        &lt;p&gt;...&lt;/p&gt;
    &lt;/div&gt;
&lt;/div&gt;
</pre>

<p>Now, since we can't declare multiple shapes on an element, we're going to use an image with an alpha channel. An image can contain as many shapes and areas as you want, so it's perfect to define multiple shapes on an element, and the browser will extract all the shapes from this image and use them on the element.</p>

<p>We'll use the following image to define the shapes. The black areas in the image will define the float area of for the content inside the <code>.container</code> where the text will flow.</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-4/images/mask.png" alt="Image with Alpha Channel defining shapes for demo #3">
    <figcaption>Image with Alpha Channel defining shapes for demo #3</figcaption>
</figure> 

<p>We'll use the URI of this image as a value for the <code>shape-inside</code> property that we're going to declare on the <code>.container</code>, all the while remembering to set height and width values for the <code>div</code>:</p>

<pre class="brush:css">
.container{
    width:556px;
    height:835px;
    overflow:hidden;
    margin:0 50px;
    color:white;
    position:relative;
    background: url(../images/bread.jpg) top left no-repeat;
    background-size: 100% 100%;
    shape-inside: url(mask.png) top left;
    font-size:13px;
}
</pre>

<p>And we're done. The browser does the rest of the work for us by extracting the shapes from the image we gave it, and our text flows nicely inside those areas!</p>

<p>Using an image to define the shapes is the logical way to go when you have separate areas that are not connected to eachother, i.e that don't form a singe polygonal shape. For this demo, we could have used the <code>polygon()</code> function to define the shape, by defining a polygon that looks like the one in the image below:</p>

<figure>
    <img src="{{ site.url }}/demos/css-shapes-layouts/demo-4/images/demo-shape.png" alt="Image of shape defined using polygon()">
    <figcaption>Image representing the points used to define a single polygon</figcaption>
</figure>

<p>But, as you can notice, this isn't the best way to do this, I just added this to show the difference between using an image and defining the shape with <code>polygon()</code>, and to show that sometimes the best practice or the one that seems more proper and makes more sense is to use an image, even if you can use a shape function to define your shapes.</p>

<h3>Combining CSS Shapes with Regions and Flexbox to create magazine layouts</h3>

<p>Typical print magazines usually combine multi-column text layouts with non-rectangular shapes to create creative and appealing designs. The columns are usually equal in height unless needed otherwise.</p>

<p>Once future CSS Shapes features are implemented, and wrapping content on both sides of a shape is possible, creating print-like digital magazine designs becomes very much possible when combining Shapes and Exclusions with Regions and Flexbox.</p>

<a href="http://www.behance.net/gallery/Travel-Magazine/2159303">
    <figure>
        <img src="{{ site.url }}/images/multicolumn-shapes.png" alt="Multi-column layouts with shapes">
        <figcaption>Travel Magazine by Bartosz Kwiecień on Behance. Layout like this could be replicated using future CSS Shapes technologies and Regions</figcaption>
    </figure>
</a>

<p>Flexbox provides us with the equal-height columns, Regions allows us to flow text into different areas on the page and separate the page content from its layout, and Shapes and Exclusions will allow us to add that final creative touch that takes our magazine layouts to the next level.</p>

<h3>Final Words</h3>

<p>I don’t think I’ve been excited about a new CSS feature as I am about CSS shapes and exclusions. The power, flexibility, and creativity that these features combined regions and flexbox can provide is just fantastic!</p>

<p>Widespread support for CSS Shapes should be coming soon, as the web platform team at Adobe is constantly working on improving and implementing these features, and providing tools to make working with them easier.</p>

<p>The future of web layout is looking brighter and more captivating every day. It's a wonderful time to be a web developer!</p>

<p>I hope this article helped introduce you more to the technical part of getting started with CSS Shapes. This will not be my last article on this topic. Combining CSS Shapes with other cutting edge CSS technologies like Regions opens the door to a new world of creativity, and lots of new tutorials! ;)</p>

<p>You should subscribe to my blog's <a href="http://feeds.feedburner.com/sarasoueidan">RSS feed</a> and <a href="http://twitter.com/SaraSoueidan">follow me on Twitter</a> to stay in the loop for upcoming new articles.</p>

<p>Thank you for reading!</p>

<h3>Resources &amp; Further Learning</h3>
            
<ul class="resources">
    <li>Bear Travis’s <a href="http://betravis.github.io/shape-tools/">CSS Shape tools</a> </li>
    <li>W3C's <a href="http://www.w3.org/TR/css-shapes/">CSS Shapes Working Draft</a></li>
    <li>CSSWG Wiki on <a href="http://wiki.csswg.org/ideas/css3-exclusions-use-cases">CSS Shapes and Exclusions use cases examples</a></li>
    <li>Adobe’s <a href="http://html.adobe.com/webplatform/layout/shapes/browser-support/">CSS shapes support matrix</a></li>
    <li>Adobe Web Platform's <a href="http://html.adobe.com/webplatform/layout/shapes/">resources for CSS Layout</a></li>
    <li><a href="https://github.com/betravis/web-layout-lab">This project</a> by Bear Travis contains a series of exercises demonstrating new web platform layout features including an combining CSS Flexbox, Grid, Regions, Shapes, and Exclusions.</li>
    <li><a href="http://galjot.si/css-exclusions">CSS Exculsions article</a> by<a href="http://galjot.si/"> Robert Sedovše</a> </li>
</ul>

<p><em>This article wouldn’t have been possible without the great help from <a href="http://razvancaliman.com/">Razvan Caliman</a>, so a big thanks goes to him.</em></p>








