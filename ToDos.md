# ToDos:

---


# re:publica
----

Alsino:
- Subdomains

Hans:
---
- integrate logo
- fix viz line ?
- grid: number sehr stark pixelig

Seb:
---
- Not rendered correctly:
    - Position Heading/subheading
    - Font-families
    - Font weights
    - Colors
- hide imput text is not working
- text input breaks firefox when line break or text tto long
- improve renderer?



Only if vis is not redrawn after tabel input:
- somehow show whole animation if user wants to (barcharts). 
    - Show whole animation for some visses if user types in new data (e.g counter, mosiac)
- source input not working
- tabel input does not upddate vis
    - also removing a column after having 3 columns produces weird bug
    - also mosaic % nuber moves down when colors chnage



----

* status > social => 1
* Should we reduce frames per second? > less filesize, less pngs, overall faster
* let people know when wait is long
* info pro version (in the break)

MILESTONE 2 - private testing small (Tagesspiegel) > Mid April (13.04)

* Line Chart, Donut Chart, Icon Chart, Grouped / Stacked-Bar-Charts

## Seb

    - pie/area/line (optional)
    ✓ stiftung > tester
    - SCHRIFTEN EINFACHER BEARBEITEN, > json
    	{
    		provider: google, typekit, custom
    		name:
    		...
    	}
    ✓ clear AWS regularly
    - Accessibility auf die Download Site
    - SVIFT: if folder exists > delete
    - favicon not found
    - Handle font sizes
    - Text Input
    - Customized INstances (colors, fonts, logos, default GUI)
    - Transfer sketch design to application (no bot)

## Alsino

    - Logo position (bottom right)

## Hans

    - Logo von Tagesspiegel und Schriften
    - Tagesspiegel > Tweetdeck > Gifs ?
    - Flughafen-Counter > Transform into transitions

=======

MILESTONE 3 - private testing big

## Seb

    - medium post: conversational
    - db for feedback

## Alsino

## Hans

    - After Resize we need to make sure to go back to the last/current keyframe, i have done a temporary fix in the renderer which jumps to the last frame after resizing the window, but this should be a default > module.playHead
    - Two layouts for viz types
    - make all vis-modules responsive
     - feedback text field

=======

MILESTONE 4 - public alpha

## Seb

    - Frontend - Email yes/no
    - HTTPS
    - statistics on heroku connect via firebase IDs
    - Fill "Docs" content (on additional info page)
    - 0: png background -> transparent > this has turned out to be tricky, working on it, turns out, transparent PNGs have weird distortions in the grey fonts?!
    - legal disclaimer (cookies etc)

## Alsino

## Hans

* Add Category filter
* Direct posting to social media (twitter, fb, instagram)
* If vis too small: warning!
* hello message when user returns the second time

=======

Nice to have

* send animation length to backend
* Chatbot jQuery
* colorpicker
* Fix text labels when many data points or long labels
* Show tooltips on charts
* Show annotations (i.e. swoopy arrows)
* Chatbot help -> "Can I help you with you data?""

## Test examples

zahlen taschendiebstähle
zahlen verkehrsunfälle
timeline
cities ranking
