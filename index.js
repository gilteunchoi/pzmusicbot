const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const client = new Discord.Client();
const token = "Example.Token_like.THIS";
const prefix = "++";
const adminID = "000000000000000000";
const broadcast = client.voice.createBroadcast();
client.on('ready', () => {
	console.log('판초봇 now online!');
	client.user.setActivity('++help | 1overN#7792');
	client.on('message', async message => {
		if (!message.guild) return;
		if (message.content === prefix + 'help') {
			var help = "++p [URL] : 해당 유튜브 영상을 재생합니다."
			help = help + "\n" + "++s [검색어] : [검색어]를 유튜브에서 검색합니다, 상위 10개의 결과를 반환합니다."
			help = help + "\n" + "(영어 단어 검색만 지원합니다 *RegExp(\\w))"
			help = help + "\n" + "++[숫자] [검색어] : [검색어]의 [숫자]번째 결과를 재생합니다."
			help = help + "\n" + "++l : 해당 채널에서 퇴장합니다."
			message.reply("```" + help + "```");
		}		
		if (message.content.startsWith(prefix + 'p')) {
			var content = message.content.slice(4);
			if (message.member.voice.channel) {
	    		message.reply('\:cd: 틀어드릴게요');
	    		message.member.voice.channel.join()
		    		.then(connection => {
			        	const dispatcher = connection.play(ytdl(content, { filter: 'audioonly' }));
			        	dispatcher.on("end", end => {});
			        })
			        .catch(console.log);
			} else {
			    message.reply('음성 채널에 먼저 입장하세요');
			}
		}
		if (message.content.startsWith(prefix + 's')) {
			var content = message.content.slice(4);
			var engCheck = /\W/;
			if (engCheck.test(content)){
				message.reply('영어 단어 검색만 지원합니다')
			}else{
				message.reply('검색 중이에요...')
			    request("https://www.youtube.com/results?search_query=" + content, (error, response, html) => {
			    	if (!error && response.statusCode == 200){
				    	var $ = cheerio.load(html);
				    	var videolist = ""
				    	for(var i = 0; i < 10; i++){
				    		videolist = videolist + (i) + " " + $('.yt-lockup-title a').eq(i).text() + "\n"
				    	}
						message.reply("```" + videolist + "```");
						fs.writeFile('./response.html', $('body').html(), 'utf8', function(err){
		                    if(err) throw err;
		                });
			        }
			    });				
			}
		}
		if(message.content.startsWith(prefix + '0') || message.content.startsWith(prefix + '1') || message.content.startsWith(prefix + '2') || message.content.startsWith(prefix + '3') || message.content.startsWith(prefix + '4') || message.content.startsWith(prefix + '5') || message.content.startsWith(prefix + '6') || message.content.startsWith(prefix + '7') || message.content.startsWith(prefix + '8') || message.content.startsWith(prefix + '9')) {
			var content = message.content.slice(4)
			var number = message.content.slice(2, 3)
	    	if (message.member.voice.channel) {
	    		message.reply('\:cd: 틀어드릴게요');
			    request("https://www.youtube.com/results?search_query=" + content, (error, response, html) => {
			    	if (!error && response.statusCode == 200){
				    	var $ = cheerio.load(html);
						message.member.voice.channel.join()
			    		.then(connection => { // Connection is an instance of VoiceConnection
				        	const dispatcher = connection.play(ytdl("https://www.youtube.com" + $('.yt-lockup-title a').eq(number).attr('href'), { filter: 'audioonly' }));
				        	dispatcher.on("end", end => {});
				        })
				        .catch(console.log);
			        }
			    });
			} else {
			    message.reply('음성 채널에 먼저 입장하세요');
			}
		}
		if (message.content === prefix + 'l') {
	    	if (message.member.voice.channel) {
			   	message.member.voice.channel.leave();
			   	message.reply('나갈게요');
			} else {
			    message.reply('음성 채널에 먼저 입장하세요');
			}
		}
	});
});
client.login(token);