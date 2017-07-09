var nowDate;
var timer;

function set2fig(num) {
	   // 数値が1桁だったら2桁の文字列にして返す
	   var ret;
	   if( num < 10 ) { ret = "0" + num; }
	   else { ret = num; }
	   return ret;
}
function isNumOrZero(num) {
   // 数値でなかったら0にして返す
   if( isNaN(num) ) { return 0; }
   return num;
}
function showCountdown() {
   // 現在日時を数値(1970-01-01 00:00:00からのミリ秒)に変換
   nowDate = new Date();
   var dnumNow = nowDate.getTime();
 
   // 指定日時を数値(1970-01-01 00:00:00からのミリ秒)に変換
   var inputYear  = $("#endYear").val();
   var inputMonth = $("#endMonth").val();
   var inputDate  = $("#endDate").val();
   var inputHour  = $("#endHour").val();
   var inputMin   = $("#endMin").val();
   var inputSec   = $("#endSec").val();
   var targetDate = new Date( isNumOrZero(inputYear), isNumOrZero(inputMonth), isNumOrZero(inputDate), isNumOrZero(inputHour), isNumOrZero(inputMin), isNumOrZero(inputSec) );
   var dnumTarget = targetDate.getTime();
 
   // 表示を準備
   var dlMin   = targetDate.getMinutes();
   var dlSec   = targetDate.getSeconds();
 
   // 引き算して日数(ミリ秒)の差を計算
   var diff2Dates = dnumTarget - dnumNow;
 
   // 差のミリ秒を、日数・時間・分・秒に分割
   var dDays  = diff2Dates / ( 1000 * 60 * 60 * 24 );   // 日数
   diff2Dates = diff2Dates % ( 1000 * 60 * 60 * 24 );
   var dHour  = diff2Dates / ( 1000 * 60 * 60 );   // 時間
   diff2Dates = diff2Dates % ( 1000 * 60 * 60 );
   var dMin   = diff2Dates / ( 1000 * 60 );   // 分
   diff2Dates = diff2Dates % ( 1000 * 60 );
   var dSec   = diff2Dates / 1000;   // 秒
   var msg = Math.floor(dMin) + ":"
            + Math.floor(dSec);
 
   // 作成した文字列を表示
   $("#pomodoroTimer").empty();
   $("#pomodoroTimer").append(msg);
}

$(document).on("click", "#startButton", function(){
	// TODOを表示させる
	var todoText = $('input[name="todoForm"]').val();
	var createText = '<font class="viewTodo">' + todoText + '</font>';
	$("#todotodo font").remove();
	$("#todotodo").append(createText);
	$('input[name="todoForm"]').val("");
	//スタートボタンを消してストップボタンを作る
	$("#startButton").remove();
	var createStop = createStopButton();
	$("#buttonPosition").append(createStop);
	nowDate = new Date();
	$("#endYear").val(nowDate.getFullYear());
	$("#endMonth").val(nowDate.getMonth() + 1);
	$("#endDate").val(nowDate.getDate());
	$("#endHour").val(nowDate.getHours());
	$("#endMin").val(nowDate.getMinutes() + 30);
	$("#endSec").val(nowDate.getSeconds());
	timer = setInterval('showCountdown()',1000);
});

$(document).on("click", "#stopButton", function(){
	clearInterval(timer);
	$("#stopButton").remove();
	var createStart = createStartButton();
	$("#buttonPosition").append(createStart);
	
});

function createStopButton(){
	return '<a href="#" class="square_btn" id="stopButton">STOP</a>'
}

function createStartButton(){
	return '<a href="#" class="square_btn" id="startButton">START</a>'
}
