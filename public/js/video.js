 // Load the YouTube IFrame Player API asynchronously
 const tag = document.createElement('script');
 tag.src = 'https://www.youtube.com/iframe_api';
 const firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 let player;
 function onYouTubeIframeAPIReady() {
     player = new YT.Player('video-background', {
         videoId: 'wqcQkjlhbW4',
         playerVars: {
             autoplay: 1,
             mute: 1,  // Mute the video
             controls: 0,
             showinfo: 0,  // Hide video title
             rel: 0,
             modestbranding: 1,
             fs: 0  // Disable share button
         },
         events: {
             onReady: onPlayerReady
         }
     });
 }

 function onPlayerReady(event) {
     // Start playing the video
     player.playVideo();
 }