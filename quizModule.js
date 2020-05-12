const fs = require('fs');
const Discord = require('discord.js');

const questionModule = require('./questionModule');

const emojiReponses = ['numberOne', 'numberTwo', 'numberThree', 'numberFour', 'numberFive'];

module.exports = {
    hello: function() {
       return "Hello";
    },

    Quiz: class{

        constructor() {
            this.questions = [];
            this.participants = [];
            this.number_currentQuestion = 0;
        }

        setQuizz(file) {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                
                // Le fichier a été lu avec succès
                data = data.split("{Question} "); // On sépare chaque question

                //La première ligne ne compte pas
                for(var i = 1 ; i < data.length ; i++) {
                    this.questions.push(new questionModule.Question(data[i]));
                }
            });
        }

        ajoutParticipants(author) {

            this.participants.push(author);
            //console.log(this.participants);
            //message.reply(this.participants);
        }

        getParticipants() {
            return this.participants;
        }

        askNextQuestion(channel) {
            
            var currentQuestion = this.questions[this.number_currentQuestion];
            var question_text = "Question " + (this.number_currentQuestion + 1) + " : \n"
            + currentQuestion.question;
            
            for(var i = 0 ; i < currentQuestion.reponses.length ; i++) {
                var rep = currentQuestion.reponses[i].reponse;
                question_text += "\n Réponse " + (i+1) + " : " + currentQuestion.reponses[i].reponse;
            }

            var message = channel.send(question_text);

            /*for(var i = 0 ; i < currentQuestion.reponses.length ; i++) {
                message.react(emojiReponses[i]);
            }*/
            
        }

        ajoutEmojiReponse(message) {

            for(var i = 0 ; i < this.questions[this.number_currentQuestion].reponses.length ; i++) {
                var emoji = message.guild.emojis.cache.find(emoji => emoji.name == emojiReponses[i]);
                message.react(emoji.id);
            }

            this.number_currentQuestion += 1;
        }
    }
}




