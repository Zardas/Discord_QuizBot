const fs = require('fs');

module.exports = {

        Question: class{

        constructor(question) {

            var lignes = question.split("\n");

            //lignes[0] = question
            var question_ = lignes[0].split(" {Points} ");

            this.question = question_[0];
            this.points = Number(question_[1]);
            
            console.log("Question : " + this.question);
            console.log("Points : " + this.points + " points");

            //Mise en place des reponses
            this.reponses = [];
            //Pour chaque réponse
            for(var i = 1 ; i < lignes.length-1 ; i++) {
                
                var reponse_ = lignes[i].split(" | ");

                if(reponse_[1].replace("\r", "") == "1") {
                    this.reponses.push({reponse: reponse_[0], vrai: true});
                } else {
                    this.reponses.push({reponse: reponse_[0], vrai: false});
                }

            }

            //console.log("Réponses possible : ");
            //console.log(this.reponses);
            //console.log("////");
        }

        
        //Ajouter une réponse
        addReponse(reponse, bonneReponse) {
            this.reponses.push({
                reponse: reponse,
                bonneReponse: bonneReponse
            });
        }

        listReponses() {
            var list = "Réponses possibles :";

            for(var i = 0 ; i < this.reponses.length; i++) {
                list += "\n " + this.reponses[i].reponse + "(" + this.reponses[i].bonneReponse + ")";
            }

            return list;
        }

    }
}




