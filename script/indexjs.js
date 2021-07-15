var n = 0;
        $('#addInput').click(function () {
            n++;
            $('#content').append(`<div id='addVideo${n}' style='position:"relative"'></div>`);
            $(`div[id='addVideo${n}']`).append(`<input type="text" id='myInput${n}' placeholder="Paste YouTube URL" name="v">`);
            $(`div[id='addVideo${n}']`).append(`<div id='removeInput${n}' class='myButton removeButton'> X </div>`);

        });

        $(document).on("click", "div[id^='removeInput']", function () {
            var removeNumber = this.id.replace('removeInput', '');
            $(`div[id='addVideo${removeNumber}']`).remove();
        });

        $('#goWatch').click(function () {
            var checkInput = $('input').serializeArray();
            for (var i = 0; i < checkInput.length; i++) {
                if (checkInput[i].value.indexOf('https://www.youtube.com/watch?v=') == -1 ||            //檢查輸入有無包含youtube網址
                    checkInput[i].value.replace('https://www.youtube.com/watch?v=','').length !=11) {   //檢查影片參數是否為11碼
                    $(`input[id='myInput${i}']`).val('');   //設定為空
                }else{
                    $(`input[id='myInput${i}']`).val(checkInput[i].value.replace('https://www.youtube.com/watch?v=',''));//刪除前面網域
                }
            }
            var temp = $('input').serialize();//序列化取得所有input
            location.href = `watch.html?${temp}`;
        });