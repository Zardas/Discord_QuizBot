const Discord = require('discord.js');

const client = new Discord.Client();

const quizModule = require('./quizModule');

var quiz;

const listeAutorises = ["QuizMaster", "BZU"];

function estAutorise(message) {

  var i = 0;
  var estAutorise = undefined;

  while(i < listeAutorises.length && estAutorise == undefined) {
    estAutorise = message.member.roles.cache.find(r => r.name === listeAutorises[i]);
    i++;
  }

  return (estAutorise != undefined);
}





client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}.`);
});
  

client.on('message', message => {


    if (message.content === 'test') {

      quiz = new quizModule.Quiz();

  
      if(estAutorise(message)) {
        quiz.setQuizz('quiz.txt');
      } else {
        message.reply("Vous n'avez pas les droits pour ça");
      }

    } else if (message.content == '!participe') {

      quiz.ajoutParticipants(message.author);
      console.log(quiz.participants);
      message.channel.send(quiz.participants);
      
    } else if(message.content == '!next') {
      quiz.askNextQuestion(message.channel);
    }


    // On ajoute les emoji de réponse au message venant d'être posé
    if(message.author.tag == client.user.tag) {
        quiz.ajoutEmojiReponse(message);
    }


});







//Login du client à l'application
client.login('')