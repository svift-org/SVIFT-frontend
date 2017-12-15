# ToDos:
---

## Prios:
- Frontend - das Ende (
    - Email yes/no
    - asset download
- If somebody tries to visualise something with a too small window loads of errors are coming up, we should probably define a min-width and -height and if the container is smaller we just show the svift logo and say the container is too small


## Next steps:
- send animation length to backend
- Add Category filter
- Handle font sizes
- Pause gif between loops (in animation or gif meta data?) > there is no pause, i could duplicate the last or either first frame, duplicate frames shouldn't be too bad for filesize (SEB)
- Direct posting to social media (twitter, fb, instagram)

=======

## Test examples 
zahlen taschendiebstähle
zahlen verkehrsunfälle
timeline
cities ranking


## Seb

- Fill "Docs" content (on additional info page)

0: png background -> transparent > this has turned out to be tricky, working on it, turns out, transparent PNGs have weird distortions in the grey fonts?!

favicon not found

html variables unused?!

0: - Chatbot jQuery
0: - medium post: conversational

2: - Socials as SVG

3: - Accessibility Module

- Fix fonts in html export
- check delete of folders

## Alsino
- css nav bug
- Contact social
- bubbles style
- left side icon
- del column button style
- style text toogle
- icons for twitter,facebook,instagram,pinterest,snapchat,google+,linkedin,tumblr

Download page:
- reduce number of fonts on download page??
- I have done an update to the download.html > every vis folder now contains a contents.json, which again contains info on what to expect, i have integrated this into the generation of the download content, but of course the layout is all messed up now. i also added an iframe to the download page so one, can see how an embed looks like

## Hans
- After the page has finished loading, visit heroku...../hello
	hello > will return the number of visits of the user, more importantly if the system has been ideling for a while, it takes a few seconds to get back to running. Calling hello in the beginning will make sure everything is up and running once we reach rendering...

- Sometimes after rendering is done the final message is triggered multiple times

- After Resize we need to make sure to go back to the last/current keyframe, i have done a temporary fix in the renderer which jumps to the last frame after resizing the window, but this should be a default > module.playHead

- Two layouts for viz types
- replace 'set1
- Fix text labels when many data points or long labels
- Ask for email input for link
- Chatbot structure and navigation
- download stuff directly from frontend
- SVIFT.helper.debouncer for input fields
- make all vis-modules responsive
- counter-module -> set position according to font
- Die Preview-Größen funzen teilweise nicht wirklich, weil die einfach zu klein sind. Um das zu umgehen könnte man das neue scale feature nutzen. Damit kann man die Größe verändern und der Inhalt wird währenddessen skaliert. Das mache ich zum Beispiel für die Retina renderings.

## Future:
- Legal Notes im Flow (By using the chatbot you agree to our legal notes (LINK).)
- Show preview of stream for different uses, i.e. facebook, twitter 
- Show tooltips on charts
- Show annotations (i.e. swoopy arrows)
- Style: Gradients in charts?
- add feedback bubble (which vis type would you like to see included -> input)
- Chatbot help -> "Can I help you with you data?""
- fix bug -> nav and logo hiiden when viz is selected