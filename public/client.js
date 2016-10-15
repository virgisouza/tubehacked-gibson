const socket = io.connect('http://localhost:8081');
const videoFrame = document.querySelector('.video_iframe');
const leftContainer = document.querySelector('.left');
const attemptsContainer = document.querySelector('.attempts');
const Banner = document.querySelector('.banner');

socket.emit('client');

const updateAttemptLog = (data) => {
  let topAttempt = document.querySelector('.attempt:first-child');

  let newAttempt = document.createElement('li');
  newAttempt.classList.add('attempt');

  let attemptText = document.createElement('p');
  attemptText.innerHTML = `<span>${data.username}</span> failed with <span>${data.guess}</span>`;
  newAttempt.appendChild(attemptText);

  attemptsContainer.insertBefore(newAttempt, topAttempt);
};

const videoSplatter = (mainFrame) => {
  anime({
    targets: mainFrame,
    translateX: function() { return anime.random(0, 50) + 'rem'; },
    scale: function() { return anime.random(10,20) / 20; },
    rotate: function() { return anime.random(-360 , 360); },
    duration: function() { return anime.random(1000,2000); },
    direction: 'alternate',
    loop: false
  });
};

const attemptsKill = (frames) => {
  anime({
    targets: frames,
    translateX: function() { return anime.random(-10, 10) + 'rem'; },
    translateY: function() { return anime.random(-10, 10) + 'rem'; },
    scale: function() { return anime.random(10,20) / anime.random(-10, 10); },
    rotate: function() { return anime.random(-360 , 360); },
    duration: function() { return anime.random(2000,2000); },
    direction: 'alternate',
    loop: false
  });

  setTimeout(_ => {
    frames.forEach(frame => frame.remove());
  }, 5000);
}

const displayWinner = (banner, winner) => {
  let p = document.createElement('p');
  p.classList.add('letter');

  p.innerHTML = winner.split('')
    .map(letter => {
      return `<span>${letter}</span>`;
    }).join('');

  banner.appendChild(p);

  let changeCount = 0;

  let intervalID = setInterval(_ => {
    if (changeCount > 28) {
      clearInterval(intervalID);
      p.innerHTML = '';
    }

    p.querySelectorAll('span').forEach(span => {
      span.setAttribute('style', `background-color: ${getRandomColor()}`)
    });
    changeCount++;
  }, 250)

  anime({
    targets: '.letter span',
    scale: function() { return anime.random(3, 5); },
    duration: function() { return anime.random(1000,2000); },
    direction: 'alternate',
    loop: true
  });
}

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

socket.on('video_change', function(data) {
  videoFrame.setAttribute('src', `https://www.youtube.com/embed/${data.video_id}?rel=0&autoplay=1`);

  videoSplatter(videoFrame);
  attemptsKill(attemptsContainer.querySelectorAll('.attempt'))
  displayWinner(Banner, data.username)
});

socket.on('attempt', function(data) {
  updateAttemptLog(data);
})