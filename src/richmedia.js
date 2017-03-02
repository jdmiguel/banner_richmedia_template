var Richmedia = (function(){
  function Richmedia(containerRichmedia,imgPath,videoPath,frameObj,videoObj,timelineObj){
    Richmedia.scope = this;

    this.containerRichmedia = containerRichmedia;
    this.imgPath = imgPath;
    this.videoPath = videoPath;
    this.frameData = frameObj;
    this.timelineData = timelineObj;
    this.videoObj = videoObj;
    this.dataRichmedia;

    this.arrayFrames = [];
    this.arrayElements = [];

    this.counterImg = 0;
    this.totalImg = 0;

    this.containerVideo;
    this.poster;
    this.arrayBtn = [];
    this.player;
    this.firstClick = true;

    this.clicktag;

    this.iteration = 0;
    this.numTween = 0;
    this.lastLabelName;

    this.configureRichmedia();
    this.addListeners();
  }

  Richmedia.prototype.configureRichmedia = function(){
    this.dataRichmedia = {
      width: this.containerRichmedia.getAttribute('data-w'),
      height: this.containerRichmedia.getAttribute('data-h'),
      bgColor: this.containerRichmedia.getAttribute('data-bg-color'),
      border: this.containerRichmedia.getAttribute('data-border'),
      preload: this.containerRichmedia.getAttribute('data-preload'),
      cover: this.containerRichmedia.getAttribute('data-cover')
    }

    /* SET MAIN STYLES */

    this.containerRichmedia.style.width = this.dataRichmedia.width + 'px';
    this.containerRichmedia.style.height = this.dataRichmedia.height + 'px';
    this.containerRichmedia.style.backgroundColor = this.dataRichmedia.bgColor;
    this.containerRichmedia.style.border = this.dataRichmedia.border;

    /* SET COVER */

    if(this.dataRichmedia.cover == "true") {
      var divCover = document.createElement('div');
      divCover.style.backgroundColor = this.dataRichmedia.bgColor;
      divCover.style.zIndex = 2;
      divCover.setAttribute('id','cover');
      this.containerRichmedia.appendChild(divCover);
    }

    /* SET VIDEO CONTAINER AND POSTER */

    this.containerVideo = document.createElement('div');
    this.containerVideo.setAttribute('id',this.videoObj.containerId);
    this.containerVideo.style.position = "relative";
    if(this.videoObj.containerAutoAlpha === 0){
      this.containerVideo.style.opacity = 0;
      this.containerVideo.style.visibility = 'hidden';
    }
    this.containerVideo.style.zIndex = 4;
    this.containerRichmedia.appendChild(this.containerVideo);

    this.poster = new Image();
    this.poster.src= this.imgPath + 'poster.png';
    this.poster.style.left = this.videoObj.playerPositions.x + 'px';
    this.poster.style.top = this.videoObj.playerPositions.y + 'px';
    this.poster.style.cursor = 'pointer';
    this.poster.style.zIndex = 2;
    this.poster.setAttribute('id','poster');
    this.poster.setAttribute('data','video1');
    this.containerVideo.appendChild(this.poster);

    this.setVideoAssets();

    /* SET FRAMES */

    var totalFrames = 0;
    var arrayIdFrames = [];

    for(var items in this.frameData){
      this.arrayElements.push(this.frameData[items]);
      arrayIdFrames.push(items.toString());
      totalFrames++;
    };

    for (var i = 0; i < totalFrames; i++) {
      this.totalImg += this.arrayElements[i].length;
    };

    for (var ii = 0; ii < totalFrames; ii++) {
      var divTemp = document.createElement('div');
      divTemp.classList.add('frame');
      divTemp.setAttribute('id',arrayIdFrames[ii]);
      this.containerRichmedia.appendChild(divTemp);
      this.arrayFrames.push(divTemp);

      this.setImgs(this.arrayFrames[ii],this.arrayElements[ii]);
    };

    /* SET CLICKTAG */

    this.setClickTag();
  };

  Richmedia.prototype.setImgs = function(frameSelected,elementsSelected){
    elementsSelected.forEach(function(i){
      var imgTemp = new Image();
      imgTemp.src = Richmedia.scope.imgPath + i;
      frameSelected.appendChild(imgTemp);
      var pointerCut = i.indexOf(".");
      var stringSelected = i.substr(0,pointerCut);
      imgTemp.setAttribute('id',stringSelected);
      imgTemp.onload = Richmedia.scope.imgLoaded();
    });
  };

  Richmedia.prototype.imgLoaded = function(){
    Richmedia.scope.counterImg++;
    if(Richmedia.scope.counterImg == Richmedia.scope.totalImg) Richmedia.scope.createTimeLine();
  };

  /* SET VIDEOS ASSETS */

  Richmedia.prototype.setVideoAssets = function(){
    this.videoObj.arrayIdVideos.forEach(function(video,i){
      var videoTemp = document.createElement('video');

      videoTemp.setAttribute('id','video' + (i+1));
      videoTemp.setAttribute('controls',true);
      videoTemp.setAttribute('class','player');
      videoTemp.style.position = 'absolute';
      videoTemp.style.left = this.videoObj.playerPositions.x + 'px';
      videoTemp.style.top = this.videoObj.playerPositions.y + 'px';
      videoTemp.style.zIndex = 1;
      videoTemp.style.width = this.videoObj.playerWidth;
      videoTemp.style.height = this.videoObj.playerHeight;

      for(var ii=0;ii<this.videoObj.arrayExtensions.length;ii++){
        var sourceTemp = document.createElement('source');
        sourceTemp.src = this.videoPath + 'video' + (i+1) + '.' + this.videoObj.arrayExtensions[ii];
        sourceTemp.type = 'video/' + this.videoObj.arrayExtensions[ii];
        videoTemp.appendChild(sourceTemp);
      }

      Richmedia.scope.containerVideo.appendChild(videoTemp);

      /* SET BTNS VIDEO */

      if(this.videoObj.arrayBtnSrc != undefined) {
        var btnTemp = new Image();
        var pointerCut = this.videoObj.arrayBtnSrc[i].indexOf(".");
        var stringSelected = this.videoObj.arrayBtnSrc[i].substr(0,pointerCut);

        btnTemp.src = this.imgPath + this.videoObj.arrayBtnSrc[i];
        btnTemp.style.left = this.videoObj.arrayBtnPosX[i] + 'px';
        btnTemp.style.top = this.videoObj.arrayBtnPosY[i] + 'px';
        btnTemp.style.cursor = 'pointer';
        btnTemp.setAttribute('id',stringSelected);
        btnTemp.setAttribute('data','video' + (i+1));
        Richmedia.scope.arrayBtn.push(btnTemp);

        Richmedia.scope.containerVideo.appendChild(btnTemp);
      };
    });
  };

  /* SET LISTENERS */

  Richmedia.prototype.addListeners = function(){
    this.clicktag.addEventListener('click', Richmedia.scope.goClickTag);
    this.poster.addEventListener('click', Richmedia.scope.showVideo);

    for(var i=0; i < this.arrayBtn.length; i++) {
      this.arrayBtn[i].addEventListener('mouseenter', Richmedia.scope.overBtn);
      this.arrayBtn[i].addEventListener('mouseleave', Richmedia.scope.outBtn);
      this.arrayBtn[i].addEventListener('click', Richmedia.scope.showVideo);
    }
  }

  Richmedia.prototype.overBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:.9, ease:Back.easeInOut});
  }

  Richmedia.prototype.outBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:1, ease:Back.easeInOut})
  }

  /* CLICKTAG */

  Richmedia.prototype.setClickTag = function(){
    this.clicktag = document.createElement('div');
    this.clicktag.setAttribute('id','clicktag');
    this.clicktag.style.position = "absolute";
    this.clicktag.style.width = this.containerRichmedia.style.width;
    this.clicktag.style.height = this.containerRichmedia.style.height;
    this.clicktag.style.opacity = 0;
    this.clicktag.style.cursor = 'pointer';
    this.clicktag.style.zIndex = 3;
    this.containerRichmedia.appendChild(this.clicktag);
  }

  Richmedia.prototype.goClickTag = function(){
    if(!Richmedia.scope.firstClick) Richmedia.scope.stopVideo(true);
    Richmedia.scope.videoObj.clicktagFunction();
  }

  /* VIDEO FUNCTIONS */

  Richmedia.prototype.showVideo = function(e){
    var data = e.currentTarget.getAttribute('data');
    var videoSelected = document.getElementById(data);

    Richmedia.scope.stopVideo(false);

    if(Richmedia.scope.firstClick){
      Richmedia.scope.firstClick = false;
      videoSelected.style.zIndex = 2;

      TweenMax.to(Richmedia.scope.poster, .5, {autoAlpha:0,onComplete:function(){
        videoSelected.play();
      }});

    } else {
      videoSelected.style.zIndex = 2;
      videoSelected.currentTime = 0;
      videoSelected.play();
    }
  }

  Richmedia.prototype.stopVideo = function(fromClicktag){
    document.querySelectorAll('.player').forEach(function(player){
      player.pause();
      if(!fromClicktag) player.style.zIndex = 1;
    });
  }

  Richmedia.prototype.createTimeLine = function(){

    /* CREATE TIMELINE */

    Richmedia.scope.tl = new TimelineMax();
    Richmedia.scope.tl.paused(true);

    /* SET TIMELINE */

    Richmedia.scope.timelineData.arrayTween.forEach(function(i){
      Richmedia.scope.numTween++;
      Richmedia.scope.tl.addLabel('step_' + Richmedia.scope.numTween);
      switch(i.type){
        case 'set':
          Richmedia.scope.tl.add(TweenMax.set(i.id, i.prop),i.delay);
        break;
        case 'to':
          Richmedia.scope.tl.add(TweenMax.to(i.id, i.time, i.prop),i.delay);
        break;
        case 'from':
          Richmedia.scope.tl.add(TweenMax.from(i.id, i.time, i.prop),i.delay);
        break;
        case 'fromTo':
          Richmedia.scope.tl.add(TweenMax.fromTo(i.id, i.time, i.propInit, i.propEnd),i.delay);
        break;
      }
    });

    Richmedia.scope.tl.addCallback(
      function(){Richmedia.scope.endTimeLine(Richmedia.scope.timelineData.loopIteration, Richmedia.scope.timelineData.loopLabelInit)}
    );

    if(Richmedia.scope.timelineData.initLabel == undefined || Richmedia.scope.timelineData.initLabel == false) Richmedia.scope.tl.resume(0);
    else Richmedia.scope.tl.resume(Richmedia.scope.timelineData.initLabel);

    if(Richmedia.scope.timelineData.addPauseAt != undefined) Richmedia.scope.addPauseAt(Richmedia.scope.timelineData.addPauseAt);
  };

  Richmedia.prototype.endTimeLine = function(numRepeat, label){
    if(numRepeat == 1) return;
    else if(numRepeat == -1 || numRepeat == undefined) Richmedia.scope.tl.resume(0);
    else{
      Richmedia.scope.iteration++;
      if(numRepeat > 1 && Richmedia.scope.iteration == numRepeat - 1) {
        var lastLabel;
        if(Richmedia.scope.timelineData.loopLabelEnd == undefined || Richmedia.scope.timelineData.loopLabelEnd == false) {
          lastLabel = Richmedia.scope.tl.getLabelsArray()[Richmedia.scope.tl.getLabelsArray().length-1];
          Richmedia.scope.lastLabelName = lastLabel.name;
        } else {
          lastLabel = Richmedia.scope.timelineData.loopLabelEnd;
          Richmedia.scope.lastLabelName = lastLabel;
        }
        Richmedia.scope.tl.addPause(Richmedia.scope.lastLabelName);
      }
      if(Richmedia.scope.iteration == numRepeat) return;
    }
    label != undefined || label == false ? Richmedia.scope.tl.resume(label) : Richmedia.scope.tl.resume(0);
  };

  Richmedia.prototype.addPauseAt = function(labelOrSecond){
    Richmedia.scope.tl.addPause(labelOrSecond);
  };

  return Richmedia;
})();





