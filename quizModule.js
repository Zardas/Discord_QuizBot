const fs = require('fs');
const Discord = require('discord.js');

const questionModule = require('./questionModule');
const { Console } = require('console');

//const emojiReponses = ['numberOne', 'numberTwo', 'numberThree', 'numberFour', 'numberFive'];
const reaction_numbers = ["\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

module.exports = {
    hello: function() {
       return "Hello";
    },

    Quiz: class{

        constructor() {
            this.questions = [];
            this.participants = [];
            this.number_currentQuestion = -1;
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

            console.log("Quiz mis à jour");
        }

        ajoutParticipants(author) {

            this.participants.push({author: author, id: author.id, points: 0});
            //console.log(this.participants);
            //message.reply(this.participants);
            console.log("Participant " + author.username + " (" + author.id + ") ajouté");
        }

        getParticipants() {
            return this.participants;
        }

        askNextQuestion(channel) {
            
            this.number_currentQuestion += 1;

            var currentQuestion = this.questions[this.number_currentQuestion];
            var question_text = "Question " + (this.number_currentQuestion + 1) + " : \n"
            + currentQuestion.question;
            
            for(var i = 0 ; i < currentQuestion.reponses.length ; i++) {
                var rep = currentQuestion.reponses[i].reponse;
                question_text += "\n Réponse " + (i+1) + " : " + currentQuestion.reponses[i].reponse;
            }

            var message = channel.send(question_text);
            
            console.log("Nouvelle question posée");
        }

        ajoutEmojiReponse(message) {

            for(var i = 0 ; i < this.questions[this.number_currentQuestion].reponses.length ; i++) {
                //var emoji = message.guild.emojis.cache.find(emoji => emoji.name == emojiReponses[i]);
                //message.react(emoji.id);
                message.react(reaction_numbers[i]);
            }

            

            console.log("Emojis de réponse ajoutés");
            return message;
        }



        checkAnswer(messageToCheck) {

            var q = this.questions[this.number_currentQuestion];
            
            //On fait un passage à travers toutes les réponses pour chaque participant
            this.participants.forEach(participant => {

                var i = 0;
                var participantAbon = true;
                for(var [emoji, reactions] of messageToCheck.reactions.cache) {
                    //i = le numéro de la reponse actuellement check dans this.questions[this.number_currentQuestion]
                    console.log("On vérifie réponse : " + emoji + "  pour l'utilisateur " + participant.author.username); 
                    //console.log("Reaction : " + reactions.users.cache);

                    var aReponduOuiAcetteQuestion = false;
                    //On regarde si le participant à répondu la réponse i
                    for(var [key, idUser] of reactions.users.cache) {
                        //console.log("Key : " + key);

                        aReponduOuiAcetteQuestion = aReponduOuiAcetteQuestion || (idUser == participant.id);
                        //console.log("Value : " + idUser);
                    }

                    var bonneReponse = (aReponduOuiAcetteQuestion && this.questions[this.number_currentQuestion].reponses[i].vrai) ||
                                        (!aReponduOuiAcetteQuestion && !this.questions[this.number_currentQuestion].reponses[i].vrai);

                    var participantAbon = participantAbon && bonneReponse;
                    console.log("L'utilisateur " + participant.author.username + " a répondu oui à cette réponse : " + aReponduOuiAcetteQuestion);
                    console.log("Bonne réponse : " + bonneReponse);
                    i++;
                }

                console.log("////// Le participant a bon pour cette question : " + participantAbon);
                if(participantAbon) {
                    participant.points += this.questions[this.number_currentQuestion].points;
                }
                console.log("////// Nombre de points : " + participant.points);

            });
            
            console.log("Reponses check");

            
        }
    }
}




