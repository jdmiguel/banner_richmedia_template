var JDMRichmedia = (function(){
  function JDMRichmedia(containerJDMRichmedia,imgPath,videoPath,frameObj,videoObj,timelineObj){
    JDMRichmedia.scope = this;

    this.containerJDMRichmedia = containerJDMRichmedia;
    this.imgPath = imgPath;
    this.videoPath = videoPath;
    this.frameData = frameObj;
    this.timelineData = timelineObj;
    this.videoObj = videoObj;
    this.dataJDMRichmedia;

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

    this.configureJDMRichmedia();
    this.addListeners();
  }

  JDMRichmedia.prototype.configureJDMRichmedia = function(){
    this.dataJDMRichmedia = {
      width: this.containerJDMRichmedia.getAttribute('data-w'),
      height: this.containerJDMRichmedia.getAttribute('data-h'),
      bgColor: this.containerJDMRichmedia.getAttribute('data-bg-color'),
      border: this.containerJDMRichmedia.getAttribute('data-border'),
      preload: this.containerJDMRichmedia.getAttribute('data-preload'),
      cover: this.containerJDMRichmedia.getAttribute('data-cover')
    }

    /* SET MAIN STYLES */

    this.containerJDMRichmedia.style.width = this.dataJDMRichmedia.width + 'px';
    this.containerJDMRichmedia.style.height = this.dataJDMRichmedia.height + 'px';
    this.containerJDMRichmedia.style.backgroundColor = this.dataJDMRichmedia.bgColor;
    this.containerJDMRichmedia.style.border = this.dataJDMRichmedia.border;

    /* SET COVER */

    if(this.dataJDMRichmedia.cover == "true") {
      var divCover = document.createElement('div');
      divCover.style.backgroundColor = this.dataJDMRichmedia.bgColor;
      divCover.style.zIndex = 2;
      divCover.setAttribute('id','cover');
      this.containerJDMRichmedia.appendChild(divCover);
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
    this.containerJDMRichmedia.appendChild(this.containerVideo);

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
      this.containerJDMRichmedia.appendChild(divTemp);
      this.arrayFrames.push(divTemp);

      this.setImgs(this.arrayFrames[ii],this.arrayElements[ii]);
    };

    /* SET CLICKTAG */

    this.setClickTag();
  };

  JDMRichmedia.prototype.setImgs = function(frameSelected,elementsSelected){
    elementsSelected.forEach(function(i){
      var imgTemp = new Image();
      imgTemp.src = JDMRichmedia.scope.imgPath + i;
      frameSelected.appendChild(imgTemp);
      var pointerCut = i.indexOf(".");
      var stringSelected = i.substr(0,pointerCut);
      imgTemp.setAttribute('id',stringSelected);
      imgTemp.onload = JDMRichmedia.scope.imgLoaded();
    });
  };

  JDMRichmedia.prototype.imgLoaded = function(){
    JDMRichmedia.scope.counterImg++;
    if(JDMRichmedia.scope.counterImg == JDMRichmedia.scope.totalImg) JDMRichmedia.scope.createTimeLine();
  };

  /* SET VIDEOS ASSETS */

  JDMRichmedia.prototype.setVideoAssets = function(){
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

      JDMRichmedia.scope.containerVideo.appendChild(videoTemp);

      /* SET BTNS VIDEO */

      if(this.videoObj.arrayBtnSrc.length > 1) {
        var btnTemp = new Image();
        var pointerCut = this.videoObj.arrayBtnSrc[i].indexOf(".");
        var stringSelected = this.videoObj.arrayBtnSrc[i].substr(0,pointerCut);

        btnTemp.src = this.imgPath + this.videoObj.arrayBtnSrc[i];
        btnTemp.style.left = this.videoObj.arrayBtnPosX[i] + 'px';
        btnTemp.style.top = this.videoObj.arrayBtnPosY[i] + 'px';
        btnTemp.style.cursor = 'pointer';
        btnTemp.setAttribute('id',stringSelected);
        btnTemp.setAttribute('data','video' + (i+1));
        JDMRichmedia.scope.arrayBtn.push(btnTemp);

        JDMRichmedia.scope.containerVideo.appendChild(btnTemp);
      };
    });
  };

  /* SET LISTENERS */

  JDMRichmedia.prototype.addListeners = function(){
    this.clicktag.addEventListener('click', JDMRichmedia.scope.goClickTag);
    this.poster.addEventListener('click', JDMRichmedia.scope.showVideo);

    for(var i=0; i < this.arrayBtn.length; i++) {
      this.arrayBtn[i].addEventListener('mouseenter', JDMRichmedia.scope.overBtn);
      this.arrayBtn[i].addEventListener('mouseleave', JDMRichmedia.scope.outBtn);
      this.arrayBtn[i].addEventListener('click', JDMRichmedia.scope.showVideo);
    }
  }

  JDMRichmedia.prototype.overBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:.9, ease:Back.easeInOut});
  }

  JDMRichmedia.prototype.outBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:1, ease:Back.easeInOut})
  }

  /* CLICKTAG */

  JDMRichmedia.prototype.setClickTag = function(){
    this.clicktag = document.createElement('div');
    this.clicktag.setAttribute('id','clicktag');
    this.clicktag.style.position = "absolute";
    this.clicktag.style.width = this.containerJDMRichmedia.style.width;
    this.clicktag.style.height = this.containerJDMRichmedia.style.height;
    this.clicktag.style.opacity = 0;
    this.clicktag.style.cursor = 'pointer';
    this.clicktag.style.zIndex = 3;
    this.containerJDMRichmedia.appendChild(this.clicktag);
  }

  JDMRichmedia.prototype.goClickTag = function(){
    if(!JDMRichmedia.scope.firstClick) JDMRichmedia.scope.stopVideo(true);
    JDMRichmedia.scope.videoObj.clicktagFunction();
  }

  /* VIDEO FUNCTIONS */

  JDMRichmedia.prototype.showVideo = function(e){
    var data = e.currentTarget.getAttribute('data');
    var videoSelected = document.getElementById(data);

    JDMRichmedia.scope.stopVideo(false);

    if(JDMRichmedia.scope.firstClick){
      JDMRichmedia.scope.firstClick = false;
      videoSelected.style.zIndex = 2;

      TweenMax.to(JDMRichmedia.scope.poster, .5, {autoAlpha:0,onComplete:function(){
        videoSelected.play();
      }});

    } else {
      videoSelected.style.zIndex = 2;
      videoSelected.currentTime = 0;
      videoSelected.play();
    }
  }

  JDMRichmedia.prototype.stopVideo = function(fromClicktag){
    document.querySelectorAll('.player').forEach(function(player){
      player.pause();
      if(!fromClicktag) player.style.zIndex = 1;
    });
  }

  JDMRichmedia.prototype.createTimeLine = function(){

    /* CREATE TIMELINE */

    JDMRichmedia.scope.tl = new TimelineMax();
    JDMRichmedia.scope.tl.paused(true);

    /* SET TIMELINE */

    JDMRichmedia.scope.timelineData.arrayTween.forEach(function(i){
      JDMRichmedia.scope.numTween++;
      JDMRichmedia.scope.tl.addLabel('step_' + JDMRichmedia.scope.numTween);
      switch(i.type){
        case 'set':
          JDMRichmedia.scope.tl.add(TweenMax.set(i.id, i.prop),i.delay);
        break;
        case 'to':
          JDMRichmedia.scope.tl.add(TweenMax.to(i.id, i.time, i.prop),i.delay);
        break;
        case 'from':
          JDMRichmedia.scope.tl.add(TweenMax.from(i.id, i.time, i.prop),i.delay);
        break;
        case 'fromTo':
          JDMRichmedia.scope.tl.add(TweenMax.fromTo(i.id, i.time, i.propInit, i.propEnd),i.delay);
        break;
      }
    });

    JDMRichmedia.scope.tl.addCallback(
      function(){JDMRichmedia.scope.endTimeLine(JDMRichmedia.scope.timelineData.loopIteration, JDMRichmedia.scope.timelineData.loopLabelInit)}
    );

    if(JDMRichmedia.scope.timelineData.initLabel == undefined || JDMRichmedia.scope.timelineData.initLabel == false) JDMRichmedia.scope.tl.resume(0);
    else JDMRichmedia.scope.tl.resume(JDMRichmedia.scope.timelineData.initLabel);

    if(JDMRichmedia.scope.timelineData.addPauseAt != undefined) JDMRichmedia.scope.addPauseAt(JDMRichmedia.scope.timelineData.addPauseAt);
  };

  JDMRichmedia.prototype.endTimeLine = function(numRepeat, label){
    if(numRepeat == 1) return;
    else if(numRepeat == -1 || numRepeat == undefined) JDMRichmedia.scope.tl.resume(0);
    else{
      JDMRichmedia.scope.iteration++;
      if(numRepeat > 1 && JDMRichmedia.scope.iteration == numRepeat - 1) {
        var lastLabel;
        if(JDMRichmedia.scope.timelineData.loopLabelEnd == undefined || JDMRichmedia.scope.timelineData.loopLabelEnd == false) {
          lastLabel = JDMRichmedia.scope.tl.getLabelsArray()[JDMRichmedia.scope.tl.getLabelsArray().length-1];
          JDMRichmedia.scope.lastLabelName = lastLabel.name;
        } else {
          lastLabel = JDMRichmedia.scope.timelineData.loopLabelEnd;
          JDMRichmedia.scope.lastLabelName = lastLabel;
        }
        JDMRichmedia.scope.tl.addPause(JDMRichmedia.scope.lastLabelName);
      }
      if(JDMRichmedia.scope.iteration == numRepeat) return;
    }
    label != undefined || label == false ? JDMRichmedia.scope.tl.resume(label) : JDMRichmedia.scope.tl.resume(0);
  };

  JDMRichmedia.prototype.addPauseAt = function(labelOrSecond){
    JDMRichmedia.scope.tl.addPause(labelOrSecond);
  };

  return JDMRichmedia;
})();





