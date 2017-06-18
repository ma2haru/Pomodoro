/*
 * ファイルのデータセットを作成します
 */
function createAllFileInfo() {
	// html内のscriptからcsvを抽出したもの
	var fileData = document.getElementById("csv").text.split(",");

	// ファイルデータ出力用の配列
	var fileDataSet = [];

	// 3つ区切りにして配列に入れ直す
	for(var i = 0; i < fileData.length; i += 3) {
		var dataSet = [fileData[i], fileData[i + 1], fileData[i + 2]];
		fileDataSet.push(dataSet);
	}

	return fileDataSet;
}

/*
 * 与えられたファイルデータからhtmlを作成します
 */
function createContent(fileData) {
	// ファイル指定パラメータ
	var fileParam = fileData[0];
	// 記事タイトル
	var fileTitle = fileData[1];
	// index用の画像参照先
	var fileImage = fileData[2];

	// index用の画像の指定がない場合は既定値の画像を利用する
	if(fileImage == "") {
		fileImage = "no_image.jpg";
	}

	var content = "<div class=\"col-md-3 content\"><div class=\"card\"><img class=\"card-img-top\" src=\"./resourse/" + fileParam + "/" + fileImage + "\"><div class=\"card-block\"><h4 class=\"card-title\">" + fileTitle + "</h4></div><a href=\"./resourse/" + fileParam + "/" + fileParam + ".html\"></a></div></div>";
/*
 * 変数contentの内容は以下のhtmlを1行に書いたもの
 * ---
 *
 *	<div class="col-md-3 content">
 *		<div class="card">
 *			<img class="card-img-top" src="../image/index用画像参照先">
 *			<div class="card-block">
 *				<h4 class="card-title">タイトル名</h4>
 *			</div>
 *			<a href="./contents/ファイル名"></a>
 *		</div>
 *	</div>
 *
 */

	return content;
}

/*
 * 項目を取得してcontents-areaに表示します
 */
function createIndexContents(page) {
	// ファイルデータセット
	var allFileInfo = createAllFileInfo();
	// contents-areaのDOM
	var contents_area = document.getElementById("contents-area");
	// contents-areaに表示するhtml
	var contentsAreaHTML = "";

	// 最終ページかどうか
	var endFlag = false;

	// bootstrapのrowクラス
	contentsAreaHTML += "<div class=\"row\">"

	// 表示する記事数の調整を行う
	var contentsPerPage = 12;
	var start = 0;
	var end = contentsPerPage;
	// 要素の数が1ページの上限に満たない場合、回数を調整する
	if(allFileInfo.length <= contentsPerPage) {
		end = allFileInfo.length;
	}
	// ループする必要な回数を計算する
	if(page > 1) {
		// 1ページあたり12記事を表示する
		start = (page - 1) * contentsPerPage;
		end = start + contentsPerPage;
		// 最後のページだった場合、回数を調整する
		if((allFileInfo.length - end) < 0) {
			endFlag = true;
			end = start + allFileInfo.length % contentsPerPage;
		}
		// 開始位置が最後の要素以降場合、回数を調整する
		if(allFileInfo.length < start) {
			start = Math.floor(allFileInfo.length / contentsPerPage) * contentsPerPage;
			end = start + allFileInfo.length % contentsPerPage;
		}
	}

	// index.htmlのcontentを作成する
	for(var i = start; i < end; i++) {
		contentsAreaHTML += createContent(allFileInfo[i]);
	}

	// bootstrapのrowクラスの終了タグ
	contentsAreaHTML += "</div>"

	// タグ内に書き込む
	contents_area.innerHTML = contentsAreaHTML;

	// 下部のボタンのリンク作成
	addBeforePageLink(page, endFlag);

	return 0;
}

function addOnClickReload(id) {
	var element = document.getElementById(id);
	// onClickListenerの上書き
	element.onclick = function() {
		// 再読み込みを行う
		location.reload();
	}

	return 0;
}

function addBeforePageLink(page, endflag) {
	var button = document.getElementById("before");
	var hash;

	// もし最終ページでなければ
	if(!endflag) {
		hash = Number(page) + 1;
	} else {
		hash = Number(page);
	}

	button.href = "./index.html#" + hash;

	return 0;
}

function parseMarkdown() {
	// html内のscriptからmarkdownを抽出したもの
	var markdown = document.getElementById("md").text;
	// contents-areaのDOM
	var content = document.getElementById("markdown-area");

	content.innerHTML = marked(markdown);

	return 0;
}

window.onload = function () {
	// ファイルパスを分解したもの
	var pathNames = location.href.split("/");
	// 分解したファイルパスからファイル名取得(パラメータ、アンカーを含む)
	var fileName = pathNames[pathNames.length - 1];

	// URLのパラメータ
	var urlParam = location.search;
	// URLのアンカー
	var urlHash = location.hash;

	// ファイル名に含まれるパラメータを取り除く
	if(urlParam != "") {
		fileName = fileName.substr(0, fileName.length - urlParam.length);
	}
	// ファイル名に含まれるアンカーを取り除く
	if(urlHash != "") {
		fileName = fileName.substr(0, fileName.length - urlHash.length);
	}

	// "?"を削除する
	var urlParam = urlParam.substring(1);
	// "#"を削除する
	var hash = urlHash.substring(1);

	// urlParamを更に分解する
	var param = urlParam.split("&");
	// パラメータを配列に格納する
	var paramArray = [];
	for (var i = 0; i < param.length; i++) {
		var paramItem = param[i].split('=');
		paramArray[paramItem[0]] = paramItem[1];
	}

	if(fileName == "index.html") {		// indexの項目の表示を行う
		createIndexContents(hash);
		addOnClickReload("title");
		addOnClickReload("before");
	} else {							// templateにマークダウンファイルをパースしたものの表示を行う
		parseMarkdown();
	}

	return 0;
}