
# task list for today 

- [x] set up email service and email confirmation 
- [] account page (working on now )
  - [] reset password
  - [] update email address (user email )
  - [] cancel trial 
  - [] cancel account 

  ### notes on the account page 
 - on the account page the ui needs to show perinent user profile information
 - display useremail/username 
 - give option to change password 
 - give optoin to change the user email and trigger another email confiramtion 
 - display status of trail 
 - display subscription status (subscribed, suspended)
 - function to cancel the subscription 
- [] custorm service email (tech support ) 
- [] last design home landing ( polish )
- [] test stripe time feature 14 free trail test out what 14
  - 11 day in your trial 
   - [] confrim subscrition 

  - [] kill featuer when card is delicie 
  





# task list for today 
- [] make sure create new event page is working and user can select a band to relate to the event
- [] add dannys event 
- [] check the edit event works
- [] sign up for proton mail and get the email confirmation working 
- [] add a description to the analytics icon 
- [] write more information about the free trial 
- [] give danny a login and password 
- [] create a way for user to reset password 
- [] email confirmation ? for new user sign up 
- [] change section on lading page that is using swiper for the preview images of the link tree page 
- [] add a way for user to cancle thire trial or membership
- [] lock user out is after trail 
- [] have candy beta test the app 


## music 
- [] custom album or streaming embeded content both 
  - [] add spotify 
  - [] refactor form to allow for custom audio or streaming ebeded content 

- [] add single for proper nomenclature for singles 



## band page 
- [] add photo gallery 

# notes on zoom 

- [] rework text !important 
  - home page 
    - hero section 
      - bullet point 
      - add analytics to bullet points analytics tracking 
        - branded qr or create qr codes (create qr codes )
  - feature music pages feature your content product content links 
  - connnect social media links, streaming, websites 
  - create an account create account / member login 
  - splash pages for heading 
  - example splash page 
  - change band page lingo ... artist music artist !!!
  - music player 
  - social to social media 

  - make splash page buttons move user friendly hover effect 

  - change text in splash page photos 
  - your link use the word you in the context  text 
  - desktop mobile  optimized 


## Saturday list

- [] problems with edit album the image 

## home page 
- [] 

### band page 
- [] add video grid to band page 
- [] add proper space to streaming buttons 
  - [] add add the streaming platforms as buttons 
- [] make a descion on the hero image sizing constraints 
- [] use differnet images for all fake data types 


### Create Band Page 

- [] form for uploading image 
  - [] make preview image smaller and center 
  - [] move the button below the image 

### Home page 

- [] add all the screen shots for the mobile spalash pages 
- [] add a grid of branded qrs

- [] fix loading icon on the create all my social links
- [] loading icon on the create event page 
- [] fix margins and padding layout on the create album page ... add more space 
- [] give user indication of the song file ie list name of file and hide the button 


























import { ref, useRuntimeConfig } from '#imports'
import { loadFull } from 'tsparticles'
import { tsParticles } from '@tsparticles/engine'

const { mode } = useRuntimeConfig().public.particles

const show = ref(false)

if (import.meta.client && mode === 'custom') {
  await loadFull(tsParticles)
}

const options = {
  // fullScreen: {
  //   enable: true,
  //   zIndex: -1
  // },
  style: {
    position: 'absolute',
    height: '290px',
    padding: '1rem'
  },
  particles: {
    color: {
      value: "#fgfgfg"
    },
    links: {
      color: "#000",
      enable: true
    },
    move: {
      enable: true
    },
    number: {
      value: 30function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColors() {
  const paths = document.querySelectorAll('.animated-path');
  paths.forEach(path => {
    path.style.fill = getRandomColor();
  });
}

function animateColors() {
  setInterval(changeColors, 2000);
}

onMounted(() => {
  animateColors();
});
    }
  }
}
