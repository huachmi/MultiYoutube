 var getURL = location.href;
 //Domain
 var URLparams = new URL(getURL).searchParams;
 var items = [];
 var params = [];
 var channlename = [];
 //Youtube API KEY***
 var ytAPIKey = '';
 var n = 0;
 for (let pair of URLparams.entries()) {
     if (pair[1] != '') {      //確任v=有值
         items[n] = pair[0];
         params[n] = pair[1];
         n++
     }
 }

 var chat_hidden = false;
 $(function () {
     for (var i = 0; i < n; i++) {
         creatStream(params[i]);         //嵌入畫面
         creatTablist(params[i], i);     //產生聊天室清單
         creatChatroom(params[i], i);    //嵌入聊天室
     }
     optimize_size(n);
     setTimeout(function () {
         optimize_size(n)
     }, 500);
 })

 function creatStream(param) {
     var myIframeStream = document.createElement("iframe");
     myIframeStream.className = "stream";
     myIframeStream.setAttribute("frameborder", "0");
     myIframeStream.setAttribute("allowfullscreen", "");
     myIframeStream.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture ";
     myIframeStream.src = `https://www.youtube.com/embed/${param}?autoplay=1&mute=1`;
     document.getElementById('streams').appendChild(myIframeStream);
 }

 function creatChatroom(param, n) {
     var myIframeChatroom = document.createElement("iframe");
     myIframeChatroom.className = 'stream_chat';
     myIframeChatroom.id = `stream_chat${n}`;
     myIframeChatroom.width = "400";
     if (n == 0)
         myIframeChatroom.style.display = 'block';
     else
         myIframeChatroom.style.display = 'none';
     myIframeChatroom.height = $(window).innerHeight();
     myIframeChatroom.setAttribute("frameborder", "0");
     var localName = window.location.hostname;
     myIframeChatroom.src = `https://www.youtube.com/live_chat?v=${param}&embed_domain=${localName}`;
     document.getElementById('chatbox').appendChild(myIframeChatroom);
 }

 function creatTablist(param, n) {
     $(function () {
         var myURL = `https://www.googleapis.com/youtube/v3/videos?id=${param}&key=${ytAPIKey}&part=snippet`;
         var listcolor = n == 0 ? '#8266b6' : '#333333';
         var temp = $.ajax(myURL)
             .done(function (cat) {
                 $('#tablist').append(`<li id='tablist${n}' style='background-color:${listcolor}'>${cat.items[0].snippet.channelTitle}</li>`);
             })
     })
 }

 window.onresize = function () {
     optimize_size(n);
 }

 function optimize_size(n) {
     // height 減掉 body 預設 margin
     var height = $(window).innerHeight() - 16;
     var width = $("#streams").width();
     if (!chat_hidden) {
         var chat_width = 400;
         var wrapper_width = $("#wrapper").width();
         width = wrapper_width - chat_width - 8;
         var chat_height = height - $("#tablist").height() - 24; //$("#tablist").height()一開始為0
         $("#streams").width(width);
         $("#chatbox").width(chat_width);
         $(".stream_chat").height(chat_height);
     } else {
         var wrapper_width = $("#wrapper").width();
         width = wrapper_width;
         $("#streams").width(width);
     }

     var best_height = 0;
     var best_width = 0;
     var wrapper_padding = 0;
     for (var per_row = 1; per_row <= n; per_row++) {
         var num_rows = Math.ceil(n / per_row);
         var max_width = Math.floor(width / per_row) - 4;
         var max_height = Math.floor(height / num_rows) - 4;
         if (max_width * 9 / 16 < max_height) {
             max_height = max_width * 9 / 16;
         } else {
             max_width = (max_height) * 16 / 9;
         }
         if (max_width > best_width) {
             best_width = max_width;
             best_height = max_height;
             wrapper_padding = (height - num_rows * max_height) / 2;
         }
     }
     $(".stream").height(Math.floor(best_height));
     $(".stream").width(Math.floor(best_width));
     $("#streams").css("padding-top", wrapper_padding);
 }

 $(document).on('click', 'li', function () {
     // $('iframe[id^="stream_chat"]').style.display = 'none'; 失敗
     var sc = document.getElementsByClassName('stream_chat');
     for (var i = 0; i < sc.length; i++) {
         sc[i].style.display = 'none';
     }
     var sb = $(`li[id^=tablist]`);
     for (var i = 0; i < sb.length; i++) {
         sb[i].style.backgroundColor = '#333333';
     }
     // $(`#stream_chat${$(this).text()}`).style.display = 'block'; 失敗
     document.getElementById(`stream_chat${this.id.replace('tablist', '')}`).style.display = 'block';
     document.getElementById(`${this.id}`).style.backgroundColor = '#8266b6';
 })

 $('#toggleChat').click(function () {
     console.log('123');
     chat_hidden = !chat_hidden;
     $('#chatbox').toggle();
     optimize_size(n);
 })